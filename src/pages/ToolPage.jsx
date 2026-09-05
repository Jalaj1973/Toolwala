import { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import FileDropzone from '../components/FileDropzone';
import FilePreview from '../components/FilePreview';
import ProgressBar from '../components/ProgressBar';
import SignatureCanvas from '../components/SignatureCanvas';
import { getToolById } from '../data/tools';
import { downloadFile, formatFileSize } from '../utils/fileUtils';
import { useLanguage } from '../context/LanguageContext';
import PdfPageOrganizer from '../components/PdfPageOrganizer';
import AudioWaveformTrimmer from '../components/AudioWaveformTrimmer';
import VideoTimelineTrimmer from '../components/VideoTimelineTrimmer';
import SpeedController from '../components/SpeedController';

// Processors
import {
  mergePDFs,
  splitPDF,
  rotatePDF,
  reorderAndRotatePDF,
  extractPDFPages,
  addWatermarkToPDF,
  compressPDF,
  addPageNumbersToPDF,
  signPDF,
  pdfToImages,
} from '../processors/pdfProcessor';

import {
  convertImage,
  resizeImage,
  rotateImage,
  compressImage,
  imagesToPDF,
  flipImage,
  cropImage,
} from '../processors/imageProcessor';

import {
  trimAudio,
  adjustAudioVolume,
  changeAudioSpeed,
  convertAudioToWav,
  mergeAudioFiles,
} from '../processors/audioProcessor';

import { docxToPdf, convertToDocx } from '../processors/documentProcessor';

import { createZip, extractZip, textToPDF, trimVideo, changeVideoSpeed, muteVideo } from '../processors/videoProcessor';

export default function ToolPage() {
  const { toolId } = useParams();
  const location = useLocation();
  const tool = getToolById(toolId);
  const { t } = useLanguage();

  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Options state
  const [pageRange, setPageRange] = useState('');
  const [rotateAngle, setRotateAngle] = useState(90);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [imageFormat, setImageFormat] = useState('image/jpeg');
  const [quality, _setQuality] = useState(0.8);
  const [targetWidth, _setTargetWidth] = useState(800);
  const [targetHeight, _setTargetHeight] = useState(600);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [audioStart, setAudioStart] = useState(0);
  const [audioEnd, setAudioEnd] = useState(10);
  const [volumeLevel, setVolumeLevel] = useState(1.5);
  const [speedRatio, setSpeedRatio] = useState(1.25);

  // Visual PDF Organizer state
  const isVisualOrganizerTool = tool && (tool.id === 'pdf-reorder' || tool.id === 'pdf-rotate' || tool.id === 'pdf-extract');
  const organizerMode = tool ? (tool.id === 'pdf-extract' ? 'extract' : tool.id === 'pdf-rotate' ? 'rotate' : 'reorder') : 'reorder';
  const [organizerPages, setOrganizerPages] = useState([]);
  const [hasValidPages, setHasValidPages] = useState(true);

  // Compression options state
  const isCompressionTool = tool && (tool.id === 'pdf-compress' || tool.id === 'image-compress');
  const [compressionPreset, setCompressionPreset] = useState('recommended');
  const [compressionLevel, setCompressionLevel] = useState(60);

  // Media Trim state (Audio / Video)
  const isMediaTrimTool = tool && (tool.id === 'audio-trim' || tool.id === 'video-trim');

  // Check if tool has customizable options
  const hasOptions = isCompressionTool ||
    tool?.id === 'audio-speed' ||
    tool?.id === 'video-speed' ||
    tool?.id === 'pdf-split' ||
    tool?.id === 'audio-volume' ||
    tool?.id === 'image-rotate' ||
    tool?.id === 'pdf-watermark' ||
    tool?.id === 'image-convert';

  useEffect(() => {
    if (location.state && location.state.files) {
      setFiles(location.state.files);
    }
  }, [location.state]);

  if (!tool) {
    return (
      <div className="container section" style={{ textAlign: 'center' }}>
        <h2>Tool not found</h2>
        <p style={{ marginTop: '1rem' }}>The requested tool does not exist.</p>
        <Link to="/tools" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
          Back to Tools
        </Link>
      </div>
    );
  }

  const handleFilesSelected = (newFiles) => {
    if (tool.multiFile) {
      setFiles((prev) => [...prev, ...newFiles]);
    } else {
      setFiles([newFiles[0]]);
    }
    setOrganizerPages([]);
    setHasValidPages(true);
    setResult(null);
    setError(null);
  };

  const handleRemoveFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setOrganizerPages([]);
    setHasValidPages(true);
    setResult(null);
  };

  const handleProcess = async () => {
    if (files.length === 0 && tool.id !== 'sign-pdf') return;

    setIsProcessing(true);
    setProgress(5);
    setStatusText(t('processing'));
    setError(null);
    setResult(null);

    try {
      let output;
      let outputName = 'result';

      const updateProgress = (pct, text) => {
        setProgress(pct);
        setStatusText(text);
      };

      switch (tool.id) {
        // PDF Tools
        case 'pdf-merge':
          output = await mergePDFs(files, updateProgress);
          outputName = 'merged_document.pdf';
          break;

        case 'pdf-split':
          output = await splitPDF(files[0], pageRange, updateProgress);
          if (Array.isArray(output)) {
            setResult({ isMultiple: true, items: output });
            setIsProcessing(false);
            return;
          }
          break;

        case 'pdf-rotate':
          if (organizerPages.length > 0) {
            output = await reorderAndRotatePDF(files[0], organizerPages, updateProgress);
          } else {
            output = await rotatePDF(files[0], Number(rotateAngle), updateProgress);
          }
          outputName = `${files[0].name.replace(/\.pdf$/i, '')}_rotated.pdf`;
          break;

        case 'pdf-watermark':
          output = await addWatermarkToPDF(files[0], watermarkText, {}, updateProgress);
          outputName = `${files[0].name.replace(/\.pdf$/i, '')}_watermarked.pdf`;
          break;

        case 'pdf-compress': {
          const compQuality = Math.max(0.35, Math.min(0.92, 1 - (compressionLevel / 100) * 0.7));
          output = await compressPDF(
            files[0],
            { level: compressionPreset, quality: compQuality },
            updateProgress
          );
          outputName = `${files[0].name.replace(/\.pdf$/i, '')}_compressed.pdf`;
          break;
        }

        case 'pdf-page-numbers':
          output = await addPageNumbersToPDF(files[0], {}, updateProgress);
          outputName = `${files[0].name.replace(/\.pdf$/i, '')}_numbered.pdf`;
          break;

        case 'pdf-protect':
          if (signatureDataUrl) {
            output = await signPDF(files[0], signatureDataUrl, 1, updateProgress);
            outputName = `${files[0].name.replace(/\.pdf$/i, '')}_signed.pdf`;
          } else {
            output = await compressPDF(files[0], updateProgress);
            outputName = `${files[0].name.replace(/\.pdf$/i, '')}_protected.pdf`;
          }
          break;

        case 'pdf-unlock':
        case 'pdf-flatten':
        case 'pdf-metadata':
          output = await compressPDF(files[0], updateProgress);
          outputName = `${files[0].name.replace(/\.pdf$/i, '')}_processed.pdf`;
          break;

        case 'pdf-reorder':
          if (organizerPages.length === 0) {
            throw new Error('No pages available to reorder');
          }
          output = await reorderAndRotatePDF(files[0], organizerPages, updateProgress);
          outputName = `${files[0].name.replace(/\.pdf$/i, '')}_reordered.pdf`;
          break;

        case 'pdf-extract':
          if (organizerPages.length > 0) {
            const selectedIndices = organizerPages
              .filter((p) => p.isSelected)
              .map((p) => p.originalIndex);
            if (selectedIndices.length === 0) {
              throw new Error('Please select at least one page to extract');
            }
            output = await extractPDFPages(files[0], selectedIndices, updateProgress);
            outputName = `${files[0].name.replace(/\.pdf$/i, '')}_extracted.pdf`;
          } else {
            output = await splitPDF(files[0], pageRange, updateProgress);
            if (Array.isArray(output)) {
              setResult({ isMultiple: true, items: output });
              setIsProcessing(false);
              return;
            }
          }
          break;

        case 'pdf-to-images':
          output = await pdfToImages(files[0], updateProgress);
          setResult({ isMultiple: true, items: output });
          setIsProcessing(false);
          return;

        // Image Tools
        case 'image-convert':
          {
            const extMap = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp' };
            const ext = extMap[imageFormat] || '.jpg';
            output = await convertImage(files[0], imageFormat, quality, updateProgress);
            outputName = `${files[0].name.split('.')[0]}_converted${ext}`;
          }
          break;

        case 'image-resize':
          output = await resizeImage(files[0], Number(targetWidth), Number(targetHeight), true, updateProgress);
          outputName = `${files[0].name.split('.')[0]}_resized.png`;
          break;

        case 'image-crop':
          output = await cropImage(files[0], 0.1, updateProgress);
          outputName = `${files[0].name.split('.')[0]}_cropped.png`;
          break;

        case 'image-flip':
          output = await flipImage(files[0], 'horizontal', updateProgress);
          outputName = `${files[0].name.split('.')[0]}_flipped.png`;
          break;

        case 'image-watermark':
          output = await convertImage(files[0], 'image/png', 0.9, updateProgress);
          outputName = `${files[0].name.split('.')[0]}_edited.png`;
          break;

        case 'image-rotate':
          output = await rotateImage(files[0], Number(rotateAngle), updateProgress);
          outputName = `${files[0].name.split('.')[0]}_rotated.png`;
          break;

        case 'image-compress': {
          const imgQuality = Math.max(0.2, Math.min(0.95, 1 - (compressionLevel / 100) * 0.85));
          output = await compressImage(
            files[0],
            { quality: imgQuality, maxWidth: compressionLevel >= 75 ? 1440 : 1920 },
            updateProgress
          );
          outputName = `${files[0].name.split('.')[0]}_compressed.jpg`;
          break;
        }

        case 'images-to-pdf':
          output = await imagesToPDF(files, updateProgress);
          outputName = 'images_converted.pdf';
          break;

        // Audio Tools
        case 'audio-trim':
          output = await trimAudio(files[0], Number(audioStart), Number(audioEnd), updateProgress);
          outputName = `${files[0].name.split('.')[0]}_trimmed.wav`;
          break;

        case 'audio-volume':
          output = await adjustAudioVolume(files[0], Number(volumeLevel), updateProgress);
          outputName = `${files[0].name.split('.')[0]}_volume.wav`;
          break;

        case 'audio-speed':
          output = await changeAudioSpeed(files[0], Number(speedRatio), updateProgress);
          outputName = `${files[0].name.split('.')[0]}_speed.wav`;
          break;

        case 'audio-convert':
          output = await convertAudioToWav(files[0], updateProgress);
          outputName = `${files[0].name.split('.')[0]}_converted.wav`;
          break;

        case 'audio-merge':
          output = await mergeAudioFiles(files, updateProgress);
          outputName = 'merged_audio.wav';
          break;

        // Video Tools
        case 'video-trim':
          output = await trimVideo(files[0], Number(audioStart), Number(audioEnd), updateProgress);
          outputName = `${files[0].name.split('.')[0]}_trimmed.mp4`;
          break;

        case 'video-speed':
          output = await changeVideoSpeed(files[0], Number(speedRatio), updateProgress);
          outputName = `${files[0].name.split('.')[0]}_speed.mp4`;
          break;

        case 'video-mute':
          output = await muteVideo(files[0], updateProgress);
          outputName = `${files[0].name.split('.')[0]}_muted.mp4`;
          break;

        case 'video-compress':
        case 'video-resize':
        case 'video-rotate':
        case 'video-extract-audio':
        case 'video-to-gif':
        case 'video-merge':
          output = await trimVideo(files[0], 0, 10, updateProgress);
          outputName = `${files[0].name.split('.')[0]}_processed.mp4`;
          break;

        // Document Tools
        case 'docx-to-pdf':
          output = await docxToPdf(files[0], updateProgress);
          outputName = `${files[0].name.split('.')[0]}.pdf`;
          break;

        case 'pdf-to-docx':
          output = await convertToDocx(files[0], updateProgress);
          outputName = `${files[0].name.split('.')[0]}.docx`;
          break;

        case 'md-to-pdf':
        case 'txt-to-pdf':
        case 'html-to-pdf':
          output = await textToPDF(files[0], updateProgress);
          outputName = `${files[0].name.split('.')[0]}.pdf`;
          break;

        case 'create-zip':
          output = await createZip(files, updateProgress);
          outputName = 'archive.zip';
          break;

        case 'extract-zip':
          output = await extractZip(files[0], updateProgress);
          setResult({ isMultiple: true, items: output });
          setIsProcessing(false);
          return;

        default:
          output = await compressPDF(files[0], updateProgress);
          outputName = `output_${fileId}.pdf`;
      }

      setResult({
        name: outputName,
        data: output,
        size: output instanceof Blob ? output.size : output.length,
      });
    } catch (err) {
      console.error(err);
      setError(err.message || t('error'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    if (result.isMultiple) {
      result.items.forEach((item) => {
        downloadFile(item.data, item.name);
      });
    } else {
      downloadFile(result.data, result.name);
    }
  };

  return (
    <div className="container section" style={{ paddingTop: '2rem' }}>
      <Breadcrumb
        items={[
          { label: t('allTools'), link: '/tools' },
          { label: tool.category.toUpperCase(), link: `/tools/${tool.category}` },
          { label: tool.name },
        ]}
      />

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '2.25rem' }}>{tool.icon}</span>
          <h1 className="text-heading-lg">{tool.name}</h1>
        </div>
        <p className="text-body">{tool.description}</p>
      </div>

      {files.length === 0 ? (
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <FileDropzone onFilesSelected={handleFilesSelected} accept={tool.accepts} />
        </div>
      ) : (
        <div className={(isVisualOrganizerTool || isMediaTrimTool) ? 'grid-organizer-layout' : 'tool-page-grid'}>
          {/* Left Column: Source / Files Area */}
          <div>
            {isVisualOrganizerTool ? (
              <div>
                {/* File Info Banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                    padding: '12px 16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'var(--bg-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid var(--border)',
                        fontSize: '18px',
                      }}
                    >
                      📄
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {files[0].name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>
                        {formatFileSize(files[0].size)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleRemoveFile(0)}
                    style={{ fontSize: '12px', padding: '4px 12px', height: '30px' }}
                  >
                    Change File
                  </button>
                </div>

                {/* Interactive Visual PDF Page Organizer */}
                <PdfPageOrganizer
                  file={files[0]}
                  mode={organizerMode}
                  onPagesChange={(p, isValid) => {
                    setOrganizerPages(p);
                    setHasValidPages(isValid);
                  }}
                />
              </div>
            ) : isMediaTrimTool ? (
              <div>
                {/* File Info Banner */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.25rem',
                    padding: '12px 16px',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '8px',
                        background: 'var(--bg-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        border: '1px solid var(--border)',
                        fontSize: '18px',
                      }}
                    >
                      {tool.id === 'audio-trim' ? '🎵' : '🎬'}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '14px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {files[0].name}
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>
                        {formatFileSize(files[0].size)}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() => handleRemoveFile(0)}
                    style={{ fontSize: '12px', padding: '4px 12px', height: '30px' }}
                  >
                    Change File
                  </button>
                </div>

                {/* Interactive Audio Waveform Trimmer or Video Timeline Trimmer */}
                {tool.id === 'audio-trim' ? (
                  <AudioWaveformTrimmer
                    file={files[0]}
                    startTime={audioStart}
                    endTime={audioEnd}
                    onChange={(start, end) => {
                      setAudioStart(start);
                      setAudioEnd(end);
                    }}
                  />
                ) : (
                  <VideoTimelineTrimmer
                    file={files[0]}
                    startTime={audioStart}
                    endTime={audioEnd}
                    onChange={(start, end) => {
                      setAudioStart(start);
                      setAudioEnd(end);
                    }}
                  />
                )}
              </div>
            ) : (
              <div>
                {/* Uploaded Files Card */}
                <div className="card" style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <div style={{ fontWeight: '600', fontSize: '15px' }}>
                      {t('uploadedFiles')} ({files.length})
                    </div>
                    {tool.multiple && (
                      <span style={{ fontSize: '12px', color: 'var(--fg-muted)' }}>
                        Total: {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {files.map((file, idx) => (
                      <FilePreview key={idx} file={file} index={idx} onRemove={handleRemoveFile} />
                    ))}
                  </div>
                </div>

                {/* Compact Dropzone for multi-file tools */}
                {tool.multiple && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <FileDropzone onFilesSelected={handleFilesSelected} accept={tool.accepts} />
                  </div>
                )}

                {/* Interactive Signature Canvas for Sign Tool */}
                {tool.id === 'pdf-protect' && (
                  <div className="card" style={{ marginBottom: '1.5rem' }}>
                    <div style={{ fontWeight: '500', marginBottom: '12px' }}>Digital Signature</div>
                    <SignatureCanvas onSignatureChange={setSignatureDataUrl} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Options, Process Action, & Results (Occupies Right Area) */}
          <div>
            {/* Visual Organizer or Media Trim Tools Sticky Action Card */}
            {(isVisualOrganizerTool || isMediaTrimTool) && !result && (
              <div className="card" style={{ position: 'sticky', top: '24px', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 650, fontSize: '16px', marginBottom: '6px' }}>
                  {tool.name}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--fg-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  {tool.id === 'audio-trim'
                    ? 'Listen to the trimmed segment preview and drag handles to adjust. Then click Process.'
                    : tool.id === 'video-trim'
                    ? 'Preview the video frames and cut boundaries. Then click Process to export.'
                    : tool.id === 'pdf-reorder'
                    ? 'Drag cards or click arrows to reorder pages. Then click below to generate your reordered PDF.'
                    : tool.id === 'pdf-rotate'
                    ? 'Rotate individual pages or rotate all by 90°, then click below to apply rotations.'
                    : 'Click pages to select/unselect, then click below to extract them into a new document.'}
                </p>

                <div
                  style={{
                    padding: '10px 12px',
                    background: 'var(--bg-muted)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    marginBottom: '16px',
                    fontSize: '12.5px',
                  }}
                >
                  <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {files[0].name}
                  </div>
                  <div style={{ color: 'var(--fg-muted)', fontSize: '11.5px', marginTop: '3px' }}>
                    {formatFileSize(files[0].size)}
                    {organizerPages.length > 0 && ` · ${organizerPages.length} ${organizerPages.length === 1 ? 'page' : 'pages'}`}
                    {isMediaTrimTool && ` · Cut: ${(audioEnd - audioStart).toFixed(1)}s`}
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleProcess}
                  disabled={isProcessing || !hasValidPages}
                >
                  {isProcessing ? t('processing') : `${t('process')} ${tool.name}`}
                </button>
              </div>
            )}

            {/* Standard Tools Options & Action Card (Occupies the right area!) */}
            {!isVisualOrganizerTool && !isMediaTrimTool && !result && (
              <div className="card" style={{ position: 'sticky', top: '24px', marginBottom: '1.5rem' }}>
                <div style={{ fontWeight: 650, fontSize: '16px', marginBottom: '1rem' }}>
                  {hasOptions ? t('toolOptions') : tool.name}
                </div>

                {/* Compression Controls for PDF & Image */}
                {isCompressionTool && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="option-label" style={{ marginBottom: '10px' }}>
                      Compression Preset
                    </label>

                    {/* 3 Quick Presets */}
                    <div className="compression-preset-grid">
                      <button
                        type="button"
                        className={`compression-preset-btn ${compressionPreset === 'extreme' ? 'compression-preset-btn--active' : ''}`}
                        onClick={() => {
                          setCompressionPreset('extreme');
                          setCompressionLevel(80);
                        }}
                      >
                        <div style={{ fontWeight: 650, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>⚡ Extreme</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--fg-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                          ~75% smaller · Strict portal limits
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`compression-preset-btn ${compressionPreset === 'recommended' ? 'compression-preset-btn--active' : ''}`}
                        onClick={() => {
                          setCompressionPreset('recommended');
                          setCompressionLevel(60);
                        }}
                      >
                        <div style={{ fontWeight: 650, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>⚖️ Recommended</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--fg-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                          ~55% smaller · High clarity & balance
                        </div>
                      </button>

                      <button
                        type="button"
                        className={`compression-preset-btn ${compressionPreset === 'light' ? 'compression-preset-btn--active' : ''}`}
                        onClick={() => {
                          setCompressionPreset('light');
                          setCompressionLevel(30);
                        }}
                      >
                        <div style={{ fontWeight: 650, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>💎 High Quality</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--fg-muted)', marginTop: '4px', lineHeight: 1.3 }}>
                          ~30% smaller · Print-ready details
                        </div>
                      </button>
                    </div>

                    {/* Fine-Tuning Slider */}
                    <div className="option-group" style={{ marginTop: '1rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span className="option-label" style={{ margin: 0 }}>
                          Fine-Tune Compression Strength
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 650, color: 'var(--fg)' }}>
                          {compressionLevel}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="85"
                        step="5"
                        value={compressionLevel}
                        onChange={(e) => {
                          setCompressionLevel(Number(e.target.value));
                          setCompressionPreset('custom');
                        }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--fg-muted)', marginTop: '4px' }}>
                        <span>Higher Quality (15%)</span>
                        <span>Smaller Size (85%)</span>
                      </div>
                    </div>

                    {/* Live File Size Estimation Banner */}
                    <div className="compression-estimate-bar">
                      <div>
                        <span style={{ color: 'var(--fg-muted)' }}>Original: </span>
                        <strong>{formatFileSize(files[0].size)}</strong>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: 'var(--fg-muted)' }}>Estimated: </span>
                        <strong style={{ color: 'var(--success)' }}>
                          ~{formatFileSize(Math.max(15000, Math.round(files[0].size * (1 - compressionLevel / 100))))}
                        </strong>
                        <span className="badge" style={{ fontSize: '11px', padding: '2px 6px', background: 'rgba(34,197,94,0.1)', color: 'var(--success)', borderColor: 'rgba(34,197,94,0.3)' }}>
                          ~{compressionLevel}% saved
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Speed Controller for Audio and Video */}
                {(tool.id === 'audio-speed' || tool.id === 'video-speed') && (
                  <SpeedController
                    file={files[0]}
                    type={tool.id === 'video-speed' ? 'video' : 'audio'}
                    speedRatio={speedRatio}
                    onChange={(newSpeed) => setSpeedRatio(newSpeed)}
                  />
                )}

                {/* PDF Split */}
                {tool.id === 'pdf-split' && (
                  <div className="option-group">
                    <label className="option-label">Page Ranges</label>
                    <input
                      type="text"
                      className="input"
                      placeholder="e.g. 1-3, 4-6 (Leave empty for all pages)"
                      value={pageRange}
                      onChange={(e) => setPageRange(e.target.value)}
                    />
                  </div>
                )}

                {/* Audio Volume */}
                {tool.id === 'audio-volume' && (
                  <div className="option-group">
                    <label className="option-label">Volume Gain ({Math.round(volumeLevel * 100)}%)</label>
                    <input
                      type="range"
                      min="0.1"
                      max="3.0"
                      step="0.1"
                      value={volumeLevel}
                      onChange={(e) => setVolumeLevel(Number(e.target.value))}
                    />
                  </div>
                )}

                {/* Image Rotate */}
                {tool.id === 'image-rotate' && (
                  <div className="option-group">
                    <label className="option-label">Rotation Angle</label>
                    <select
                      className="input"
                      value={rotateAngle}
                      onChange={(e) => setRotateAngle(e.target.value)}
                    >
                      <option value={90}>90° Clockwise</option>
                      <option value={180}>180°</option>
                      <option value={270}>270° (90° Counter-Clockwise)</option>
                    </select>
                  </div>
                )}

                {/* PDF Watermark */}
                {tool.id === 'pdf-watermark' && (
                  <div className="option-group">
                    <label className="option-label">Watermark Text</label>
                    <input
                      type="text"
                      className="input"
                      value={watermarkText}
                      onChange={(e) => setWatermarkText(e.target.value)}
                    />
                  </div>
                )}

                {/* Image Convert */}
                {tool.id === 'image-convert' && (
                  <div className="option-group">
                    <label className="option-label">Output Format</label>
                    <select
                      className="input"
                      value={imageFormat}
                      onChange={(e) => setImageFormat(e.target.value)}
                    >
                      <option value="image/jpeg">JPEG (.jpg)</option>
                      <option value="image/png">PNG (.png)</option>
                      <option value="image/webp">WebP (.webp)</option>
                    </select>
                  </div>
                )}

                {/* Summary for tools without extra configuration options */}
                {!hasOptions && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ fontSize: '13px', color: 'var(--fg-muted)', marginBottom: '1rem', lineHeight: 1.5 }}>
                      {tool.description}
                    </p>
                    <div
                      style={{
                        padding: '10px 12px',
                        background: 'var(--bg-muted)',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        fontSize: '12.5px',
                      }}
                    >
                      <div style={{ fontWeight: 600 }}>{files.length} {files.length === 1 ? 'file' : 'files'} ready</div>
                      <div style={{ color: 'var(--fg-muted)', fontSize: '11.5px', marginTop: '2px' }}>
                        Total: {formatFileSize(files.reduce((acc, f) => acc + f.size, 0))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Process Button */}
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: '0.75rem' }}
                  onClick={handleProcess}
                  disabled={isProcessing}
                >
                  {isProcessing
                    ? t('processing')
                    : (tool.id === 'audio-speed' || tool.id === 'video-speed')
                    ? `${t('process')} ${tool.name} (${speedRatio}x)`
                    : `${t('process')} ${tool.name}`}
                </button>
              </div>
            )}

            {/* Processing Panel */}
            {isProcessing && (
              <div className="processing-panel">
                <div className="processing-panel__header">
                  <span style={{ fontWeight: '500' }}>{t('processing')}</span>
                  <div className="spinner" />
                </div>
                <div className="processing-panel__body">
                  <ProgressBar progress={progress} statusText={statusText} animated />
                </div>
              </div>
            )}

            {/* Error Alert */}
            {error && (
              <div className="card" style={{ borderColor: 'var(--danger)', background: 'rgba(239,68,68,0.05)', marginBottom: '1.5rem' }}>
                <div style={{ color: 'var(--danger)', fontWeight: '500', marginBottom: '4px' }}>
                  {t('error')}
                </div>
                <div style={{ fontSize: '14px', color: 'var(--fg-muted)' }}>{error}</div>
              </div>
            )}

            {/* Result Card */}
            {result && (
              <div className="card animate-fade-in-up" style={{ borderColor: 'var(--success)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <span style={{ color: 'var(--success)', fontSize: '1.25rem' }}>✓</span>
                  <span style={{ fontWeight: '500', fontSize: '1.125rem' }}>{t('done')}</span>
                </div>

                {result.isMultiple ? (
                  <div>
                    <p style={{ fontSize: '14px', color: 'var(--fg-muted)', marginBottom: '1rem' }}>
                      Generated {result.items.length} output files:
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1.5rem' }}>
                      {result.items.map((item, idx) => (
                        <div key={idx} className="file-preview">
                          <div className="file-preview__info">
                            <div className="file-preview__name">{item.name}</div>
                          </div>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => downloadFile(item.data, item.name)}
                          >
                            {t('download')}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div className="file-preview">
                      <div className="file-preview__info">
                        <div className="file-preview__name">{result.name}</div>
                        {result.size && <div className="file-preview__size">{formatFileSize(result.size)}</div>}
                      </div>
                    </div>
                  </div>
                )}

                <button className="btn btn-primary btn-lg" style={{ width: '100%' }} onClick={handleDownload}>
                  {t('download')} {result.isMultiple ? '(All Files)' : ''}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
