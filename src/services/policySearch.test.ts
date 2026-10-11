import { describe, it, expect } from 'vitest';
import { PolicySearchService } from './policySearch';

describe('PolicySearchService', () => {
  describe('searchSnippets', () => {
    it('returns all snippets with their base scores when query is empty', () => {
      const results = PolicySearchService.searchSnippets('');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].score).toBeGreaterThan(0);
      expect(results[0].matchingTerms).toEqual([]);
    });

    it('returns all snippets when query has only short words (<= 2 chars)', () => {
      const results = PolicySearchService.searchSnippets('in on at');
      expect(results.length).toBeGreaterThan(0);
    });

    it('finds relevant snippets matching DGCA regulation keywords', () => {
      const results = PolicySearchService.searchSnippets('cancellation refund');
      expect(results.length).toBeGreaterThan(0);
      expect(results[0].matchingTerms.length).toBeGreaterThan(0);
      expect(results[0].score).toBeGreaterThan(0.5);
    });

    it('filters snippets by category correctly', () => {
      const airlineResults = PolicySearchService.searchSnippets('cancellation', 'Airlines');
      expect(airlineResults.length).toBeGreaterThan(0);
    });

    it('returns empty array when query does not match any snippet', () => {
      const results = PolicySearchService.searchSnippets('xylophone astronaut extraterrestrial');
      expect(results).toHaveLength(0);
    });
  });

  describe('searchDocuments', () => {
    it('returns all documents on empty search query', () => {
      const docs = PolicySearchService.searchDocuments('');
      expect(docs.length).toBe(8);
    });

    it('filters documents by category', () => {
      const airlineDocs = PolicySearchService.searchDocuments('', 'Airlines');
      expect(airlineDocs.length).toBeGreaterThan(0);
      airlineDocs.forEach(d => expect(d.category).toBe('Airlines'));
    });

    it('finds documents by supplier name', () => {
      const docs = PolicySearchService.searchDocuments('IndiGo');
      expect(docs.length).toBeGreaterThan(0);
      expect(docs.some(d => d.supplier.includes('IndiGo'))).toBe(true);
    });

    it('finds documents by clause content within sections', () => {
      const docs = PolicySearchService.searchDocuments('Force Majeure');
      expect(docs.length).toBeGreaterThan(0);
    });
  });
});
