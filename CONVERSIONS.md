# 🔄 Toolwala — Complete File Conversions & Operations Guide

This document outlines every supported file conversion, transformation, and document processing capability available in **Toolwala**. 

All processing runs **100% client-side** inside the user's browser memory via modern Web APIs and WebAssembly — **zero files are ever sent to an external server**.

---

## 📑 Quick Navigation
1. [Document & PDF Conversions](#1-document--pdf-conversions)
2. [Image Conversions & Optimizations](#2-image-conversions--optimizations)
3. [Audio Conversions & Transformations](#3-audio-conversions--transformations)
4. [Video Processing & Conversions](#4-video-processing--conversions)
5. [Archive & Compression Operations](#5-archive--compression-operations)
6. [Competitive Exam Presets & Specifications](#6-competitive-exam-presets--specifications)
7. [Engine & Technology Matrix](#7-engine--technology-matrix)

---

## 1. Document & PDF Conversions

| Operation / Conversion | Source Format(s) | Output Format | Processing Engine | Capabilities & Options |
| :--- | :--- | :--- | :--- | :--- |
| **DOCX to PDF** | `.docx` | `.pdf` | `mammoth.js` + `pdf-lib` | Converts Word documents to PDF preserving headings, typography, text formatting, and lists. |
| **PDF to DOCX** | `.pdf` | `.docx` | `pdfjs-dist` + `docx` | Extracts structured text paragraphs and rebuilds an editable Word `.docx` file. |
| **PDF to Images** | `.pdf` | `.png` (multi-page `.zip`) | `pdfjs-dist` (HTML5 Canvas) | Renders high-DPI (2x scale) images of each page; downloads as individual images or `.zip`. |
| **Images to PDF** | `.jpg`, `.jpeg`, `.png`, `.webp` | `.pdf` | `pdf-lib` | Stitches multiple image files into a cohesive multi-page PDF with auto-centering and scaling. |
| **TXT to PDF** | `.txt` | `.pdf` | `pdf-lib` | Formats plain text into paginated, cleanly padded PDF documents with line wrapping. |
| **HTML to PDF** | `.html`, `.htm` | `.pdf` | Canvas / `pdf-lib` | Parses HTML markup and converts layout into a readable PDF document. |
| **Merge PDF** | Multiple `.pdf` | `.pdf` | `pdf-lib` | Re-orders and binds multiple PDF documents into a single master PDF. |
| **Split PDF** | Single `.pdf` | Multiple `.pdf` (or `.zip`) | `pdf-lib` | Splits by specific page ranges (e.g., `1-3, 5, 7-10`) or exports each page individually. |
| **Compress PDF** | `.pdf` | `.pdf` | `pdf-lib` | Strips redundant object streams, deduplicates font dictionaries, and downsamples embedded images. |
| **Rotate PDF** | `.pdf` | `.pdf` | `pdf-lib` | Rotates individual pages or all pages by 90°, 180°, or 270° clockwise. |
| **Watermark PDF** | `.pdf` | `.pdf` | `pdf-lib` | Adds custom text watermarks with opacity, rotation angle (e.g. 45°), size, and RGB color control. |
| **Add Page Numbers** | `.pdf` | `.pdf` | `pdf-lib` | Stamps bottom-center or bottom-right page counters (`Page X of Y` or `X`). |
| **Digital Signature** | `.pdf` | `.pdf` | HTML5 Canvas + `pdf-lib` | Interactive signature drawing pad with customizable ink color, thickness, and placement. |
| **Redact PDF** | `.pdf` | `.pdf` | `pdf-lib` | Stamps permanent, non-removable opaque redaction masks over sensitive content. |

---

## 2. Image Conversions & Optimizations

| Operation / Conversion | Source Format(s) | Output Format | Processing Engine | Capabilities & Options |
| :--- | :--- | :--- | :--- | :--- |
| **Format Conversion** | `.png`, `.jpg`, `.jpeg`, `.webp`, `.bmp`, `.svg` | `.png`, `.jpg`, `.webp`, `.bmp` | HTML5 Canvas API | Seamless cross-format conversion with lossless or lossy quality preservation. |
| **HEIC / HEIF to JPG** | `.heic`, `.heif` | `.jpg`, `.png` | Native FileReader / Canvas | Converts modern Apple iPhone camera photos to widely compatible JPG format. |
| **Image Compression** | `.jpg`, `.png`, `.webp` | Same or `.webp` | Canvas 2D + Quality Matrix | Slider-based compression (0.1 to 1.0 quality) with instant file size savings calculation. |
| **Resize Image** | Any raster image | Same | Canvas 2D | Scale by exact pixel dimensions (`Width × Height`) or percentage with aspect ratio lock. |
| **Crop Image** | Any raster image | Same | Canvas 2D | Aspect ratio presets (`1:1 Square`, `4:3`, `16:9`, `3:4 Portrait`) or custom free-form cropping. |
| **Rotate & Flip** | Any raster image | Same | Canvas 2D Transform | 90° Clockwise, 90° Counter-Clockwise, Flip Horizontal, Flip Vertical. |
| **Color Inversion / Grayscale** | Any raster image | Same | Canvas `getImageData` | Converts color photographs to clean grayscale (useful for exam signatures and forms). |

---

## 3. Audio Conversions & Transformations

| Operation / Conversion | Source Format(s) | Output Format | Processing Engine | Capabilities & Options |
| :--- | :--- | :--- | :--- | :--- |
| **Audio Format Convert** | `.mp3`, `.wav`, `.ogg`, `.aac`, `.m4a` | `.wav`, `.mp3` | Web Audio API (`AudioContext`) | Decodes compressed audio into Float32 PCM buffers and encodes into standard 16-bit PCM WAV. |
| **Audio Trimmer / Cutter** | `.mp3`, `.wav`, `.ogg` | `.wav` | Web Audio API Buffer Slicing | Precise millisecond-accurate timeline slicing (`Start Time` to `End Time`). |
| **Volume Amplifier / Gain** | `.mp3`, `.wav`, `.ogg` | `.wav` | `GainNode` Processing | Boosts quiet recordings (up to 300%) or softens loud tracks without digital clipping. |
| **Audio Speed Change** | `.mp3`, `.wav`, `.ogg` | `.wav` | Buffer Resampling | Accelerates (up to 2.0x) or slows down (0.5x) audio playback and exports the rendered result. |
| **Multi-Track Audio Merger** | Multiple audio files | `.wav` | Web Audio API Sequencer | Appends multiple voice notes, songs, or sound effects sequentially into a single track. |

---

## 4. Video Processing & Conversions

| Operation / Conversion | Source Format(s) | Output Format | Processing Engine | Capabilities & Options |
| :--- | :--- | :--- | :--- | :--- |
| **Video Trimmer** | `.mp4`, `.webm`, `.mov` | `.webm` / `.mp4` | HTML5 `<video>` + Canvas Stream | Trims video timeline locally via `MediaRecorder` with zero server uploads. |
| **Mute Video** | `.mp4`, `.webm`, `.mov` | `.webm` | Canvas Video Stream (No Audio Track) | Strips audio channels to output silent video clips. |
| **Video Playback Speed** | `.mp4`, `.webm` | `.webm` | Canvas Stream with Resampled FPS | Generates high-speed timelapses or slow-motion video clips. |
| **Extract Video Audio** | `.mp4`, `.webm` | `.wav` | Web Audio API + Video Element | Extracts audio track from video files and exports as standalone audio. |

---

## 5. Archive & Compression Operations

| Operation / Conversion | Source Format(s) | Output Format | Processing Engine | Capabilities & Options |
| :--- | :--- | :--- | :--- | :--- |
| **Create ZIP Archive** | Multiple files of any type | `.zip` | `JSZip` | Bundles documents, photos, and media into compressed `.zip` archives. |
| **Extract ZIP Archive** | `.zip` | Individual unpacked files | `JSZip` | Inspects and unpacks files from `.zip` archives directly to local storage. |

---

## 6. Competitive Exam Presets & Specifications

Toolwala includes pre-configured dimension, format, and file-size constraints strictly matching the 15 official competitive exam guidelines:

| Exam Name | Document Type | Accepted Format | Target File Size | Required Dimensions |
| :--- | :--- | :--- | :--- | :--- |
| **NEET UG** | Passport Photograph | `JPG` | 10 KB – 200 KB | 2.5 × 3.5 cm (White background) |
| | Postcard Photograph | `JPG` | 10 KB – 200 KB | 4 × 6 inches |
| | Signature | `JPG` | 4 KB – 30 KB | 2.5 × 3.5 cm (Black ink pen) |
| | Thumb Impressions (L & R) | `JPG` | 10 KB – 200 KB | Standard clear stamp |
| **JEE Main** | Photograph | `JPG` | 10 KB – 200 KB | 3.5 × 4.5 cm (White background) |
| | Signature | `JPG` | 10 KB – 100 KB | 3.5 × 1.5 cm |
| | Class 10 Certificate | `PDF` | 50 KB – 300 KB | Legible PDF scan |
| **CUET UG** | Photograph | `JPG` | 10 KB – 200 KB | 3.5 × 4.5 cm (White background) |
| | Signature | `JPG` | 10 KB – 50 KB | Clear white background |
| | Category / PwD Certificate | `PDF` | 50 KB – 300 KB | Clean PDF document |
| **UPSC CSE** | Photograph | `JPG` | 20 KB – 300 KB | Square (350–1000 px, 75% face) |
| | Signature | `JPG` | 20 KB – 100 KB | 350 × 500 px (Black ink) |
| | Photo ID Card | `PDF` | 20 KB – 300 KB | Single-page PDF |
| **UPSC NDA / CDS** | Photograph | `JPG` | 20 KB – 300 KB | 350 × 350 px (Name & date printed) |
| | Signature | `JPG` | 20 KB – 100 KB | 350 × 500 px (Signed 3 times stacked) |
| **SSC CGL / CHSL** | Live Webcam Capture | *Webcam* | Automated | Front-facing natural lighting |
| | Signature | `JPG` | 10 KB – 20 KB | 4.0 × 2.0 cm (Running hand/cursive) |
| **SSC GD Constable**| Photograph | `JPG` | 20 KB – 50 KB | 3.5 × 4.5 cm |
| | Signature | `JPG` | 10 KB – 20 KB | 4.0 × 2.0 cm |
| **IBPS PO / Clerk** | Photograph | `JPG` | 20 KB – 50 KB | 200 × 230 px |
| | Signature | `JPG` | 10 KB – 20 KB | 140 × 60 px (No capital letters) |
| **RRB NTPC** | Photograph | `JPG` | 20 KB – 100 KB | 3.5 × 4.5 cm |
| | Signature | `JPG` | 10 KB – 40 KB | 140 × 60 px |
| | Left Thumb Impression | `JPG` | 10 KB – 50 KB | Clear ink stamp |
| **GATE** | Photograph | `JPG` | 5 KB – 200 KB | 240–480 × 320–640 px (3:4 ratio) |
| | Signature | `JPG` | 5 KB – 200 KB | 80–280 × 160–560 px |
| **CTET** | Photograph | `JPG` | 10 KB – 100 KB | 3.5 × 4.5 cm |
| | Signature | `JPG` | 3 KB – 30 KB | 3.5 × 1.5 cm |
| **CAT (IIMs)** | Passport Photograph | `JPG` | ≤ 80 KB | 1200 × 1200 px (White background) |
| | Signature | `JPG` | ≤ 80 KB | Clear white background |
| **UGC NET** | Photograph | `JPG` | 10 KB – 200 KB | 3.5 × 4.5 cm (Taken in last 3 months) |
| | Signature | `JPG` | 4 KB – 30 KB | Running handwriting |

---

## 7. Engine & Technology Matrix

```
┌────────────────────────────────────────────────────────┐
│               Toolwala Web UI (React 19)               │
└──────────────────────────┬─────────────────────────────┘
                           │
      ┌────────────────────┼────────────────────┐
      ▼                    ▼                    ▼
┌───────────┐        ┌───────────┐        ┌───────────┐
│  pdf-lib  │        │ Canvas 2D │        │ Web Audio │
│  pdfjs    │        │  Streams  │        │    API    │
└───────────┘        └───────────┘        └───────────┘
   PDF Engine        Image & Video        Audio Engine
 (Merge, Split,       (Resize, Crop,     (Trim, Volume,
  Watermark, Docx)     Convert, Mute)      Format, Merge)
```

| Technology | Purpose in Toolwala | Execution Location |
| :--- | :--- | :--- |
| **`pdf-lib`** | Low-level PDF binary modification, page extraction, watermark stamping, and creation. | Client-side (JS/Wasm) |
| **`pdfjs-dist`** | High-fidelity vector PDF rasterization to canvas images and text extraction. | Client-side Web Worker |
| **`mammoth.js`** | Converting raw `.docx` OpenXML structures into clean HTML/text. | Client-side |
| **`docx`** | Rebuilding Microsoft Word `.docx` documents programmatically. | Client-side |
| **HTML5 Canvas 2D** | High-performance image scaling, rotation, cropping, and format encoding. | Client-side (GPU accelerated) |
| **Web Audio API** | Frame-accurate audio decoding (`AudioBuffer`), DSP gain nodes, and WAV encoding. | Client-side (Browser thread) |
| **`JSZip`** | In-memory ZIP archive generation and multi-file extraction. | Client-side |

---

## 🔒 Privacy & Local Processing Guarantee
- **0 Bytes Transferred**: Files never leave the user's browser runtime.
- **Offline Capable**: Works completely offline once initial assets are cached via Service Worker / Browser Cache.
- **No File Size Caps**: Process files as large as available system memory allows.
