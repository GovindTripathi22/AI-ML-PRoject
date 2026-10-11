import type { PolicyDocument, EvidenceSnippet } from '../types';
import { INITIAL_POLICY_DOCUMENTS, INITIAL_EVIDENCE_SNIPPETS } from '../data/mockData';

export interface SearchResultSnippet {
  snippet: EvidenceSnippet;
  score: number;
  matchingTerms: string[];
}

export const PolicySearchService = {
  searchSnippets: (query: string, categoryFilter?: string): SearchResultSnippet[] => {
    if (!query || query.trim() === '') {
      return INITIAL_EVIDENCE_SNIPPETS.map(snippet => ({
        snippet,
        score: snippet.relevanceScore,
        matchingTerms: []
      }));
    }

    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .filter(t => t.length > 2);

    if (terms.length === 0) {
      return INITIAL_EVIDENCE_SNIPPETS.map(snippet => ({
        snippet,
        score: snippet.relevanceScore,
        matchingTerms: []
      }));
    }

    const scored = INITIAL_EVIDENCE_SNIPPETS.map(snippet => {
      let matchCount = 0;
      const matched: string[] = [];

      const doc = INITIAL_POLICY_DOCUMENTS.find(d => d.id === snippet.documentId);
      if (categoryFilter && categoryFilter !== 'All' && doc && doc.category !== categoryFilter) {
        return { snippet, score: 0, matchingTerms: [] };
      }

      const textToSearch = `${snippet.documentTitle} ${snippet.supplier} ${snippet.section} ${snippet.excerpt} ${snippet.regulationCode || ''}`.toLowerCase();

      terms.forEach(term => {
        if (textToSearch.includes(term)) {
          matchCount++;
          matched.push(term);
        }
      });

      if (matchCount === 0) {
        return { snippet, score: 0, matchingTerms: [] };
      }

      // Base formula: weighted term coverage + base relevance score boost
      const coverage = matchCount / terms.length;
      const calculatedScore = Math.min(0.99, Number((coverage * 0.7 + snippet.relevanceScore * 0.3).toFixed(2)));

      return {
        snippet,
        score: calculatedScore,
        matchingTerms: matched
      };
    });

    return scored
      .filter(res => res.score > 0)
      .sort((a, b) => b.score - a.score);
  },

  searchDocuments: (query: string, categoryFilter?: string): PolicyDocument[] => {
    let docs = INITIAL_POLICY_DOCUMENTS;

    if (categoryFilter && categoryFilter !== 'All') {
      docs = docs.filter(d => d.category === categoryFilter);
    }

    if (!query || query.trim() === '') {
      return docs;
    }

    const q = query.toLowerCase().trim();
    return docs.filter(doc => {
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchSupplier = doc.supplier.toLowerCase().includes(q);
      const matchSummary = doc.summary.toLowerCase().includes(q);
      const matchSection = doc.sections.some(
        s => s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q) || (s.code && s.code.toLowerCase().includes(q))
      );
      return matchTitle || matchSupplier || matchSummary || matchSection;
    });
  }
};
