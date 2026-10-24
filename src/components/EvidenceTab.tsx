import React, { useState } from 'react';
import type { EvidenceSnippet, PolicyDocument } from '../types';
import { Modal } from './Modal';
import { ExternalLink } from 'lucide-react';
import { INITIAL_POLICY_DOCUMENTS } from '../data/mockData';
import { ForensicsAndFactoringCard } from './ForensicsAndFactoringCard';

interface EvidenceTabProps {
  snippets: EvidenceSnippet[];
  onSelectCitation?: (citationIndex: number) => void;
  flightNumber?: string;
  tailNumber?: string;
}

export const EvidenceTab: React.FC<EvidenceTabProps> = ({ 
  snippets,
  flightNumber = '6E-2134',
  tailNumber = 'VT-IKR'
}) => {
  const [selectedDoc, setSelectedDoc] = useState<PolicyDocument | null>(null);

  const openDocumentModal = (documentId: string) => {
    const doc = INITIAL_POLICY_DOCUMENTS.find(d => d.id === documentId);
    if (doc) {
      setSelectedDoc(doc);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Real-World Aviation Forensics & Instant Factoring Engine */}
      <ForensicsAndFactoringCard 
        flightNumber={flightNumber}
        tailNumber={tailNumber}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
        <div>
          <h4 style={{ fontSize: '15px', fontWeight: 600 }}>Legal Clauses & Airline Rules (Evidence)</h4>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Official DGCA regulations and airline refund policies automatically matched by AI. Each rule is cited in the traveller recovery options above.
          </p>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          {snippets.length} Evidence Clauses In Context
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {snippets.map((snip) => {
          return (
            <div 
              key={snip.id}
              className="card"
              style={{ 
                padding: '16px',
                borderLeft: '4px solid var(--accent)',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="citation-badge" style={{ fontSize: '12px', padding: '2px 8px' }}>
                    [{snip.citationIndex}]
                  </span>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text-primary)' }}>
                    {snip.documentTitle}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span 
                    className="badge badge-teal" 
                    title="Dense retrieval relevance score after Cross-Encoder reranking"
                    style={{ fontSize: '11px', fontFamily: 'monospace' }}
                  >
                    Relevance: {(snip.relevanceScore * 100).toFixed(0)}% ({snip.relevanceScore.toFixed(2)})
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => openDocumentModal(snip.documentId)}
                    style={{ fontSize: '11px', padding: '3px 8px' }}
                  >
                    <ExternalLink size={12} />
                    <span>Source Doc</span>
                  </button>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <span><strong>Supplier:</strong> {snip.supplier}</span>
                <span><strong>Section:</strong> {snip.section}</span>
                {snip.regulationCode && (
                  <span><strong>Statutory Code:</strong> <code>{snip.regulationCode}</code></span>
                )}
              </div>

              <blockquote 
                style={{ 
                  margin: '4px 0 0 0', 
                  padding: '10px 12px', 
                  backgroundColor: 'var(--bg-canvas)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius)',
                  fontSize: '13px',
                  lineHeight: '1.5',
                  color: 'var(--text-primary)'
                }}
              >
                "{snip.excerpt}"
              </blockquote>
            </div>
          );
        })}
      </div>

      {/* Source Policy Reader Modal */}
      <Modal
        isOpen={Boolean(selectedDoc)}
        onClose={() => setSelectedDoc(null)}
        title={selectedDoc ? `${selectedDoc.title} (${selectedDoc.id})` : 'Policy Document'}
        maxWidth="720px"
        footer={
          <button 
            type="button" 
            className="btn btn-secondary btn-sm" 
            onClick={() => setSelectedDoc(null)}
          >
            Close Reader
          </button>
        }
      >
        {selectedDoc && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', backgroundColor: 'var(--bg-canvas)', borderRadius: 'var(--radius)', fontSize: '12px' }}>
              <div><strong>Supplier:</strong> {selectedDoc.supplier}</div>
              <div><strong>Category:</strong> {selectedDoc.category}</div>
              <div><strong>Version:</strong> {selectedDoc.version}</div>
              <div><strong>Effective:</strong> {selectedDoc.effectiveDate}</div>
            </div>

            <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {selectedDoc.summary}
            </p>

            <h5 style={{ fontSize: '13px', fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
              Full Regulatory & Policy Sections
            </h5>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {selectedDoc.sections.map((sec, idx) => (
                <div key={idx} style={{ padding: '10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius)', backgroundColor: '#FFFFFF' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', marginBottom: '4px', color: 'var(--accent)' }}>
                    {sec.title} {sec.code && <code style={{ fontSize: '11px', color: 'var(--text-muted)' }}>[{sec.code}]</code>}
                  </div>
                  <div style={{ fontSize: '12px', lineHeight: '1.5', color: 'var(--text-primary)' }}>
                    {sec.content}
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
