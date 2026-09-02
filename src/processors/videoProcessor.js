import JSZip from 'jszip';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { readFileAsText, readFileAsDataURL } from '../utils/fileUtils';

/**
 * Trim Video using HTML5 Video + Canvas + MediaRecorder API in browser
 */
export async function trimVideo(file, startTime = 0, endTime = 10, onProgress) {
  if (onProgress) onProgress(10, 'Loading video file...');
  const videoUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playsInline = true;

    video.onloadedmetadata = () => {
      if (onProgress) onProgress(30, 'Setting up video trimmer stream...');
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(30);
      const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(videoUrl);
        if (onProgress) onProgress(100, 'Done!');
        const blob = new Blob(chunks, { type: 'video/mp4' });
        resolve(blob);
      };

      video.currentTime = startTime;

      video.onseeked = () => {
        if (onProgress) onProgress(50, 'Processing video clip...');
        recorder.start();
        video.play();

        const drawFrame = () => {
          if (video.currentTime >= endTime || video.paused || video.ended) {
            video.pause();
            recorder.stop();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          if (onProgress) {
            const pct = 50 + Math.round(((video.currentTime - startTime) / (endTime - startTime)) * 45);
            onProgress(Math.min(95, pct), `Recording frame at ${video.currentTime.toFixed(1)}s...`);
          }
          requestAnimationFrame(drawFrame);
        };

        requestAnimationFrame(drawFrame);
      };
    };

    video.onerror = (err) => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Failed to load video file. Please check video format.'));
    };

    video.src = videoUrl;
  });
}

/**
 * Mute Video by stripping audio
 */
export async function muteVideo(file, onProgress) {
  return trimVideo(file, 0, 99999, onProgress);
}

/**
 * Change Video Speed
 */
export async function changeVideoSpeed(file, speedFactor = 1.5, onProgress) {
  if (onProgress) onProgress(10, 'Loading video file...');
  const videoUrl = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true;
    video.playbackRate = speedFactor;

    video.onloadedmetadata = () => {
      if (onProgress) onProgress(30, 'Applying video playback speed...');
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 360;
      const ctx = canvas.getContext('2d');

      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      const chunks = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        URL.revokeObjectURL(videoUrl);
        if (onProgress) onProgress(100, 'Done!');
        const blob = new Blob(chunks, { type: 'video/mp4' });
        resolve(blob);
      };

      recorder.start();
      video.play();

      const drawFrame = () => {
        if (video.ended || video.paused) {
          recorder.stop();
          return;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        if (onProgress) {
          const pct = 30 + Math.round((video.currentTime / video.duration) * 65);
          onProgress(Math.min(95, pct), `Resampling speed at ${video.currentTime.toFixed(1)}s...`);
        }
        requestAnimationFrame(drawFrame);
      };

      requestAnimationFrame(drawFrame);
    };

    video.onerror = () => {
      URL.revokeObjectURL(videoUrl);
      reject(new Error('Failed to load video file'));
    };

    video.src = videoUrl;
  });
}

/**
 * Create a ZIP archive from multiple files using JSZip
 */
export async function createZip(files, onProgress) {
  if (onProgress) onProgress(10, 'Initializing ZIP archive...');
  const zip = new JSZip();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (onProgress) {
      const pct = 10 + Math.round((i / files.length) * 80);
      onProgress(pct, `Adding ${file.name} to archive...`);
    }
    zip.file(file.name, file);
  }

  if (onProgress) onProgress(90, 'Compressing archive...');
  const content = await zip.generateAsync({ type: 'uint8array' });
  if (onProgress) onProgress(100, 'Done!');
  return content;
}

/**
 * Extract files from a ZIP archive
 */
export async function extractZip(file, onProgress) {
  if (onProgress) onProgress(20, 'Reading ZIP file...');
  const zip = new JSZip();
  const zipContent = await zip.loadAsync(file);
  const extractedFiles = [];

  const fileEntries = Object.keys(zipContent.files).filter((name) => !zipContent.files[name].dir);
  const total = fileEntries.length;

  for (let i = 0; i < total; i++) {
    const filename = fileEntries[i];
    if (onProgress) {
      const pct = 20 + Math.round((i / total) * 75);
      onProgress(pct, `Extracting ${filename}...`);
    }
    const zipEntry = zipContent.files[filename];
    const blob = await zipEntry.async('blob');
    extractedFiles.push({
      name: filename,
      data: blob,
    });
  }

  if (onProgress) onProgress(100, 'Done!');
  return extractedFiles;
}

/**
 * Convert plain text or Markdown to PDF
 */
export async function textToPDF(file, onProgress) {
  if (onProgress) onProgress(20, 'Reading text content...');
  const text = await readFileAsText(file);

  if (onProgress) onProgress(50, 'Formatting PDF document...');
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 11;
  const lineHeight = 16;
  const margin = 50;

  let page = pdfDoc.addPage([595.28, 841.89]); // A4 dimensions
  const { width, height } = page.getSize();
  const maxWidth = width - margin * 2;
  let y = height - margin;

  const lines = text.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const words = rawLine.split(' ');
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
  const bytes = await pdfDoc.save();
  if (onProgress) onProgress(100, 'Done!');
  return bytes;
}

/**
 * Trim HTML to PDF
 */
export async function htmlToPDF(htmlText, onProgress) {
  if (onProgress) onProgress(30, 'Parsing HTML...');
  const dummyFile = new File([htmlText], 'document.html', { type: 'text/html' });
  return textToPDF(dummyFile, onProgress);
}
