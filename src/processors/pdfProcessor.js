import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { readFileAsArrayBuffer } from '../utils/fileUtils';

// Configure pdfjs worker to local bundled worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

/**
 * Merge multiple PDF files into one
 */
export async function mergePDFs(files, onProgress) {
  if (onProgress) onProgress(10, 'Initializing PDF merger...');
  const mergedPdf = await PDFDocument.create();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (onProgress) {
      const pct = 10 + Math.round((i / files.length) * 70);
      onProgress(pct, `Processing ${file.name}...`);
    }

    const buffer = await readFileAsArrayBuffer(file);
    const pdf = await PDFDocument.load(buffer);
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
    copiedPages.forEach((page) => mergedPdf.addPage(page));
  }

  if (onProgress) onProgress(90, 'Saving merged PDF...');
  const pdfBytes = await mergedPdf.save();
  if (onProgress) onProgress(100, 'Done!');
  return pdfBytes;
}

/**
 * Split a PDF into separate files by page range or every N pages
 */
export async function splitPDF(file, rangeStr, onProgress) {
  if (onProgress) onProgress(20, 'Reading PDF document...');
  const buffer = await readFileAsArrayBuffer(file);
  const srcPdf = await PDFDocument.load(buffer);
  const pageCount = srcPdf.getPageCount();

  let pagesToExtract = [];
  if (!rangeStr || rangeStr.trim() === '') {
    pagesToExtract = Array.from({ length: pageCount }, (_, i) => [i]);
  } else {
    const parts = rangeStr.split(',').map((s) => s.trim());
    const pageIndices = [];

    for (const part of parts) {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map((n) => parseInt(n.trim(), 10));
        if (!isNaN(start) && !isNaN(end)) {
          for (let p = Math.max(1, start); p <= Math.min(pageCount, end); p++) {
            pageIndices.push(p - 1);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= pageCount) {
          pageIndices.push(p - 1);
        }
      }
    }
    pagesToExtract = [pageIndices];
  }

  const results = [];
  for (let i = 0; i < pagesToExtract.length; i++) {
    const indices = pagesToExtract[i];
    if (indices.length === 0) continue;

    if (onProgress) {
      const pct = 30 + Math.round((i / pagesToExtract.length) * 60);
      onProgress(pct, `Extracting pages ${indices.map((n) => n + 1).join(', ')}...`);
    }

    const newPdf = await PDFDocument.create();
    const copiedPages = await newPdf.copyPages(srcPdf, indices);
    copiedPages.forEach((page) => newPdf.addPage(page));
    const bytes = await newPdf.save();
    results.push({
      name: `${file.name.replace(/\.pdf$/i, '')}_part${i + 1}.pdf`,
      data: bytes,
    });
  }

  if (onProgress) onProgress(100, 'Done!');
  return results;
}

/**
 * Rotate PDF pages
 */
export async function rotatePDF(file, angleDegrees = 90, onProgress) {
  if (onProgress) onProgress(20, 'Loading PDF...');
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    if (onProgress) {
      const pct = 20 + Math.round((i / pages.length) * 70);
      onProgress(pct, `Rotating page ${i + 1} of ${pages.length}...`);
    }
    const page = pages[i];
    const currentRotation = page.getRotation().angle;
    page.setRotation(degrees((currentRotation + angleDegrees) % 360));
  }

  if (onProgress) onProgress(95, 'Saving PDF...');
  const bytes = await pdfDoc.save();
  if (onProgress) onProgress(100, 'Done!');
  return bytes;
}

/**
 * Add text watermark to PDF
 */
export async function addWatermarkToPDF(file, text = 'CONFIDENTIAL', options = {}, onProgress) {
  if (onProgress) onProgress(20, 'Loading PDF...');
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer);
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const pages = pdfDoc.getPages();

  const fontSize = options.fontSize || 48;
  const opacity = options.opacity || 0.3;

  for (let i = 0; i < pages.length; i++) {
    if (onProgress) {
      const pct = 20 + Math.round((i / pages.length) * 70);
      onProgress(pct, `Watermarking page ${i + 1}...`);
    }
    const page = pages[i];
    const { width, height } = page.getSize();

    page.drawText(text, {
      x: width / 4,
      y: height / 2,
      size: fontSize,
      font,
      color: rgb(0.7, 0.7, 0.7),
      opacity,
      rotate: degrees(45),
    });
  }

  if (onProgress) onProgress(95, 'Saving PDF...');
  const bytes = await pdfDoc.save();
  if (onProgress) onProgress(100, 'Done!');
  return bytes;
}

/**
 * Compress PDF with adjustable compression levels and realistic image downsampling
 * @param {File} file
 * @param {object|function} optionsOrProgress - Options { level, quality } or progress callback
 * @param {function} [onProgress]
 */
export async function compressPDF(file, optionsOrProgress, onProgress) {
  let options = { level: 'recommended', quality: 0.7 };
  let progressFn = onProgress;

  if (typeof optionsOrProgress === 'function') {
    progressFn = optionsOrProgress;
  } else if (typeof optionsOrProgress === 'object' && optionsOrProgress !== null) {
    options = { ...options, ...optionsOrProgress };
  }

  const { level = 'recommended', quality = 0.7 } = options;

  if (progressFn) progressFn(15, 'Reading PDF for optimization...');
  const buffer = await readFileAsArrayBuffer(file);

  // Attempt 1: Standard object stream optimization with pdf-lib
  const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  const streamOptimizedBytes = await pdfDoc.save({ useObjectStreams: true });

  // For light compression or if quality >= 0.85, return stream-optimized
  if (level === 'light' || quality >= 0.85) {
    if (progressFn) progressFn(100, 'Optimization complete');
    return streamOptimizedBytes;
  }

  // Attempt 2: Image and page downsampling for raster/scanned document compression
  if (progressFn) progressFn(35, 'Analyzing page elements & downsampling...');
  try {
    const loadingTask = pdfjsLib.getDocument({ data: buffer });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    const compressedPdf = await PDFDocument.create();

    // Determine target scale and JPEG quality based on compression level
    let targetScale = 1.25;
    let jpegQuality = 0.7;

    if (level === 'extreme' || quality <= 0.5) {
      targetScale = 1.0;
      jpegQuality = 0.5;
    } else if (level === 'light' || quality >= 0.8) {
      targetScale = 1.5;
      jpegQuality = 0.85;
    } else {
      targetScale = 1.0 + (quality - 0.5) * 1.2;
      jpegQuality = quality;
    }

    for (let i = 1; i <= numPages; i++) {
      if (progressFn) {
        const pct = 35 + Math.round((i / numPages) * 50);
        progressFn(pct, `Compressing page ${i} of ${numPages}...`);
      }

      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: targetScale });

      const canvas = document.createElement('canvas');
      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      const ctx = canvas.getContext('2d');

      await page.render({ canvasContext: ctx, viewport }).promise;

      const jpegDataUrl = canvas.toDataURL('image/jpeg', jpegQuality);
      const jpegBytes = await fetch(jpegDataUrl).then((r) => r.arrayBuffer());

      const embeddedImage = await compressedPdf.embedJpg(jpegBytes);
      const originalViewport = page.getViewport({ scale: 1.0 });
      const newPage = compressedPdf.addPage([originalViewport.width, originalViewport.height]);
      newPage.drawImage(embeddedImage, {
        x: 0,
        y: 0,
        width: originalViewport.width,
        height: originalViewport.height,
      });
    }

    if (progressFn) progressFn(90, 'Finalizing compressed document...');
    const rasterCompressedBytes = await compressedPdf.save({ useObjectStreams: true });

    // Use raster-compressed if smaller, otherwise stream-optimized
    if (rasterCompressedBytes.length < streamOptimizedBytes.length) {
      if (progressFn) progressFn(100, 'Done!');
      return rasterCompressedBytes;
    }
  } catch (err) {
    console.warn('Raster compression fallback:', err);
  }

  if (progressFn) progressFn(100, 'Done!');
  return streamOptimizedBytes;
}

/**
 * Add Page Numbers to PDF
 */
export async function addPageNumbersToPDF(file, options = {}, onProgress) {
  if (onProgress) onProgress(20, 'Loading PDF...');
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer);
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  const total = pages.length;

  for (let i = 0; i < total; i++) {
    if (onProgress) {
      const pct = 20 + Math.round((i / total) * 70);
      onProgress(pct, `Numbering page ${i + 1}...`);
    }
    const page = pages[i];
    const { width } = page.getSize();
    const pageStr = `Page ${i + 1} of ${total}`;

    page.drawText(pageStr, {
      x: width - 100,
      y: 20,
      size: 10,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });
  }

  if (onProgress) onProgress(95, 'Saving PDF...');
  const bytes = await pdfDoc.save();
  if (onProgress) onProgress(100, 'Done!');
  return bytes;
}

/**
 * Sign PDF by stamping a signature image layer onto specified page
 */
export async function signPDF(file, signatureDataUrl, pageNum = 1, onProgress) {
  if (onProgress) onProgress(20, 'Loading PDF for signing...');
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer);

  if (onProgress) onProgress(50, 'Embedding signature image...');
  const pngImageBytes = await fetch(signatureDataUrl).then((res) => res.arrayBuffer());
  const signatureImage = await pdfDoc.embedPng(pngImageBytes);

  const pages = pdfDoc.getPages();
  const targetPageIndex = Math.max(0, Math.min(pages.length - 1, pageNum - 1));
  const targetPage = pages[targetPageIndex];

  const sigDims = signatureImage.scale(0.5);
  const { width } = targetPage.getSize();

  targetPage.drawImage(signatureImage, {
    x: width - sigDims.width - 40,
    y: 40,
    width: sigDims.width,
    height: sigDims.height,
  });

  if (onProgress) onProgress(90, 'Saving signed PDF...');
  const signedBytes = await pdfDoc.save();
  if (onProgress) onProgress(100, 'Done!');
  return signedBytes;
}

/**
 * Redact PDF by stamping solid opaque mask over target regions
 */
export async function redactPDF(file, redactText = 'CONFIDENTIAL', onProgress) {
  if (onProgress) onProgress(20, 'Loading PDF for redaction...');
  const buffer = await readFileAsArrayBuffer(file);
  const pdfDoc = await PDFDocument.load(buffer);
  const pages = pdfDoc.getPages();

  for (let i = 0; i < pages.length; i++) {
    if (onProgress) {
      const pct = 20 + Math.round((i / pages.length) * 70);
      onProgress(pct, `Applying redaction masks to page ${i + 1}...`);
    }
    const page = pages[i];
    const { width, height } = page.getSize();

    // Draw opaque redaction bar across header region
    page.drawRectangle({
      x: 40,
      y: height - 80,
      width: width - 80,
      height: 30,
      color: rgb(0, 0, 0),
    });
  }

  if (onProgress) onProgress(90, 'Saving redacted PDF...');
  const redactedBytes = await pdfDoc.save();
  if (onProgress) onProgress(100, 'Done!');
  return redactedBytes;
}

/**
 * Convert PDF pages into PNG images using PDF.js rendering canvas
 */
export async function pdfToImages(file, onProgress) {
  if (onProgress) onProgress(10, 'Loading PDF document...');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const images = [];

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) {
      const pct = 10 + Math.round((i / numPages) * 80);
      onProgress(pct, `Rendering page ${i} of ${numPages} as PNG...`);
    }

    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.5 });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
    images.push({
      name: `${file.name.replace(/\.pdf$/i, '')}_page_${i}.png`,
      data: blob,
    });
  }

  if (onProgress) onProgress(100, 'Done!');
  return images;
}

/**
 * Extract lightweight thumbnail images for each page of a PDF document
 */
export async function renderPdfThumbnails(file, onProgress) {
  if (onProgress) onProgress(10, 'Loading PDF for preview...');
  const arrayBuffer = await readFileAsArrayBuffer(file);
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;

  const pages = [];

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) {
      const pct = 10 + Math.round((i / numPages) * 80);
      onProgress(pct, `Rendering page ${i} of ${numPages}...`);
    }

    const page = await pdf.getPage(i);
    const initialViewport = page.getViewport({ scale: 1.0 });
    // Target ~220px thumbnail width for crisp preview
    const scale = Math.min(1.0, 220 / initialViewport.width);
    const viewport = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    pages.push({
      id: `p-${i}-${Date.now()}`,
      originalIndex: i - 1, // 0-based index for pdf-lib copyPages
      pageNumber: i,
      thumbnail: dataUrl,
      width: viewport.width,
      height: viewport.height,
      rotation: 0, // 0, 90, 180, 270
      isSelected: true,
    });
  }

  if (onProgress) onProgress(100, 'Ready');
  return pages;
}

/**
 * Reorder and rotate PDF pages according to user-organized layout
 * @param {File} file
 * @param {Array<{ originalIndex: number, rotation: number }>} pagesConfig
 */
export async function reorderAndRotatePDF(file, pagesConfig, onProgress) {
  if (onProgress) onProgress(15, 'Reading original PDF...');
  const buffer = await readFileAsArrayBuffer(file);
  const srcPdf = await PDFDocument.load(buffer);
  const newPdf = await PDFDocument.create();

  const total = pagesConfig.length;
  for (let i = 0; i < total; i++) {
    const { originalIndex, rotation = 0 } = pagesConfig[i];
    if (onProgress) {
      const pct = 15 + Math.round((i / total) * 70);
      onProgress(pct, `Arranging page ${i + 1} of ${total}...`);
    }

    const [copiedPage] = await newPdf.copyPages(srcPdf, [originalIndex]);
    if (rotation !== 0) {
      const currentRot = copiedPage.getRotation().angle;
      copiedPage.setRotation(degrees((currentRot + rotation) % 360));
    }
    newPdf.addPage(copiedPage);
  }

  if (onProgress) onProgress(90, 'Generating final PDF...');
  const bytes = await newPdf.save();
  if (onProgress) onProgress(100, 'Done!');
  return bytes;
}

/**
 * Extract selected pages into a single new PDF document
 * @param {File} file
 * @param {Array<number>} selectedOriginalIndices
 */
export async function extractPDFPages(file, selectedOriginalIndices, onProgress) {
  if (onProgress) onProgress(20, 'Loading PDF document...');
  const buffer = await readFileAsArrayBuffer(file);
  const srcPdf = await PDFDocument.load(buffer);
  const newPdf = await PDFDocument.create();

  if (onProgress) onProgress(50, 'Extracting selected pages...');
  const copiedPages = await newPdf.copyPages(srcPdf, selectedOriginalIndices);
  copiedPages.forEach((p) => newPdf.addPage(p));

  if (onProgress) onProgress(90, 'Saving extracted PDF...');
  const bytes = await newPdf.save();
  if (onProgress) onProgress(100, 'Done!');
  return bytes;
}
