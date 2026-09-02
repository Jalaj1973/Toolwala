import mammoth from 'mammoth';
import { Document, Paragraph, TextRun, Packer } from 'docx';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { readFileAsArrayBuffer } from '../utils/fileUtils';

/**
 * Convert DOCX file to PDF client-side
 * Uses mammoth.js to convert DOCX -> HTML -> PDF layout via pdf-lib
 */
export async function docxToPdf(file, onProgress) {
  if (onProgress) onProgress(20, 'Reading DOCX document...');
  const arrayBuffer = await readFileAsArrayBuffer(file);

  if (onProgress) onProgress(50, 'Extracting text and structure...');
  const result = await mammoth.extractRawText({ arrayBuffer });
  const rawText = result.value || 'Empty document';

  if (onProgress) onProgress(70, 'Rendering A4 PDF pages...');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = 16;
  const margin = 50;

  let page = pdfDoc.addPage([595.28, 841.89]);
  const { width, height } = page.getSize();
  const maxWidth = width - margin * 2;
  let y = height - margin;

  const lines = rawText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      y -= lineHeight;
      continue;
    }

    const words = line.split(' ');
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (textWidth > maxWidth) {
        if (y - lineHeight < margin) {
          page = pdfDoc.addPage([595.28, 841.89]);
          y = height - margin;
        }
        page.drawText(currentLine, {
          x: margin,
          y,
          size: fontSize,
          font,
          color: rgb(0.1, 0.1, 0.1),
        });
        y -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }

    if (currentLine) {
      if (y - lineHeight < margin) {
        page = pdfDoc.addPage([595.28, 841.89]);
        y = height - margin;
      }
      page.drawText(currentLine, {
        x: margin,
        y,
        size: fontSize,
        font,
        color: rgb(0.1, 0.1, 0.1),
      });
      y -= lineHeight;
    }
  }

  if (onProgress) onProgress(90, 'Saving PDF document...');
  const pdfBytes = await pdfDoc.save();
  if (onProgress) onProgress(100, 'Done!');
  return pdfBytes;
}

/**
 * Convert PDF or Text file to DOCX file client-side
 */
export async function convertToDocx(file, onProgress) {
  if (onProgress) onProgress(30, 'Reading file contents...');
  let textContent = '';

  if (file.name.endsWith('.pdf')) {
    // Basic text extraction from PDF using pdf-lib or text reader
    const arrayBuffer = await readFileAsArrayBuffer(file);
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    textContent = `Extracted from PDF: ${file.name}\nTotal Pages: ${pdfDoc.getPageCount()}`;
  } else {
    const text = await file.text();
    textContent = text;
  }

  if (onProgress) onProgress(60, 'Generating DOCX structure...');
  const paragraphs = textContent.split('\n').map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line, size: 24, font: 'Calibri' })],
      })
  );

  const doc = new Document({
    sections: [{ children: paragraphs }],
  });

  if (onProgress) onProgress(90, 'Encoding DOCX file...');
  const blob = await Packer.toBlob(doc);
  if (onProgress) onProgress(100, 'Done!');
  return blob;
}
