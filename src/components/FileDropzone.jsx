import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { detectFileCategory } from '../utils/fileUtils';
import { useLanguage } from '../context/LanguageContext';
import { IconFolder, IconSparkles } from './Icons';

export default function FileDropzone({ onFilesSelected, accept, toolId }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleFiles = useCallback((files) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    if (onFilesSelected) {
      onFilesSelected(fileArray);
      return;
    }

    // Auto-route to appropriate tool based on file type
    const category = detectFileCategory(fileArray[0]);
    const routeMap = {
      pdf: '/tool/pdf-merge',
      image: '/tool/image-convert',
      video: '/tool/video-trim',
      audio: '/tool/audio-convert',
      document: '/tool/docx-to-pdf',
      archive: '/tool/extract-zip',
    };
    const route = routeMap[category] || '/tools';
    navigate(route, { state: { files: fileArray } });
  }, [onFilesSelected, navigate]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e) => {
    handleFiles(e.target.files);
    e.target.value = '';
  };

  const acceptStr = accept ? accept.join(',') : undefined;

  return (
    <div
      className={`dropzone ${isDragging ? 'dropzone--active' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="Upload files by clicking or dragging"
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleClick(); }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={acceptStr}
        onChange={handleInputChange}
        style={{ display: 'none' }}
        aria-hidden="true"
      />

      <div className="dropzone__icon">
        {isDragging ? <IconSparkles size={26} /> : <IconFolder size={26} />}
      </div>

      <div className="dropzone__title">
        {isDragging ? 'Drop files here to start' : t('dropTitle')}
      </div>

      <div className="dropzone__subtitle">
        {accept
          ? `Supported formats: ${accept.join(', ')}`
          : t('dropSubtitle')
        }
      </div>

      <div style={{ marginTop: '8px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <button
          className="btn btn-primary btn-sm"
          onClick={(e) => { e.stopPropagation(); handleClick(); }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span>{t('browseFiles')}</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginTop: '6px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <span className="badge badge-outline" style={{ fontSize: '10px' }}>PDF</span>
        <span className="badge badge-outline" style={{ fontSize: '10px' }}>PNG / JPG</span>
        <span className="badge badge-outline" style={{ fontSize: '10px' }}>MP4 / MOV</span>
        <span className="badge badge-outline" style={{ fontSize: '10px' }}>MP3 / WAV</span>
        <span className="badge badge-outline" style={{ fontSize: '10px' }}>DOCX / ZIP</span>
      </div>
    </div>
  );
}
