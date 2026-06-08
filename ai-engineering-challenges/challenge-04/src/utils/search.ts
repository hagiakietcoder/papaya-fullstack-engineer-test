import type { GlossaryTerm } from '../types/glossary';

export function normalizeText(value: string): string {
  return value.toLowerCase().trim();
}

export function termMatchesQuery(term: GlossaryTerm, query: string): boolean {
  if (!query) {
    return true;
  }

  const normalizedQuery = normalizeText(query);
  return (
    normalizeText(term.name).includes(normalizedQuery) ||
    normalizeText(term.definition).includes(normalizedQuery)
  );
}

export function filterTerms(terms: GlossaryTerm[], query: string): GlossaryTerm[] {
  if (!query.trim()) {
    return terms;
  }

  return terms.filter((term) => termMatchesQuery(term, query));
}

export function getFirstLetter(name: string): string {
  const letter = name.trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(letter) ? letter : '#';
}

export function groupTermsByCategory(
  terms: GlossaryTerm[],
): Record<string, GlossaryTerm[]> {
  return terms.reduce<Record<string, GlossaryTerm[]>>((groups, term) => {
    if (!groups[term.category]) {
      groups[term.category] = [];
    }
    groups[term.category].push(term);
    return groups;
  }, {});
}

export function getAvailableLetters(terms: GlossaryTerm[]): Set<string> {
  return new Set(terms.map((term) => getFirstLetter(term.name)));
}

export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
