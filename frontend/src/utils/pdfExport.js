/**
 * Shared PDF Export Forwarder
 * Re-exports the direct html2canvas + jsPDF implementation from pdfGenerator.js.
 * All legacy html2pdf.js code and proxy hooks have been completely removed.
 */

export {
  generateResumePDF,
  exportElementToPdf,
  getResumePdfFilename,
  oklchToRgb,
  parseOklchMatch,
  sanitizeSingleColor,
  sanitizeCssString
} from "./pdfGenerator";
