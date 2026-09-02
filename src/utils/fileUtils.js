// File utility helpers

/**
 * Format file size in human-readable form
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i > 0 ? 1 : 0)} ${units[i]}`;
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename) {
  return '.' + filename.split('.').pop().toLowerCase();
}

/**
 * Get icon for file type
 */
export function getFileIcon(filename) {
  const ext = getFileExtension(filename);
  const iconMap = {
    '.pdf': '📄',
    '.png': '🖼️',
    '.jpg': '🖼️',
    '.jpeg': '🖼️',
    '.webp': '🖼️',
    '.gif': '🖼️',
    '.bmp': '🖼️',
    '.tiff': '🖼️',
    '.svg': '🖼️',
    '.mp4': '🎬',
    '.webm': '🎬',
    '.avi': '🎬',
    '.mov': '🎬',
    '.mkv': '🎬',
    '.mp3': '🎵',
    '.wav': '🎵',
    '.ogg': '🎵',
    '.flac': '🎵',
    '.aac': '🎵',
    '.m4a': '🎵',
    '.zip': '📦',
    '.rar': '📦',
    '.7z': '📦',
    '.tar': '📦',
    '.gz': '📦',
    '.md': '📝',
    '.txt': '📝',
    '.html': '🌐',
    '.htm': '🌐',
    '.doc': '📃',
    '.docx': '📃',
    '.xls': '📊',
    '.xlsx': '📊',
    '.ppt': '📊',
    '.pptx': '📊',
  };
  return iconMap[ext] || '📁';
}

/**
 * Read a file as ArrayBuffer
 */
export function readFileAsArrayBuffer(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Read a file as Data URL
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Read a file as text
 */
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

/**
 * Detect file category from MIME type or extension
 */
export function detectFileCategory(file) {
  const mime = file.type || '';
  const ext = getFileExtension(file.name);

  if (mime.startsWith('application/pdf') || ext === '.pdf') return 'pdf';
  if (mime.startsWith('image/')) return 'image';
  if (mime.startsWith('video/')) return 'video';
  if (mime.startsWith('audio/')) return 'audio';
  if (['.md', '.markdown', '.txt', '.html', '.htm'].includes(ext)) return 'document';
  if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(ext)) return 'archive';
  return 'other';
}

/**
 * Create a download from a Uint8Array or Blob
 */
export function downloadFile(data, filename, mimeType = 'application/octet-stream') {
  const blob = data instanceof Blob ? data : new Blob([data], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

/**
 * Get MIME type from extension
 */
export function getMimeType(ext) {
  const mimeMap = {
    '.pdf': 'application/pdf',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.gif': 'image/gif',
    '.bmp': 'image/bmp',
    '.tiff': 'image/tiff',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.avi': 'video/x-msvideo',
    '.mov': 'video/quicktime',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.flac': 'audio/flac',
    '.aac': 'audio/aac',
    '.zip': 'application/zip',
    '.html': 'text/html',
    '.txt': 'text/plain',
    '.md': 'text/markdown',
  };
  return mimeMap[ext] || 'application/octet-stream';
}
