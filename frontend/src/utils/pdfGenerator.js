/**
 * Shared Resume PDF Generator for SmartResumeAnalyzer
 * Direct html2canvas + jsPDF implementation
 * Eliminates html2pdf.js cloning and Illegal Invocation errors.
 * Normalizes all modern CSS colors (OKLCH, LAB, LCH, color()) to standard sRGB.
 */

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// ==========================================================
// 1. Modern CSS Color Conversion Helpers (OKLCH -> sRGB)
// ==========================================================

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Pure JavaScript OKLCH to sRGB mathematical converter.
 * Converts perceptual OKLCH color coordinates to standard sRGB rgb()/rgba() strings.
 */
export function oklchToRgb(l, c, h, a = 1) {
  const hr = (h * Math.PI) / 180;
  const a_ = c * Math.cos(hr);
  const b_ = c * Math.sin(hr);

  const l_ = l + 0.3963377774 * a_ + 0.2158037573 * b_;
  const m_ = l - 0.1055613458 * a_ - 0.0638541728 * b_;
  const s_ = l - 0.0894841775 * a_ - 1.2914855480 * b_;

  const l3 = l_ * l_ * l_;
  const m3 = m_ * m_ * m_;
  const s3 = s_ * s_ * s_;

  let r = +4.0767434036 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3;
  let g = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413185465 * s3;
  let b = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3;

  function toSrgbChannel(val) {
    const clamped = clamp(val, 0, 1);
    const srgb = clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055;
    return Math.round(clamp(srgb * 255, 0, 255));
  }

  const red = toSrgbChannel(r);
  const green = toSrgbChannel(g);
  const blue = toSrgbChannel(b);
  const alpha = clamp(a, 0, 1);

  if (alpha < 1) {
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
  return `rgb(${red}, ${green}, ${blue})`;
}

/**
 * Parses an individual oklch(...) function string into standard rgb()/rgba().
 */
export function parseOklchMatch(str) {
  if (!str || typeof str !== "string") return null;
  const match = str.match(
    /oklch\(\s*([0-9.]+%?|none)\s+([0-9.]+|none)\s+([0-9.]+(?:deg)?|none)(?:\s*\/\s*([0-9.]+%?|none))?\s*\)/i
  );
  if (!match) return null;

  let l = match[1];
  if (l === "none") l = 0;
  else if (l.endsWith("%")) l = parseFloat(l) / 100;
  else l = parseFloat(l);

  let c = match[2];
  if (c === "none") c = 0;
  else c = parseFloat(c);

  let h = match[3];
  if (h === "none") h = 0;
  else if (h.toLowerCase().endsWith("deg")) h = parseFloat(h);
  else h = parseFloat(h);

  let a = 1;
  if (match[4]) {
    let rawA = match[4];
    if (rawA === "none") a = 1;
    else if (rawA.endsWith("%")) a = parseFloat(rawA) / 100;
    else a = parseFloat(rawA);
  }

  if (isNaN(l) || isNaN(c) || isNaN(h) || isNaN(a)) return null;
  return oklchToRgb(l, c, h, a);
}

let canvasHelper = null;
let canvasCtx = null;

function convertColorViaCanvas(colorStr) {
  if (typeof document === "undefined") return null;
  try {
    if (!canvasHelper) {
      canvasHelper = document.createElement("canvas");
      canvasHelper.width = 1;
      canvasHelper.height = 1;
      canvasCtx = canvasHelper.getContext("2d");
    }
    if (canvasCtx) {
      canvasCtx.fillStyle = "#000000";
      canvasCtx.fillStyle = colorStr.trim();
      const res = canvasCtx.fillStyle;
      if (res && !/oklch|lab|lch|color\(/i.test(res)) {
        return res;
      }
    }
  } catch (e) {
    // fallback
  }
  return null;
}

export function sanitizeSingleColor(colorStr) {
  if (!colorStr || typeof colorStr !== "string") return colorStr;
  if (!/oklch|lab|lch|color\(/i.test(colorStr)) return colorStr;

  // 1. Browser canvas native conversion
  const canvasRes = convertColorViaCanvas(colorStr);
  if (canvasRes) return canvasRes;

  // 2. Math OKLCH parser
  const oklchRes = parseOklchMatch(colorStr);
  if (oklchRes) return oklchRes;

  // 3. Fallback
  return "#111827";
}

export function sanitizeCssString(cssText) {
  if (!cssText || typeof cssText !== "string") return cssText;
  if (!/oklch|lab|lch|color\(/i.test(cssText)) return cssText;

  return cssText.replace(
    /oklch\(\s*[^)]+\)/gi,
    (match) => sanitizeSingleColor(match) || match
  );
}

// ==========================================================
// 2. Standardized Resume PDF Filename Helper
// ==========================================================

export function getResumePdfFilename(rawName, templateKey) {
  const cleanName = (rawName || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");

  let suffix = "Basic";
  if (templateKey) {
    const key = templateKey.toLowerCase().trim();
    if (key === "classic") suffix = "Classic";
    else if (key === "minimal") suffix = "Minimal";
    else if (key === "two-column" || key === "twocolumn") suffix = "Two-Column";
    else if (key === "creative") suffix = "Creative";
    else if (key === "ats") suffix = "ATS";
    else {
      suffix = key.charAt(0).toUpperCase() + key.slice(1);
    }
  }

  if (cleanName) {
    return `${cleanName}_Resume_${suffix}.pdf`;
  }
  return `Resume_${suffix}.pdf`;
}

// ==========================================================
// 3. Clone Sanitization for Safe PDF Rendering
// ==========================================================

const COLOR_PROPERTIES = [
  "color",
  "backgroundColor",
  "borderTopColor",
  "borderRightColor",
  "borderBottomColor",
  "borderLeftColor",
  "outlineColor",
  "textDecorationColor",
  "fill",
  "stroke"
];

function sanitizeCloneStyles(cloneNode) {
  if (!cloneNode) return;

  const elements = [cloneNode, ...Array.from(cloneNode.querySelectorAll("*"))];

  elements.forEach((el) => {
    if (!el || !el.style) return;

    let computed = null;
    try {
      computed = window.getComputedStyle(el);
    } catch (e) {
      return;
    }

    if (!computed) return;

    // Remove unsupported filters and backdrop filters
    el.style.filter = "none";
    el.style.backdropFilter = "none";
    el.style.webkitBackdropFilter = "none";

    // Neutralize shadows for clean print output
    el.style.boxShadow = "none";
    el.style.textShadow = "none";

    // Normalize color properties to sRGB
    COLOR_PROPERTIES.forEach((prop) => {
      const val = computed[prop];
      if (val && /oklch|lab|lch|color\(/i.test(val)) {
        const safeColor = sanitizeSingleColor(val);
        if (safeColor) {
          const cssProp = prop.replace(/([A-Z])/g, "-$1").toLowerCase();
          el.style.setProperty(cssProp, safeColor, "important");
        }
      }
    });

    // Normalize linear/radial gradient background images
    const bgImg = computed.backgroundImage;
    if (bgImg && bgImg !== "none" && /oklch|lab|lch|color\(/i.test(bgImg)) {
      const safeGradient = sanitizeCssString(bgImg);
      el.style.setProperty("background-image", safeGradient, "important");
    }
  });

  // Ensure root clone attributes are strictly calibrated for A4
  cloneNode.style.width = "794px";
  cloneNode.style.minHeight = "1123px";
  cloneNode.style.backgroundColor = "#ffffff";
  cloneNode.style.color = "#111827";
  cloneNode.style.margin = "0";
  cloneNode.style.boxShadow = "none";
  cloneNode.style.transform = "none";
}

// ==========================================================
// 4. Primary Export Function: generateResumePDF
// ==========================================================

/**
 * Generates an A4 PDF from a resume DOM node using direct html2canvas + jsPDF.
 * 
 * @param {HTMLElement} element - The printable resume root DOM node
 * @param {string} filename - Target PDF file name (e.g. "John_Doe_Resume_Basic.pdf")
 */
export async function generateResumePDF(element, filename) {
  console.log("USING OLD generateResumePDF");
  // 1. Validate element
  if (!element) {
    throw new Error("PDF generation failed: printable resume element not found.");
  }

  // 2. Wait for fonts
  if (typeof document !== "undefined" && document.fonts?.ready) {
    try {
      await document.fonts.ready;
    } catch (fontErr) {
      console.warn("[pdfGenerator] Font readiness warning:", fontErr);
    }
  }

  // 3. Wait for all contained images to fully load
  const images = Array.from(element.querySelectorAll("img"));
  await Promise.all(
    images.map((img) => {
      if (img.complete && img.naturalWidth > 0) return Promise.resolve();
      return new Promise((resolve) => {
        img.onload = () => resolve();
        img.onerror = () => resolve();
        setTimeout(resolve, 3000);
      });
    })
  );

  // 4. Create off-screen container and clone element manually
  const offscreenContainer = document.createElement("div");
  offscreenContainer.setAttribute("aria-hidden", "true");
  offscreenContainer.style.position = "fixed";
  offscreenContainer.style.top = "-99999px";
  offscreenContainer.style.left = "-99999px";
  offscreenContainer.style.width = "794px";
  offscreenContainer.style.zIndex = "-9999";
  offscreenContainer.style.opacity = "0";
  offscreenContainer.style.pointerEvents = "none";
  offscreenContainer.style.margin = "0";
  offscreenContainer.style.padding = "0";

  const clone = element.cloneNode(true);
  offscreenContainer.appendChild(clone);
  document.body.appendChild(offscreenContainer);

  try {
    // 5. Sanitize cloned DOM and styles
    sanitizeCloneStyles(clone);

    // 6. Direct html2canvas rendering
    const canvas = await html2canvas(clone, {
      scale: 2,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      imageTimeout: 15000,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794
    });

    // 7. Multi-page A4 PDF creation with jsPDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true
    });

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdfWidth = 210; // A4 width in mm
    const pdfPageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0; // vertical offset in mm

    // Page 1
    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfPageHeight;

    // Additional pages if resume exceeds single page height
    while (heightLeft > 1) {
      position -= pdfPageHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight, undefined, "FAST");
      heightLeft -= pdfPageHeight;
    }

    // 8. Save PDF directly via jsPDF instance method
    pdf.save(filename || "Resume.pdf");
  } finally {
    // Clean up temporary DOM clone
    if (offscreenContainer && offscreenContainer.parentNode) {
      offscreenContainer.parentNode.removeChild(offscreenContainer);
    }
  }
}

// Backward compatibility alias
export const exportElementToPdf = generateResumePDF;
