const fs = require("fs");
const path = require("path");
const zlib = require("zlib");
const PDFParser = require("pdf2json");
const mammoth = require("mammoth");
const pdfParse = require("pdf-parse");

// Lazy-loaded Tesseract reference
let _tesseract = null;
async function getTesseract() {
    if (!_tesseract) {
        console.log("[pdfService] Lazy-loading Tesseract.js for OCR fallback...");
        _tesseract = require("tesseract.js");
    }
    return _tesseract;
}

/**
 * Creates a valid Windows BMP Buffer from raw RGB or Grayscale pixel buffer.
 */
function createBmpBuffer(pixelBuffer, width, height, channels = 3) {
    const rowSize = Math.floor((width * channels * 8 + 31) / 32) * 4;
    const pixelArraySize = rowSize * height;
    const fileSize = 54 + (channels === 1 ? 1024 : 0) + pixelArraySize;

    const bmp = Buffer.alloc(fileSize);

    // BITMAPFILEHEADER (14 bytes)
    bmp.write("BM", 0);
    bmp.writeUInt32LE(fileSize, 2);
    bmp.writeUInt16LE(0, 6);
    bmp.writeUInt16LE(0, 8);
    const pixelOffset = 54 + (channels === 1 ? 1024 : 0);
    bmp.writeUInt32LE(pixelOffset, 10);

    // BITMAPINFOHEADER (40 bytes)
    bmp.writeUInt32LE(40, 14);
    bmp.writeInt32LE(width, 18);
    bmp.writeInt32LE(height, 22);
    bmp.writeUInt16LE(1, 26);
    bmp.writeUInt16LE(channels * 8, 28);
    bmp.writeUInt32LE(0, 30);
    bmp.writeUInt32LE(pixelArraySize, 34);
    bmp.writeInt32LE(2835, 38);
    bmp.writeInt32LE(2835, 42);
    bmp.writeUInt32LE(channels === 1 ? 256 : 0, 46);
    bmp.writeUInt32LE(0, 50);

    if (channels === 1) {
        for (let i = 0; i < 256; i++) {
            const offset = 54 + i * 4;
            bmp[offset] = i;
            bmp[offset + 1] = i;
            bmp[offset + 2] = i;
            bmp[offset + 3] = 0;
        }
    }

    let srcOffset = 0;
    for (let y = height - 1; y >= 0; y--) {
        const destRowOffset = pixelOffset + y * rowSize;
        for (let x = 0; x < width; x++) {
            if (channels === 3) {
                const r = pixelBuffer[srcOffset];
                const g = pixelBuffer[srcOffset + 1];
                const b = pixelBuffer[srcOffset + 2];
                bmp[destRowOffset + x * 3] = b;
                bmp[destRowOffset + x * 3 + 1] = g;
                bmp[destRowOffset + x * 3 + 2] = r;
                srcOffset += 3;
            } else if (channels === 1) {
                bmp[destRowOffset + x] = pixelBuffer[srcOffset++];
            }
        }
    }

    return bmp;
}

/**
 * Extracts image buffers (JPEG or BMP) from a PDF file.
 */
function extractImagesFromPdf(pdfBuffer) {
    const images = [];
    const str = pdfBuffer.toString("latin1");
    const streamMarker = Buffer.from("stream");
    const endStreamMarker = Buffer.from("endstream");

    let pos = 0;
    while (pos < pdfBuffer.length) {
        const streamIdx = pdfBuffer.indexOf(streamMarker, pos);
        if (streamIdx === -1) break;

        const dictStart = Math.max(0, streamIdx - 1000);
        const dictText = str.slice(dictStart, streamIdx);

        const isImage = /\/Subtype\s*\/Image\b/.test(dictText);
        const isDct = /\/Filter\s*(?:\/DCTDecode|\[[^\]]*\/DCTDecode[^\]]*\])/i.test(dictText);
        const isFlate = /\/Filter\s*(?:\/FlateDecode|\[[^\]]*\/FlateDecode[^\]]*\])/i.test(dictText);

        let start = streamIdx + 6;
        if (pdfBuffer[start] === 0x0d && pdfBuffer[start + 1] === 0x0a) start += 2;
        else if (pdfBuffer[start] === 0x0a) start += 1;

        const endIdx = pdfBuffer.indexOf(endStreamMarker, start);
        if (endIdx === -1) break;

        let end = endIdx;
        if (pdfBuffer[end - 2] === 0x0d && pdfBuffer[end - 1] === 0x0a) end -= 2;
        else if (pdfBuffer[end - 1] === 0x0a) end -= 1;

        const streamData = pdfBuffer.slice(start, end);

        // 1. Direct JPEG stream check
        if (streamData[0] === 0xff && streamData[1] === 0xd8 && streamData[2] === 0xff) {
            images.push({ type: "jpeg", buffer: streamData });
        } else if (isImage && isDct) {
            images.push({ type: "jpeg", buffer: streamData });
        } else if (isImage && isFlate) {
            try {
                const decompressed = zlib.inflateSync(streamData);
                const widthMatch = dictText.match(/\/Width\s+(\d+)/);
                const heightMatch = dictText.match(/\/Height\s+(\d+)/);
                const isGray = /\/ColorSpace\s*\/DeviceGray/i.test(dictText);
                const width = widthMatch ? parseInt(widthMatch[1], 10) : 0;
                const height = heightMatch ? parseInt(heightMatch[1], 10) : 0;
                const channels = isGray ? 1 : 3;

                if (width > 0 && height > 0 && decompressed.length >= width * height * channels) {
                    const bmpBuffer = createBmpBuffer(decompressed, width, height, channels);
                    images.push({ type: "bmp", buffer: bmpBuffer });
                }
            } catch (err) {
                console.warn("[pdfService] Flate image decompression failed:", err.message);
            }
        }

        pos = endIdx + 9;
    }

    return images;
}

/**
 * Reconstructs layout-aware reading order from Tesseract TSV data.
 * - Identifies visual lines based on vertical proximity.
 * - Detects column gutters dynamically using actual word coordinates.
 * - If single-column, preserves normal top-to-bottom reading order.
 * - If multi-column, separates header, left column, right column, and footer.
 * - Preserves all original words and characters without deletion or summarization.
 */
function reconstructLayoutFromTSV(tsvString) {
    if (!tsvString) return "";
    const lines = tsvString.split("\n");
    const words = [];
    let pageWidth = 0;
    let pageHeight = 0;

    for (const line of lines) {
        const parts = line.split("\t");
        if (parts.length < 12) continue;
        const level = parseInt(parts[0], 10);

        if (level === 1) {
            pageWidth = parseInt(parts[8], 10) || 0;
            pageHeight = parseInt(parts[9], 10) || 0;
        } else if (level === 5) {
            const left = parseInt(parts[6], 10);
            const top = parseInt(parts[7], 10);
            const width = parseInt(parts[8], 10);
            const height = parseInt(parts[9], 10);
            const conf = parseFloat(parts[10]);
            const text = parts[11].trim();

            // Ignore zero-dimension or sub-pixel noise
            if (width <= 5 && height <= 5) continue;
            // Ignore low-confidence isolated non-alphanumeric noise
            if (conf < 15 && text.length <= 2 && !/[a-zA-Z0-9]/.test(text)) continue;

            if (text) {
                words.push({ text, left, top, width, height, right: left + width, bottom: top + height, conf });
            }
        }
    }

    if (words.length === 0) return "";
    if (pageWidth === 0) {
        pageWidth = Math.max(...words.map(w => w.right)) + 50;
    }

    // Step 1: Cluster words into visual horizontal lines
    words.sort((a, b) => a.top - b.top || a.left - b.left);
    const visualLines = [];

    for (const word of words) {
        const wordCenterY = word.top + word.height / 2;
        let matchedLine = null;

        for (const vl of visualLines) {
            const lineCenterY = vl.top + vl.height / 2;
            const threshold = Math.max(word.height, vl.height) * 0.55;
            if (Math.abs(wordCenterY - lineCenterY) <= threshold) {
                matchedLine = vl;
                break;
            }
        }

        if (matchedLine) {
            matchedLine.words.push(word);
            matchedLine.top = Math.min(matchedLine.top, word.top);
            matchedLine.bottom = Math.max(matchedLine.bottom, word.bottom);
            matchedLine.height = matchedLine.bottom - matchedLine.top;
            matchedLine.left = Math.min(matchedLine.left, word.left);
            matchedLine.right = Math.max(matchedLine.right, word.right);
        } else {
            visualLines.push({
                top: word.top,
                bottom: word.bottom,
                height: word.height,
                left: word.left,
                right: word.right,
                words: [word]
            });
        }
    }

    visualLines.sort((a, b) => a.top - b.top);

    // Step 2: Split lines into column segments when there is a wide horizontal gap
    const gapThreshold = Math.max(70, pageWidth * 0.08);
    const segments = [];

    for (const vl of visualLines) {
        vl.words.sort((a, b) => a.left - b.left);
        let currentSeg = {
            left: vl.words[0].left,
            right: vl.words[0].right,
            top: vl.top,
            bottom: vl.bottom,
            words: [vl.words[0]]
        };

        for (let i = 1; i < vl.words.length; i++) {
            const prevWord = vl.words[i - 1];
            const currWord = vl.words[i];
            const gap = currWord.left - prevWord.right;

            if (gap > gapThreshold) {
                currentSeg.text = currentSeg.words.map(w => w.text).join(" ");
                segments.push(currentSeg);

                currentSeg = {
                    left: currWord.left,
                    right: currWord.right,
                    top: vl.top,
                    bottom: vl.bottom,
                    words: [currWord]
                };
            } else {
                currentSeg.words.push(currWord);
                currentSeg.right = Math.max(currentSeg.right, currWord.right);
            }
        }
        currentSeg.text = currentSeg.words.map(w => w.text).join(" ");
        segments.push(currentSeg);
    }

    // Step 3: Conservative Column Detection
    // Test potential column divider between 35% and 65% of page width
    const minDivider = pageWidth * 0.35;
    const maxDivider = pageWidth * 0.65;
    let bestDivider = null;
    let maxScore = -1;

    for (let x = minDivider; x <= maxDivider; x += 15) {
        let leftCount = 0;
        let rightCount = 0;
        let crossCount = 0;

        for (const seg of segments) {
            if (seg.right <= x + 20) {
                leftCount++;
            } else if (seg.left >= x - 20) {
                rightCount++;
            } else {
                crossCount++;
            }
        }

        // Require substantial text on both sides and very few crossing segments
        if (leftCount >= 4 && rightCount >= 4 && crossCount <= (leftCount + rightCount) * 0.25) {
            const score = (leftCount + rightCount) - crossCount * 3;
            if (score > maxScore) {
                maxScore = score;
                bestDivider = x;
            }
        }
    }

    if (bestDivider) {
        // Multi-column layout detected!
        const headerSegments = [];
        const leftSegments = [];
        const rightSegments = [];
        const footerSegments = [];

        // Two-column vertical range
        const colSegments = segments.filter(s => s.right <= bestDivider + 20 || s.left >= bestDivider - 20);
        const colTop = colSegments.length > 0 ? Math.min(...colSegments.map(s => s.top)) : 0;
        const colBottom = colSegments.length > 0 ? Math.max(...colSegments.map(s => s.bottom)) : pageHeight;

        for (const seg of segments) {
            if (seg.bottom < colTop + 20) {
                headerSegments.push(seg);
            } else if (seg.top > colBottom - 20) {
                footerSegments.push(seg);
            } else if (seg.right <= bestDivider + 25) {
                leftSegments.push(seg);
            } else if (seg.left >= bestDivider - 25) {
                rightSegments.push(seg);
            } else {
                // Crossing segment in the middle
                if (seg.top < (colTop + colBottom) / 2) {
                    headerSegments.push(seg);
                } else {
                    footerSegments.push(seg);
                }
            }
        }

        headerSegments.sort((a, b) => a.top - b.top);
        leftSegments.sort((a, b) => a.top - b.top);
        rightSegments.sort((a, b) => a.top - b.top);
        footerSegments.sort((a, b) => a.top - b.top);

        const sections = [];
        if (headerSegments.length > 0) {
            sections.push(headerSegments.map(s => s.text).join("\n"));
        }
        if (leftSegments.length > 0) {
            sections.push(leftSegments.map(s => s.text).join("\n"));
        }
        if (rightSegments.length > 0) {
            sections.push(rightSegments.map(s => s.text).join("\n"));
        }
        if (footerSegments.length > 0) {
            sections.push(footerSegments.map(s => s.text).join("\n"));
        }

        return sections.join("\n\n").trim();
    } else {
        // Conservative fallback: Single-column top-to-bottom reading order
        segments.sort((a, b) => a.top - b.top || a.left - b.left);
        return segments.map(s => s.text).join("\n").trim();
    }
}

/**
 * Fallback OCR extraction for image-only or scanned PDFs.
 * Lazily loads Tesseract.js only when invoked.
 * Reconstructs layout column-by-column when multi-column layout is detected.
 */
async function extractTextWithOCR(filePath) {
    try {
        const pdfBuffer = fs.readFileSync(filePath);
        const images = extractImagesFromPdf(pdfBuffer);

        if (!images || images.length === 0) {
            console.warn("[pdfService] OCR fallback: No embedded images found in PDF.");
            return "";
        }

        console.log(`[pdfService] OCR fallback: Found ${images.length} image(s). Processing with Tesseract.js...`);
        const Tesseract = await getTesseract();
        const recognizedPages = [];

        // Create a worker for layout-aware TSV extraction
        const worker = await Tesseract.createWorker("eng", 1);

        for (let i = 0; i < images.length; i++) {
            console.log(`[pdfService] Running layout-aware OCR on image ${i + 1}/${images.length}...`);
            const result = await worker.recognize(images[i].buffer, {}, { tsv: true, text: true });
            if (result && result.data && result.data.tsv) {
                const layoutText = reconstructLayoutFromTSV(result.data.tsv);
                if (layoutText && layoutText.length > 0) {
                    recognizedPages.push(layoutText);
                } else if (result.data.text) {
                    recognizedPages.push(result.data.text.trim());
                }
            } else if (result && result.data && result.data.text) {
                recognizedPages.push(result.data.text.trim());
            }
        }

        await worker.terminate();

        const ocrFullText = recognizedPages.join("\n\n").trim();
        if (ocrFullText.length >= 50) {
            console.log(`[pdfService] OCR successfully recovered ${ocrFullText.length} characters.`);
            return ocrFullText;
        }

        return ocrFullText;
    } catch (ocrErr) {
        console.warn("[pdfService] OCR fallback encountered an error:", ocrErr.message);
        return "";
    }
}

/**
 * Safely decodes URI-encoded text strings from pdf2json text elements.
 */
function safeDecode(str) {
    if (!str) return "";
    try {
        return decodeURIComponent(str);
    } catch {
        try {
            return unescape(str);
        } catch {
            return String(str);
        }
    }
}

/**
 * Checks if extracted text contains pdf2json Type3 font decoding corruption artifacts.
 * e.g., "G D D G D G G D", "G d ← c a t i", "[←→▼■○]"
 */
function hasCorruptedGlyphs(text) {
    if (!text) return false;
    return /[←→▼■○]|\bG\s+D\s+D\b|\bG\s+[a-z]\s+[←→▼■○]/i.test(text);
}

/**
 * Extracts text from a PDF file in natural top-to-bottom reading order.
 * Sorts text items by vertical position (y coordinate) and horizontal position (x coordinate).
 * Automatically falls back to pdf-parse if pdf2json fails or encounters Type3 font corruption.
 */
async function extractTextFromPDF(filePath) {
    let fullText = "";

    try {
        fullText = await new Promise((resolve, reject) => {
            const pdfParser = new PDFParser();

            pdfParser.on("pdfParser_dataError", (errData) => {
                const errMsg = errData?.parserError?.message || errData?.parserError || "Failed to parse PDF file.";
                console.warn("[pdfService] pdf2json error:", errMsg);
                resolve(""); // Resolve empty string to trigger pdf-parse fallback
            });

            pdfParser.on("pdfParser_dataReady", (pdfData) => {
                try {
                    const pages = pdfData?.Pages || [];
                    if (!pages.length) {
                        return resolve("");
                    }

                    let totalTextItems = 0;
                    const pageTexts = [];

                    for (const page of pages) {
                        const texts = page.Texts || [];
                        totalTextItems += texts.length;

                        if (!texts.length) continue;

                        // Map elements to x, y, and decoded text
                        const elements = texts.map((t) => ({
                            x: t.x || 0,
                            y: t.y || 0,
                            text: safeDecode(t.R?.[0]?.T || "").trim()
                        })).filter((e) => e.text.length > 0);

                        // Sort elements: primary sort by y (top to bottom), secondary by x (left to right)
                        elements.sort((a, b) => {
                            if (Math.abs(a.y - b.y) > 0.3) {
                                return a.y - b.y;
                            }
                            return a.x - b.x;
                        });

                        // Group elements into lines
                        const lines = [];
                        let currentY = null;
                        let currentLine = [];

                        for (const el of elements) {
                            if (currentY === null || Math.abs(el.y - currentY) > 0.3) {
                                if (currentLine.length > 0) {
                                    lines.push(currentLine.join(" ").trim());
                                }
                                currentLine = [el.text];
                                currentY = el.y;
                            } else {
                                currentLine.push(el.text);
                            }
                        }

                        if (currentLine.length > 0) {
                            lines.push(currentLine.join(" ").trim());
                        }

                        if (lines.length > 0) {
                            pageTexts.push(lines.join("\n"));
                        }
                    }

                    if (totalTextItems === 0 || !pageTexts.length) {
                        return resolve("");
                    }

                    resolve(pageTexts.join("\n\n").trim());
                } catch (err) {
                    console.warn("[pdfService] pdf2json processing error:", err.message);
                    resolve("");
                }
            });

            try {
                pdfParser.loadPDF(filePath);
            } catch (loadErr) {
                console.warn("[pdfService] pdf2json load error:", loadErr.message);
                resolve("");
            }
        });
    } catch (err) {
        console.warn("[pdfService] pdf2json caught error:", err.message);
    }

    // Check if pdf2json failed or produced corrupted glyphs (Type3 custom font displacement)
    if (!fullText || hasCorruptedGlyphs(fullText)) {
        try {
            console.log("[pdfService] pdf2json output was missing or corrupted; recovering with pdf-parse...");
            const dataBuffer = fs.readFileSync(filePath);
            const parsed = await pdfParse(dataBuffer);
            if (parsed && parsed.text && parsed.text.trim().length > 0) {
                console.log("[pdfService] Successfully recovered text using pdf-parse.");
                return parsed.text.trim();
            }
        } catch (parseErr) {
            console.warn("[pdfService] pdf-parse fallback also failed:", parseErr.message);
        }
    } else {
        return fullText;
    }

    // Check if both pdf2json and pdf-parse produced no usable text (< 50 chars); run OCR fallback
    if (!fullText || fullText.trim().length < 50) {
        console.log("[pdfService] Normal text extraction yielded insufficient text; attempting OCR fallback...");
        const ocrText = await extractTextWithOCR(filePath);
        if (ocrText && ocrText.length >= 50) {
            return ocrText;
        }
    }

    if (!fullText) {
        throw new Error("No readable text found in the PDF. This document may be an empty or corrupted document.");
    }

    return fullText;
}

/**
 * Extracts text from a DOCX file using mammoth.
 */
async function extractTextFromDOCX(filePath) {
    try {
        const result = await mammoth.extractRawText({ path: filePath });
        const text = (result?.value || "")
            .replace(/\r\n/g, "\n")
            .replace(/\r/g, "\n")
            .replace(/\t/g, " ")
            .replace(/[ ]{2,}/g, " ")
            .replace(/\n{3,}/g, "\n\n")
            .trim();

        if (!text) {
            throw new Error("No readable text found in the DOCX document.");
        }

        return text;
    } catch (err) {
        console.error("DOCX extraction error:", err);
        throw new Error(`DOCX extraction failed: ${err.message}`);
    }
}

/**
 * Universal document text extractor supporting PDF and DOCX.
 *
 * @param {string} filePath - Absolute path to the document file.
 * @returns {Promise<string>} Extracted plain text.
 */
async function extractText(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Document file not found at: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".docx") {
        return extractTextFromDOCX(filePath);
    }

    if (ext === ".pdf") {
        return extractTextFromPDF(filePath);
    }

    throw new Error(`Unsupported document format: ${ext}. Please upload a PDF (.pdf) or Word document (.docx).`);
}

module.exports = {
    extractText,
    extractTextFromPDF,
    extractTextFromDOCX,
};