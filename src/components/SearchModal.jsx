import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { tools } from '../data/tools';
import { examSpecs } from '../data/examSpecs';
import { useLanguage } from '../context/LanguageContext';
import { getToolSvgIcon } from './Icons';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Combine matching tools & matching exam specs
  const matchingTools = query.trim()
    ? tools.filter(
        (tool) =>
          tool.name.toLowerCase().includes(query.toLowerCase()) ||
          tool.description.toLowerCase().includes(query.toLowerCase()) ||
          tool.category.toLowerCase().includes(query.toLowerCase())
      )
    : tools.slice(0, 8);

  const matchingExams = query.trim()
    ? examSpecs
        .filter(
          (exam) =>
            exam.name.toLowerCase().includes(query.toLowerCase()) ||
            exam.description.toLowerCase().includes(query.toLowerCase()) ||
            exam.category.toLowerCase().includes(query.toLowerCase())
        )
        .map((exam) => ({
          id: `exam-${exam.id}`,
          name: `${exam.name} Document Specs`,
          description: `Exact photo, signature, and certificate guidelines for ${exam.name}`,
          category: 'exam',
          route: `/exams#exam-${exam.id}`,
          isExam: true,
        }))
    : [];

  const combinedResults = [...matchingExams, ...matchingTools];

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, combinedResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = combinedResults[selectedIndex];
      if (target) {
        if (target.isExam) {
          navigate('/exams');
        } else {
          navigate(`/tool/${target.id}`);
        }
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '12vh',
        animation: 'fadeIn 0.2s ease',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '580px',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-hairline)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-overlay)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div
          style={{
            padding: '12px 16px',
            borderBottom: '1px solid var(--border-hairline)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <span style={{ display: 'flex', color: 'var(--fg-muted)' }}>
            {getToolSvgIcon('convert', 18)}
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tools or exams (e.g. NEET, JEE, UPSC, Merge PDF)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '15px',
              color: 'var(--fg)',
              fontFamily: 'var(--font-sans)',
            }}
          />
          <kbd className="kbd-badge">ESC</kbd>
        </div>

        {/* Results List */}
        <div style={{ maxHeight: '380px', overflowY: 'auto', padding: '8px' }}>
          {combinedResults.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--fg-muted)' }}>
              No matching tools or official exams found for "{query}"
            </div>
          ) : (
            combinedResults.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.isExam) {
                      navigate('/exams');
                    } else {
                      navigate(`/tool/${item.id}`);
                    }
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-lg)',
                    background: isSelected ? 'var(--bg-surface-hover)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span style={{ display: 'flex', color: 'var(--fg)' }}>
                    {item.isExam ? '🎯' : getToolSvgIcon(item.iconKey || 'convert', 20)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 500, fontSize: '14px', color: 'var(--fg)' }}>
                      {item.name}
                    </div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: 'var(--fg-muted)',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.description}
                    </div>
                  </div>
                  <span className="badge">
                    {item.category.toUpperCase()}
                  </span>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Hint */}
        <div
          style={{
            padding: '8px 16px',
            borderTop: '1px solid var(--border-hairline)',
            background: 'var(--bg-canvas)',
            fontSize: '11px',
            color: 'var(--fg-faint)',
            display: 'flex',
            justify: 'space-between',
            fontFamily: 'var(--font-mono)',
          }}
        >
          <span>↑↓ Navigate</span>
          <span>↵ Open Specs / Tool</span>
          <span>{t('shortcut')}</span>
        </div>
      </div>
    </div>
  );
}
