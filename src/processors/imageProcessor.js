import { PDFDocument } from 'pdf-lib';
import { readFileAsDataURL, readFileAsArrayBuffer } from '../utils/fileUtils';

/**
 * Convert Image format (PNG, JPG, WebP, BMP) using HTML Canvas
 */
export async function convertImage(file, targetFormat = 'image/jpeg', quality = 0.9, onProgress) {
  if (onProgress) onProgress(20, 'Loading image...');
  const dataUrl = await readFileAsDataURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (onProgress) onProgress(60, 'Converting image format...');
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      if (onProgress) onProgress(90, 'Encoding output file...');
      canvas.toBlob(
        (blob) => {
          if (onProgress) onProgress(100, 'Done!');
          if (blob) resolve(blob);
          else reject(new Error('Canvas blob conversion failed'));
        },
        targetFormat,
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Resize Image with aspect ratio option
 */
export async function resizeImage(file, targetWidth, targetHeight, keepAspect = true, onProgress) {
  if (onProgress) onProgress(20, 'Loading image...');
  const dataUrl = await readFileAsDataURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (onProgress) onProgress(50, 'Calculating size...');
      let w = targetWidth || img.width;
      let h = targetHeight || img.height;

      if (keepAspect) {
        if (targetWidth && !targetHeight) {
          h = Math.round((img.height / img.width) * targetWidth);
        } else if (targetHeight && !targetWidth) {
          w = Math.round((img.width / img.height) * targetHeight);
        } else if (targetWidth && targetHeight) {
          const ratio = Math.min(targetWidth / img.width, targetHeight / img.height);
          w = Math.round(img.width * ratio);
          h = Math.round(img.height * ratio);
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, w, h);

      if (onProgress) onProgress(90, 'Generating resized image...');
      canvas.toBlob(
        (blob) => {
          if (onProgress) onProgress(100, 'Done!');
          if (blob) resolve(blob);
          else reject(new Error('Failed to create image blob'));
        },
        file.type || 'image/png',
        0.9
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Flip Image horizontally or vertically
 */
export async function flipImage(file, direction = 'horizontal', onProgress) {
  if (onProgress) onProgress(20, 'Loading image...');
  const dataUrl = await readFileAsDataURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (onProgress) onProgress(60, 'Flipping image...');
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (direction === 'horizontal') {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      } else {
        ctx.translate(0, canvas.height);
        ctx.scale(1, -1);
      }

      ctx.drawImage(img, 0, 0);

      if (onProgress) onProgress(90, 'Encoding flipped image...');
      canvas.toBlob(
        (blob) => {
          if (onProgress) onProgress(100, 'Done!');
          if (blob) resolve(blob);
          else reject(new Error('Failed to flip image'));
        },
        file.type || 'image/png',
        0.9
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Crop Image
 */
export async function cropImage(file, cropPercent = 0.1, onProgress) {
  if (onProgress) onProgress(20, 'Loading image...');
  const dataUrl = await readFileAsDataURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (onProgress) onProgress(60, 'Cropping image margins...');
      const cropX = Math.round(img.width * cropPercent);
      const cropY = Math.round(img.height * cropPercent);
      const cropW = img.width - cropX * 2;
      const cropH = img.height - cropY * 2;

      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, cropW);
      canvas.height = Math.max(1, cropH);
      const ctx = canvas.getContext('2d');

      ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

      if (onProgress) onProgress(90, 'Encoding cropped image...');
      canvas.toBlob(
        (blob) => {
          if (onProgress) onProgress(100, 'Done!');
          if (blob) resolve(blob);
          else reject(new Error('Failed to crop image'));
        },
        file.type || 'image/png',
        0.9
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Rotate Image by angle
 */
export async function rotateImage(file, degrees = 90, onProgress) {
  if (onProgress) onProgress(20, 'Loading image...');
  const dataUrl = await readFileAsDataURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (onProgress) onProgress(60, 'Rotating image...');
      const canvas = document.createElement('canvas');
      const rad = (degrees * Math.PI) / 180;
      const sin = Math.abs(Math.sin(rad));
      const cos = Math.abs(Math.cos(rad));

      canvas.width = Math.round(img.width * cos + img.height * sin);
      canvas.height = Math.round(img.width * sin + img.height * cos);

      const ctx = canvas.getContext('2d');
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      if (onProgress) onProgress(90, 'Encoding rotated image...');
      canvas.toBlob(
        (blob) => {
          if (onProgress) onProgress(100, 'Done!');
          if (blob) resolve(blob);
          else reject(new Error('Failed to rotate image'));
        },
        file.type || 'image/png',
        0.9
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Compress Image with adjustable quality and optional dimension scaling
 * @param {File} file
 * @param {number|object} optionsOrQuality - Quality number (0.1 to 1.0) or options object
 * @param {function} [onProgress]
 */
export async function compressImage(file, optionsOrQuality = 0.7, onProgress) {
  let quality = 0.7;
  let maxWidth = 1920;
  let maxHeight = 1920;
  let progressFn = onProgress;

  if (typeof optionsOrQuality === 'number') {
    quality = optionsOrQuality;
  } else if (typeof optionsOrQuality === 'object' && optionsOrQuality !== null) {
    if (optionsOrQuality.quality !== undefined) quality = optionsOrQuality.quality;
    if (optionsOrQuality.maxWidth !== undefined) maxWidth = optionsOrQuality.maxWidth;
    if (optionsOrQuality.maxHeight !== undefined) maxHeight = optionsOrQuality.maxHeight;
  }

  if (progressFn) progressFn(25, 'Analyzing image dimensions and payload...');
  const dataUrl = await readFileAsDataURL(file);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      if (progressFn) progressFn(60, 'Optimizing resolution and compression...');

      let { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      if (progressFn) progressFn(85, 'Encoding compressed file...');
      canvas.toBlob(
        (blob) => {
          if (progressFn) progressFn(100, 'Done!');
          if (blob) resolve(blob);
          else reject(new Error('Compression failed'));
        },
        'image/jpeg',
        quality
      );
    };
    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = dataUrl;
  });
}

/**
 * Convert multiple images to a single PDF document
 */
export async function imagesToPDF(imageFiles, onProgress) {
  if (onProgress) onProgress(10, 'Initializing PDF document...');
  const pdfDoc = await PDFDocument.create();

  for (let i = 0; i < imageFiles.length; i++) {
    const file = imageFiles[i];
    if (onProgress) {
      const pct = 10 + Math.round((i / imageFiles.length) * 80);
      onProgress(pct, `Adding image ${i + 1} of ${imageFiles.length}...`);
    }

    const buffer = await readFileAsArrayBuffer(file);
    let image;

    if (file.type === 'image/jpeg' || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg')) {
      image = await pdfDoc.embedJpg(buffer);
    } else if (file.type === 'image/png' || file.name.endsWith('.png')) {
      image = await pdfDoc.embedPng(buffer);
    } else {
      const pngBlob = await convertImage(file, 'image/png', 1.0);
      const pngBuffer = await pngBlob.arrayBuffer();
      image = await pdfDoc.embedPng(pngBuffer);
    }

    const page = pdfDoc.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height,
    });
  }

  if (onProgress) onProgress(95, 'Saving PDF document...');
  const bytes = await pdfDoc.save();
  if (onProgress) onProgress(100, 'Done!');
  return bytes;
}
