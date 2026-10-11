import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import type { PolicyDocument } from '../types';
import { INITIAL_POLICY_DOCUMENTS } from '../data/mockData';
import { PolicySearchService } from '../services/policySearch';
import type { SearchResultSnippet } from '../services/policySearch';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';

export const PolicyLibraryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedDocument, setSelectedDocument] = useState<PolicyDocument | null>(null);
  const [activeViewMode, setActiveViewMode] = useState<'ranked_snippets' | 'full_documents'>('ranked_snippets');

  // Search ranked snippets
  const rankedSnippets: SearchResultSnippet[] = useMemo(() => {
    return PolicySearchService.searchSnippets(searchQuery, categoryFilter);
  }, [searchQuery, categoryFilter]);

  // Filtered documents
  const filteredDocuments = useMemo(() => {
    return PolicySearchService.searchDocuments(searchQuery, categoryFilter);
  }, [searchQuery, categoryFilter]);

  const categories = ['All', 'Airlines', 'Hotels', 'Railways', 'Aggregator'];

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Statutory & Supplier Policy Library</h1>
          <p className="page-subtitle">
            Repository of carriage charters, force majeure waiver clauses, and Indian civil aviation disruption regulations.
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {/* Search & Category Filter Bar */}
        <div className="filter-bar">
          <div className="search-input-wrapper">
            <Search size={16} />
            <input
              type="text"
              className="form-input search-input"
              placeholder="Search policy clauses (e.g., cyclone, DGCA CAR Sec 3, hotel waiver, train refund)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>Category:</span>
              <select
                className="form-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                style={{ padding: '6px 10px', fontSize: '12px' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* View Mode Toggle */}
            <div style={{ display: 'flex', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
              <button
                type="button"
                className={`btn btn-sm ${activeViewMode === 'ranked_snippets' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveViewMode('ranked_snippets')}
                style={{ borderRadius: 0, border: 'none' }}
              >
                Ranked Snippets ({rankedSnippets.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${activeViewMode === 'full_documents' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveViewMode('full_documents')}
                style={{ borderRadius: 0, border: 'none' }}
              >
                Full Documents ({filteredDocuments.length})
              </button>
            </div>

            {(searchQuery || categoryFilter !== 'All') && (
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSearchQuery('');
                  setCategoryFilter('All');
                }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* View Mode 1: Ranked Policy Snippets with Relevance Scores */}
        {activeViewMode === 'ranked_snippets' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span>
                Showing {rankedSnippets.length} policy snippets ordered by retrieval relevance score
              </span>
              {searchQuery && (
                <span>Keyword match active on query: "{searchQuery}"</span>
              )}
            </div>

            {rankedSnippets.length === 0 ? (
              <div className="state-box">
                <div className="state-icon"><BookOpen size={24} /></div>
                <div className="state-title">No matching policy clauses found</div>
                <div className="state-desc">Try terms like "severe weather", "DGCA", "refund", "train", or "cancellation".</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rankedSnippets.map(({ snippet, score, matchingTerms }) => {
                  return (
                    <div
                      key={snippet.id}
                      style={{
                        padding: '16px',
                        border: '1px solid var(--border-color)',
                        borderRadius: 'var(--radius)',
                        backgroundColor: '#FFFFFF',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="citation-badge">[{snippet.citationIndex}]</span>
                            <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                              {snippet.documentTitle}
                            </strong>
                            <Badge variant="neutral">{snippet.supplier}</Badge>
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                            {snippet.section} {snippet.regulationCode && <code>({snippet.regulationCode})</code>}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span 
                            className="badge badge-teal" 
                            style={{ fontFamily: 'monospace', fontSize: '11px' }}
                            title="Calculated retrieval relevance score based on keyword coverage and domain weights"
                          >
                            Score: {(score * 100).toFixed(0)}% ({score.toFixed(2)})
                          </span>
                          <button
                            type="button"
                            className="btn btn-secondary btn-sm"
                            onClick={() => {
                              const doc = INITIAL_POLICY_DOCUMENTS.find(d => d.id === snippet.documentId);
                              if (doc) setSelectedDocument(doc);
                            }}
                            style={{ fontSize: '11px', padding: '3px 8px' }}
                          >
                            <ExternalLink size={12} />
                            <span>View Full Doc</span>
                          </button>
                        </div>
                      </div>

                      <blockquote 
                        style={{ 
                          margin: '4px 0 0 0', 
                          padding: '10px 12px', 
                          backgroundColor: 'var(--bg-canvas)', 
                          border: '1px solid var(--border-color)', 
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '13px',
                          color: 'var(--text-primary)',
                          lineHeight: '1.45'
                        }}
                      >
                        "{snippet.excerpt}"
                      </blockquote>

                      {matchingTerms.length > 0 && (
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span>Matched terms:</span>
                          {matchingTerms.map((m, mIdx) => (
                            <span key={mIdx} style={{ backgroundColor: 'var(--accent-light)', color: 'var(--accent)', padding: '1px 5px', borderRadius: '3px' }}>
                              {m}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* View Mode 2: Full Policy Documents */}
        {activeViewMode === 'full_documents' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '16px' }}>
            {filteredDocuments.map(doc => {
              return (
                <div 
                  key={doc.id}
                  style={{
                    padding: '18px',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Badge variant="teal">{doc.category}</Badge>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{doc.version}</span>
                  </div>

                  <div>
                    <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {doc.title}
                    </h4>
                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {doc.supplier} • Eff: {doc.effectiveDate}
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                    {doc.summary}
                  </p>

                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    Contains {doc.sections.length} codified statutory sections
                  </div>

                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: 'auto' }}
                    onClick={() => setSelectedDocument(doc)}
                  >
                    <FileText size={13} />
                    <span>Read Policy Document</span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Complete Document Reader Modal */}
      <Modal
        isOpen={Boolean(selectedDocument)}
        onClose={() => setSelectedDocument(null)}
        title={selectedDocument ? `${selectedDocument.title} (${selectedDocument.id})` : 'Document Reader'}
        maxWidth="760px"
        footer={
          <button 
            type="button" 
            className="btn btn-secondary btn-sm"
            onClick={() => setSelectedDocument(null)}
          >
            Close Reader
          </button>
        }
      >
        {selectedDocument && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', padding: '12px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius)', fontSize: '12px' }}>
              <div><strong>Supplier:</strong> {selectedDocument.supplier}</div>
              <div><strong>Category:</strong> {selectedDocument.category}</div>
              <div><strong>Version:</strong> {selectedDocument.version}</div>
              <div><strong>Effective Date:</strong> {selectedDocument.effectiveDate}</div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.45' }}>
              {selectedDocument.summary}
            </p>

            <h5 style={{ fontSize: '14px', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              Codified Policy Clauses & Standard Operating Procedures
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedDocument.sections.map((section, idx) => (
                <div key={idx} style={{ padding: '12px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backgroundColor: '#FFFFFF' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: 'var(--accent)', marginBottom: '4px' }}>
                    {section.title} {section.code && <code style={{ fontSize: '11px', color: 'var(--text-muted)' }}>[{section.code}]</code>}
                  </div>
                  <div style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                    {section.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
