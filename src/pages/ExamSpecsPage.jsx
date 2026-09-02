import { useState } from 'react';
import { Link } from 'react-router-dom';
import { examSpecs, searchExams, DISCLAIMER_TEXT } from '../data/examSpecs';
import { getToolSvgIcon } from '../components/Icons';

export default function ExamSpecsPage() {
  const [query, setQuery] = useState('');
  const [selectedExamId, setSelectedExamId] = useState('all');

  const filteredExams = query.trim()
    ? searchExams(query)
    : selectedExamId === 'all'
    ? examSpecs
    : examSpecs.filter((e) => e.id === selectedExamId);

  return (
    <div className="container section" style={{ paddingTop: '2rem' }}>
      {/* Header Eyebrow & Title */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div className="badge" style={{ marginBottom: '12px' }}>
          🎯 Official Guidelines
        </div>
        <h1 className="text-heading-lg" style={{ marginBottom: '1rem' }}>
          Exam Document Specifications
        </h1>
        <p className="text-body" style={{ maxWidth: '64ch', margin: '0 auto' }}>
          Find exact document sizes, formats, and dimension guidelines required for official competitive exams.
        </p>
      </div>

      {/* Official Disclaimer Callout Alert Box */}
      <div
        style={{
          background: 'rgba(234, 179, 8, 0.08)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          borderRadius: 'var(--radius-lg)',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <span style={{ fontSize: '1.25rem' }}>⚠️</span>
        <div style={{ fontSize: '0.875rem', color: 'var(--fg)', lineHeight: 1.5 }}>
          <strong>Important Verification Notice:</strong> {DISCLAIMER_TEXT}
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
            }}
          >
            🔍
          </span>
        </div>

        {/* Quick Exam Selector Dropdown */}
        <select
          className="input"
          style={{ width: 'auto', minWidth: '200px' }}
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--border-hairline)',
                  paddingBottom: '0.75rem',
                }}
              >
                <div>
                  <h2 className="text-heading-sm" style={{ fontSize: '1.25rem', marginBottom: '2px' }}>
                    {exam.name}
                  </h2>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--fg-muted)' }}>{exam.description}</p>
                </div>
                <span className="badge">{exam.category}</span>
              </div>

              {/* Document Specs List */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
                {exam.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: 'var(--bg-canvas)',
                      border: '1px solid var(--border-hairline)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9375rem', marginBottom: '8px', color: 'var(--fg)' }}>
                        📄 {doc.type}
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.8125rem' }}>
                        <div>
                          <span style={{ color: 'var(--fg-muted)' }}>Format:</span>{' '}
                          <span className="badge" style={{ fontSize: '10px' }}>
                            {doc.format}
                          </span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--fg-muted)' }}>File Size:</span>{' '}
                          <strong style={{ color: 'var(--fg)' }}>{doc.fileSize}</strong>
                        </div>
                        <div>
                          <span style={{ color: 'var(--fg-muted)' }}>Dimensions:</span>{' '}
                          <span style={{ fontFamily: 'var(--font-mono)' }}>{doc.dimensions}</span>
                        </div>
                        {doc.notes && (
                          <div style={{ color: 'var(--fg-muted)', fontSize: '0.75rem', marginTop: '4px' }}>
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
                        style={{ marginTop: '12px', justifyContent: 'center' }}
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
