// Tool Registry — Central definition of all available file operation tools
// Each tool has: id, name, category, iconKey, description, accepts (file types)

export const categories = [
  { id: 'all', name: 'All', iconKey: 'folder' },
  { id: 'pdf', name: 'PDF Tools', iconKey: 'pdf' },
  { id: 'image', name: 'Image Tools', iconKey: 'image' },
  { id: 'video', name: 'Video Tools', iconKey: 'video' },
  { id: 'audio', name: 'Audio Tools', iconKey: 'audio' },
  { id: 'document', name: 'Document', iconKey: 'document' },
  { id: 'archive', name: 'Archive', iconKey: 'archive' },
];

export const tools = [
  // ── PDF Tools ──
  {
    id: 'pdf-merge',
    name: 'Merge PDF',
    category: 'pdf',
    iconKey: 'merge',
    description: 'Combine multiple PDF files into a single document',
    accepts: ['.pdf'],
    multiFile: true,
  },
  {
    id: 'pdf-split',
    name: 'Split PDF',
    category: 'pdf',
    iconKey: 'split',
    description: 'Split a PDF into separate files by page ranges',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-compress',
    name: 'Compress PDF',
    category: 'pdf',
    iconKey: 'compress',
    description: 'Reduce PDF file size while maintaining quality',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-rotate',
    name: 'Rotate PDF',
    category: 'pdf',
    iconKey: 'rotate',
    description: 'Rotate all or specific pages in a PDF',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-reorder',
    name: 'Reorder Pages',
    category: 'pdf',
    iconKey: 'reorder',
    description: 'Rearrange the order of pages in a PDF',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-extract',
    name: 'Extract Pages',
    category: 'pdf',
    iconKey: 'extract',
    description: 'Extract specific pages from a PDF document',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-watermark',
    name: 'Add Watermark',
    category: 'pdf',
    iconKey: 'watermark',
    description: 'Add text or image watermark to PDF pages',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-protect',
    name: 'Protect PDF',
    category: 'pdf',
    iconKey: 'lock',
    description: 'Add password protection to your PDF',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-unlock',
    name: 'Unlock PDF',
    category: 'pdf',
    iconKey: 'unlock',
    description: 'Remove password protection from a PDF',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-to-images',
    name: 'PDF to Images',
    category: 'pdf',
    iconKey: 'image',
    description: 'Convert each PDF page to a PNG or JPG image',
    accepts: ['.pdf'],
  },
  {
    id: 'images-to-pdf',
    name: 'Images to PDF',
    category: 'pdf',
    iconKey: 'pdf',
    description: 'Create a PDF from multiple image files',
    accepts: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'],
    multiFile: true,
  },
  {
    id: 'pdf-flatten',
    name: 'Flatten PDF',
    category: 'pdf',
    iconKey: 'document',
    description: 'Flatten form fields and annotations',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-metadata',
    name: 'PDF Metadata',
    category: 'pdf',
    iconKey: 'document',
    description: 'View and edit PDF document metadata',
    accepts: ['.pdf'],
  },
  {
    id: 'pdf-page-numbers',
    name: 'Add Page Numbers',
    category: 'pdf',
    iconKey: 'pdf',
    description: 'Add page numbers to PDF pages',
    accepts: ['.pdf'],
  },

  // ── Image Tools ──
  {
    id: 'image-convert',
    name: 'Convert Image',
    category: 'image',
    iconKey: 'convert',
    description: 'Convert between PNG, JPG, WebP, GIF, BMP formats',
    accepts: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp', '.tiff'],
  },
  {
    id: 'image-resize',
    name: 'Resize Image',
    category: 'image',
    iconKey: 'resize',
    description: 'Change image dimensions with aspect ratio control',
    accepts: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
  },
  {
    id: 'image-crop',
    name: 'Crop Image',
    category: 'image',
    iconKey: 'crop',
    description: 'Cut and crop images to your desired size',
    accepts: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
  },
  {
    id: 'image-rotate',
    name: 'Rotate Image',
    category: 'image',
    iconKey: 'rotate',
    description: 'Rotate images by any angle',
    accepts: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
  },
  {
    id: 'image-flip',
    name: 'Flip Image',
    category: 'image',
    iconKey: 'flip',
    description: 'Flip images horizontally or vertically',
    accepts: ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.bmp'],
  },
  {
    id: 'image-compress',
    name: 'Compress Image',
    category: 'image',
    iconKey: 'compress',
    description: 'Reduce image file size while maintaining quality',
    accepts: ['.png', '.jpg', '.jpeg', '.webp'],
  },
  {
    id: 'image-watermark',
    name: 'Image Watermark',
    category: 'image',
    iconKey: 'watermark',
    description: 'Add text watermark to images',
    accepts: ['.png', '.jpg', '.jpeg', '.webp', '.bmp'],
  },

  // ── Video Tools ──
  {
    id: 'video-trim',
    name: 'Trim Video',
    category: 'video',
    iconKey: 'extract',
    description: 'Cut specific parts of your video',
    accepts: ['.mp4', '.webm', '.avi', '.mov', '.mkv'],
  },
  {
    id: 'video-compress',
    name: 'Compress Video',
    category: 'video',
    iconKey: 'compress',
    description: 'Reduce video file size',
    accepts: ['.mp4', '.webm', '.avi', '.mov', '.mkv'],
  },
  {
    id: 'video-resize',
    name: 'Resize Video',
    category: 'video',
    iconKey: 'resize',
    description: 'Change video dimensions and resolution',
    accepts: ['.mp4', '.webm', '.avi', '.mov', '.mkv'],
  },
  {
    id: 'video-rotate',
    name: 'Rotate Video',
    category: 'video',
    iconKey: 'rotate',
    description: 'Rotate and flip your video files',
    accepts: ['.mp4', '.webm', '.avi', '.mov', '.mkv'],
  },
  {
    id: 'video-speed',
    name: 'Change Speed',
    category: 'video',
    iconKey: 'speed',
    description: 'Speed up or slow down video playback',
    accepts: ['.mp4', '.webm', '.avi', '.mov', '.mkv'],
  },
  {
    id: 'video-extract-audio',
    name: 'Extract Audio',
    category: 'video',
    iconKey: 'audio',
    description: 'Extract audio track from video',
    accepts: ['.mp4', '.webm', '.avi', '.mov', '.mkv'],
  },
  {
    id: 'video-to-gif',
    name: 'Video to GIF',
    category: 'video',
    iconKey: 'image',
    description: 'Convert video clips to animated GIF',
    accepts: ['.mp4', '.webm', '.avi', '.mov'],
  },
  {
    id: 'video-merge',
    name: 'Merge Videos',
    category: 'video',
    iconKey: 'merge',
    description: 'Combine multiple video files into one',
    accepts: ['.mp4', '.webm', '.avi', '.mov', '.mkv'],
    multiFile: true,
  },
  {
    id: 'video-mute',
    name: 'Mute Video',
    category: 'video',
    iconKey: 'mute',
    description: 'Remove audio from video file',
    accepts: ['.mp4', '.webm', '.avi', '.mov', '.mkv'],
  },

  // ── Audio Tools ──
  {
    id: 'audio-convert',
    name: 'Convert Audio',
    category: 'audio',
    iconKey: 'convert',
    description: 'Convert between MP3, WAV, OGG, FLAC, AAC formats',
    accepts: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a', '.wma'],
  },
  {
    id: 'audio-trim',
    name: 'Trim Audio',
    category: 'audio',
    iconKey: 'extract',
    description: 'Cut specific parts of audio files',
    accepts: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'],
  },
  {
    id: 'audio-merge',
    name: 'Merge Audio',
    category: 'audio',
    iconKey: 'merge',
    description: 'Combine multiple audio files into one',
    accepts: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'],
    multiFile: true,
  },
  {
    id: 'audio-volume',
    name: 'Adjust Volume',
    category: 'audio',
    iconKey: 'volume',
    description: 'Increase or decrease audio volume',
    accepts: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'],
  },
  {
    id: 'audio-speed',
    name: 'Change Speed',
    category: 'audio',
    iconKey: 'speed',
    description: 'Speed up or slow down audio playback',
    accepts: ['.mp3', '.wav', '.ogg', '.flac', '.aac', '.m4a'],
  },

  // ── Document Tools ──
  {
    id: 'docx-to-pdf',
    name: 'Word to PDF (DOCX)',
    category: 'document',
    iconKey: 'document',
    description: 'Convert Microsoft Word .docx files to PDF',
    accepts: ['.docx', '.doc'],
  },
  {
    id: 'pdf-to-docx',
    name: 'PDF to Word (DOCX)',
    category: 'document',
    iconKey: 'document',
    description: 'Extract PDF text into Microsoft Word .docx document',
    accepts: ['.pdf'],
  },
  {
    id: 'md-to-pdf',
    name: 'Markdown to PDF',
    category: 'document',
    iconKey: 'document',
    description: 'Convert Markdown text to a formatted PDF',
    accepts: ['.md', '.markdown', '.txt'],
  },
  {
    id: 'html-to-pdf',
    name: 'HTML to PDF',
    category: 'document',
    iconKey: 'document',
    description: 'Convert HTML content to PDF document',
    accepts: ['.html', '.htm'],
  },
  {
    id: 'txt-to-pdf',
    name: 'Text to PDF',
    category: 'document',
    iconKey: 'document',
    description: 'Convert plain text files to PDF',
    accepts: ['.txt'],
  },

  // ── Archive Tools ──
  {
    id: 'create-zip',
    name: 'Create ZIP',
    category: 'archive',
    iconKey: 'archive',
    description: 'Compress files into a ZIP archive',
    accepts: ['*'],
    multiFile: true,
  },
  {
    id: 'extract-zip',
    name: 'Extract ZIP',
    category: 'archive',
    iconKey: 'archive',
    description: 'Extract files from ZIP archives',
    accepts: ['.zip'],
  },
];

export function getToolById(id) {
  return tools.find(t => t.id === id);
}

export function getToolsByCategory(categoryId) {
  if (categoryId === 'all') return tools;
  return tools.filter(t => t.category === categoryId);
}

export function searchTools(query) {
  const q = query.toLowerCase().trim();
  if (!q) return tools;
  return tools.filter(
    t =>
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
  );
}

export function getCategoryCount(categoryId) {
  if (categoryId === 'all') return tools.length;
  return tools.filter(t => t.category === categoryId).length;
}

// Popular tools for homepage display
export const popularTools = [
  'pdf-merge',
  'pdf-split',
  'pdf-compress',
  'image-convert',
  'image-resize',
  'image-compress',
  'video-trim',
  'audio-convert',
].map(id => getToolById(id));
