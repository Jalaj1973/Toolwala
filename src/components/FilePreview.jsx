import { formatFileSize, getFileIcon } from '../utils/fileUtils';

export default function FilePreview({ file, onRemove, index }) {
  return (
    <div className="file-preview">
      <div className="file-preview__icon">
        {getFileIcon(file.name)}
      </div>
      <div className="file-preview__info">
        <div className="file-preview__name" title={file.name}>
          {file.name}
        </div>
        <div className="file-preview__size">
          {formatFileSize(file.size)}
        </div>
      </div>
      {onRemove && (
        <button
          className="file-preview__remove"
          onClick={() => onRemove(index !== undefined ? index : file)}
          aria-label={`Remove file ${file.name}`}
          title="Remove file"
        >
          ✕
        </button>
      )}
    </div>
  );
}
