import { useState } from 'react';
import { Link } from 'react-router-dom';
import { examSpecs, searchExams, DISCLAIMER_TEXT } from '../data/examSpecs';

export default function ExamSpecsPage() {
  const [query, setQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('all');

  const filteredExams = query.trim()
    ? searchExams(query)
    : selectedExamId === 'all'
    ? examSpecs
    : examSpecs.filter((e) => e.id === selectedExamId);

  return (
    <div className="container section" style={{ paddingTop: '2.5rem' }}>
      {/* Header Eyebrow & Title */}
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div className="badge badge-glow" style={{ marginBottom: '12px' }}>
          🎯 Official Guidelines
        </div>
        <h1 className="text-heading-lg" style={{ marginBottom: '0.75rem' }}>
          Exam Document Specifications
        </h1>
        <p className="text-body" style={{ maxWidth: '64ch', margin: '0 auto' }}>
          Find exact document sizes, formats, and dimension guidelines required for official competitive exams.
        </p>
      </div>

      {/* Official Disclaimer Callout Alert Box */}
      <div
        style={{
          background: 'rgba(234, 179, 8, 0.06)',
          border: '1px solid rgba(234, 179, 8, 0.25)',
          borderRadius: 'var(--radius-xl)',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>⚠️</span>
        <div style={{ fontSize: '0.875rem', color: 'var(--fg)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--warning)', fontWeight: 650 }}>Important Verification Notice:</strong>{' '}
          {DISCLAIMER_TEXT}
        </div>
      </div>

      {/* Exam Search & Selector controls */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '2rem',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Search Input */}
        <div style={{ flex: '1 1 300px', position: 'relative' }}>
          <input
            type="text"
            className="input"
            placeholder="Search exam (e.g. NEET, JEE, UPSC, GATE, SSC)..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedExamId('all');
            }}
            style={{ paddingLeft: '38px' }}
          />
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--fg-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        {/* Quick Exam Selector Dropdown */}
        <select
          className="input"
          style={{ width: 'auto', minWidth: '220px' }}
          value={selectedExamId}
          onChange={(e) => {
            setSelectedExamId(e.target.value);
            setQuery('');
          }}
        >
          <option value="all">All 15 Official Exams</option>
          {examSpecs.map((exam) => (
            <option key={exam.id} value={exam.id}>
              {exam.name}
            </option>
          ))}
        </select>
      </div>

      {/* Exam List Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {filteredExams.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <p className="text-body">No matching official exam found for "{query}".</p>
          </div>
        ) : (
          filteredExams.map((exam) => (
            <div key={exam.id} className="card" id={`exam-${exam.id}`}>
              {/* Exam Title & Category */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '1.25rem',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '0.875rem',
                }}
              >
                <div>
                  <h2 className="text-heading-sm" style={{ fontSize: '1.25rem', marginBottom: '3px' }}>
                    {exam.name}
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--fg-muted)' }}>{exam.description}</p>
                </div>
                <span className="badge badge-outline" style={{ textTransform: 'uppercase', fontSize: '10px' }}>
                  {exam.category}
                </span>
              </div>

              {/* Document Specs List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                {exam.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-muted)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.125rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 650, fontSize: '0.9375rem', marginBottom: '8px', color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="16" y1="13" x2="8" y2="13" />
                          <line x1="16" y1="17" x2="8" y2="17" />
                          <polyline points="10 9 9 9 8 9" />
                        </svg>
                        <span>{doc.type}</span>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--fg-muted)' }}>Format:</span>
                          <span className="badge" style={{ fontSize: '10px', padding: '1px 6px' }}>
                            {doc.format}
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--fg-muted)' }}>File Size:</span>
                          <strong style={{ color: 'var(--fg)', fontFamily: 'var(--font-mono)' }}>{doc.fileSize}</strong>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--fg-muted)' }}>Dimensions:</span>
                          <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--fg)' }}>{doc.dimensions}</span>
                        </div>
                        {doc.notes && (
                          <div style={{ color: 'var(--fg-muted)', fontSize: '0.75rem', marginTop: '6px', paddingTop: '6px', borderTop: '1px dashed var(--border)' }}>
                            💡 {doc.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    {doc.toolRoute && (
                      <Link
                        to={doc.toolRoute}
                        className="btn btn-secondary btn-sm"
                        style={{ marginTop: '14px', justifyContent: 'center' }}
                      >
                        <span>Prepare File</span>
                        <span>→</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
