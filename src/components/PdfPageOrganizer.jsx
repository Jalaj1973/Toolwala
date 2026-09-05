import { useState, useEffect, useCallback, useRef } from 'react';
import { renderPdfThumbnails } from '../processors/pdfProcessor';

export default function PdfPageOrganizer({ file, mode = 'reorder', onPagesChange }) {
  const [pages, setPages] = useState([]);
  const [initialPages, setInitialPages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStatus, setLoadingStatus] = useState('');
  const [error, setError] = useState(null);

  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);

  const onPagesChangeRef = useRef(onPagesChange);
  useEffect(() => {
    onPagesChangeRef.current = onPagesChange;
  }, [onPagesChange]);

  // Load thumbnails whenever the file changes
  useEffect(() => {
    if (!file) {
      setPages([]);
      setInitialPages([]);
      return;
    }

    let isMounted = true;
    setIsLoading(true);
    setLoadingProgress(5);
    setLoadingStatus('Initializing page reader...');
    setError(null);

    renderPdfThumbnails(file, (pct, status) => {
      if (isMounted) {
        setLoadingProgress(pct);
        setLoadingStatus(status);
      }
    })
      .then((loadedPages) => {
        if (!isMounted) return;
        setPages(loadedPages);
        setInitialPages(JSON.parse(JSON.stringify(loadedPages)));
        setIsLoading(false);
        if (onPagesChangeRef.current) {
          onPagesChangeRef.current(loadedPages, loadedPages.length > 0);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Error rendering PDF thumbnails:', err);
        setError('Failed to render PDF page previews. The file might be password-protected or corrupted.');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [file]);

  // Notify parent whenever pages change
  const updatePages = useCallback((newPages) => {
    setPages(newPages);
    if (onPagesChangeRef.current) {
      const activePages = mode === 'extract'
        ? newPages.filter((p) => p.isSelected)
        : newPages;
      onPagesChangeRef.current(newPages, activePages.length > 0);
    }
  }, [mode]);

  // Drag and drop handlers
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent ghost or fallback
    try {
      e.dataTransfer.setData('text/plain', `${index}`);
    } catch {
      // Ignore if browser restricts
    }
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const reordered = [...pages];
    const [movedItem] = reordered.splice(draggedIndex, 1);
    reordered.splice(targetIndex, 0, movedItem);

    setDraggedIndex(null);
    setDragOverIndex(null);
    updatePages(reordered);
  };

  // 1-Click Accessible Move (Left / Right)
  const handleMove = (index, delta) => {
    const targetIndex = index + delta;
    if (targetIndex < 0 || targetIndex >= pages.length) return;

    const reordered = [...pages];
    const [movedItem] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, movedItem);
    updatePages(reordered);
  };

  // Rotate single page 90 degrees clockwise
  const handleRotatePage = (index) => {
    const updated = pages.map((p, i) => {
      if (i !== index) return p;
      return { ...p, rotation: (p.rotation + 90) % 360 };
    });
    updatePages(updated);
  };

  // Rotate all pages 90 degrees
  const handleRotateAll = () => {
    const updated = pages.map((p) => ({
      ...p,
      rotation: (p.rotation + 90) % 360,
    }));
    updatePages(updated);
  };

  // Delete / Exclude single page
  const handleDeletePage = (index) => {
    if (pages.length <= 1) return; // Keep at least 1 page
    const updated = pages.filter((_, i) => i !== index);
    updatePages(updated);
  };

  // Toggle selection for Extract mode
  const handleToggleSelect = (index) => {
    const updated = pages.map((p, i) => {
      if (i !== index) return p;
      return { ...p, isSelected: !p.isSelected };
    });
    updatePages(updated);
  };

  // Select all / Deselect all
  const handleSelectAll = (select) => {
    const updated = pages.map((p) => ({ ...p, isSelected: select }));
    updatePages(updated);
  };

  // Reset to original document layout
  const handleReset = () => {
    if (initialPages.length > 0) {
      const resetList = JSON.parse(JSON.stringify(initialPages));
      updatePages(resetList);
    }
  };

  if (!file) return null;

  const selectedCount = pages.filter((p) => p.isSelected).length;

  return (
    <div className="card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Loading Skeleton & Progress */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-muted)', marginBottom: '1rem' }}>
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" strokeLinecap="round" />
            </svg>
          </div>
          <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '6px' }}>
            Generating page previews...
          </div>
          <p style={{ color: 'var(--fg-muted)', fontSize: '13px', marginBottom: '12px' }}>
            {loadingStatus} ({loadingProgress}%)
          </p>
          <div style={{ width: '100%', maxWidth: '280px', height: '4px', background: 'var(--border)', borderRadius: '2px', margin: '0 auto', overflow: 'hidden' }}>
            <div
              style={{
                width: `${loadingProgress}%`,
                height: '100%',
                background: 'var(--fg)',
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div style={{ padding: '1.25rem', color: '#ef4444', background: 'rgba(239, 68, 68, 0.08)', borderRadius: '8px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {/* Organizer Content */}
      {!isLoading && !error && pages.length > 0 && (
        <div>
          {/* Top Action Toolbar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              paddingBottom: '1rem',
              borderBottom: '1px solid var(--border)',
              marginBottom: '1.25rem',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>Organize Pages</span>
                <span className="badge" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {mode === 'extract'
                    ? `${selectedCount} of ${pages.length} selected`
                    : `${pages.length} ${pages.length === 1 ? 'page' : 'pages'}`}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--fg-muted)', marginTop: '2px' }}>
                {mode === 'extract'
                  ? 'Click pages to select/unselect for extraction'
                  : 'Drag pages or use arrows to rearrange the order'}
              </p>
            </div>

            {/* Batch Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {mode === 'extract' ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(true)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '12px', padding: '4px 10px', height: '28px' }}
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="btn btn-outline btn-sm"
                    style={{ fontSize: '12px', padding: '4px 10px', height: '28px' }}
                  >
                    Deselect All
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleRotateAll}
                  className="btn btn-outline btn-sm"
                  style={{ fontSize: '12px', padding: '4px 10px', height: '28px', gap: '4px' }}
                  title="Rotate all pages 90° clockwise"
                >
                  <span>Rotate All</span>
                  <span>↻</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleReset}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '12px', padding: '4px 10px', height: '28px', color: 'var(--fg-muted)' }}
                title="Reset order and rotation"
              >
                Reset ↺
              </button>
            </div>
          </div>

          {/* Responsive Page Grid */}
          <div
            className="pdf-page-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
              gap: '16px',
            }}
          >
            {pages.map((page, index) => {
              const isDraggingThis = draggedIndex === index;
              const isOverThis = dragOverIndex === index;

              return (
                <div
                  key={page.id}
                  draggable={mode !== 'extract'}
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  onDrop={(e) => handleDrop(e, index)}
                  onClick={() => mode === 'extract' && handleToggleSelect(index)}
                  className={`pdf-page-card ${mode === 'extract' ? (page.isSelected ? 'pdf-page-card--selected' : 'pdf-page-card--deselected') : ''}`}
                  style={{
                    position: 'relative',
                    background: 'var(--bg-card)',
                    border: isOverThis
                      ? '2px dashed var(--fg)'
                      : mode === 'extract' && !page.isSelected
                        ? '1px dashed var(--border)'
                        : '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '10px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: mode === 'extract' ? 'pointer' : 'grab',
                    opacity: isDraggingThis ? 0.4 : mode === 'extract' && !page.isSelected ? 0.45 : 1,
                    transition: 'transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease',
                    userSelect: 'none',
                  }}
                >
                  {/* Top card bar: Page index pill + quick action icons */}
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 650,
                        padding: '2px 7px',
                        borderRadius: '6px',
                        background: 'var(--bg-muted)',
                        color: 'var(--fg)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {index + 1}
                    </span>

                    {/* Quick per-card actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {mode === 'extract' ? (
                        <input
                          type="checkbox"
                          checked={page.isSelected}
                          onChange={() => handleToggleSelect(index)}
                          onClick={(e) => e.stopPropagation()}
                          style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--fg)' }}
                        />
                      ) : (
                        <>
                          {/* Rotate Page Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRotatePage(index);
                            }}
                            className="pdf-page-btn"
                            title="Rotate 90° clockwise"
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '4px',
                              border: '1px solid var(--border)',
                              background: 'var(--bg-muted)',
                              color: 'var(--fg)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              fontSize: '13px',
                            }}
                          >
                            ↻
                          </button>

                          {/* Delete Page Button (if more than 1 page) */}
                          {pages.length > 1 && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeletePage(index);
                              }}
                              className="pdf-page-btn pdf-page-btn--danger"
                              title="Delete page"
                              style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '4px',
                                border: '1px solid var(--border)',
                                background: 'var(--bg-muted)',
                                color: 'var(--fg-muted)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '11px',
                              }}
                            >
                              ✕
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Image Container */}
                  <div
                    style={{
                      width: '100%',
                      height: '190px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#111',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      padding: '6px',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.06)',
                    }}
                  >
                    <img
                      src={page.thumbnail}
                      alt={`Page ${page.pageNumber}`}
                      style={{
                        maxWidth: '100%',
                        maxHeight: '100%',
                        objectFit: 'contain',
                        borderRadius: '3px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                        transform: `rotate(${page.rotation}deg)`,
                        transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </div>

                  {/* Bottom Footer: Arrow Reorder Controls & Original page indicator */}
                  <div
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '8px',
                      paddingTop: '6px',
                      borderTop: '1px solid var(--border)',
                    }}
                  >
                    <span style={{ fontSize: '11px', color: 'var(--fg-muted)' }}>
                      Orig. p.{page.pageNumber}
                      {page.rotation !== 0 && ` (${page.rotation}°)`}
                    </span>

                    {/* Accessible 1-Click Move Arrows (for mobile & desktop) */}
                    {mode !== 'extract' && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(index, -1);
                          }}
                          className="pdf-page-btn"
                          title="Move left"
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            background: index === 0 ? 'transparent' : 'var(--bg-muted)',
                            color: index === 0 ? 'var(--border)' : 'var(--fg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: index === 0 ? 'not-allowed' : 'pointer',
                            fontSize: '11px',
                          }}
                        >
                          ←
                        </button>
                        <button
                          type="button"
                          disabled={index === pages.length - 1}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMove(index, 1);
                          }}
                          className="pdf-page-btn"
                          title="Move right"
                          style={{
                            width: '22px',
                            height: '22px',
                            borderRadius: '4px',
                            border: '1px solid var(--border)',
                            background: index === pages.length - 1 ? 'transparent' : 'var(--bg-muted)',
                            color: index === pages.length - 1 ? 'var(--border)' : 'var(--fg)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: index === pages.length - 1 ? 'not-allowed' : 'pointer',
                            fontSize: '11px',
                          }}
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
