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
      document: '/tool/txt-to-pdf',
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
        {isDragging ? <IconSparkles size={32} /> : <IconFolder size={32} />}
      </div>

      <div className="dropzone__title">
        {isDragging ? 'Drop files here' : t('dropTitle')}
      </div>

      <div className="dropzone__subtitle">
        {accept
          ? `Accepts: ${accept.join(', ')}`
          : t('dropSubtitle')
        }
      </div>

      <button className="btn btn-primary btn-sm" onClick={(e) => { e.stopPropagation(); handleClick(); }}>
        {t('browseFiles')}
      </button>
    </div>
  );
}
