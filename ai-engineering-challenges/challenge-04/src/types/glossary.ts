export type GlossaryCategory =
  | 'General Insurance'
  | 'Claims'
  | 'Coverage'
  | 'Life & Health'
  | 'Reinsurance'
  | 'Regulatory';

export interface GlossaryTerm {
  id: string;
  name: string;
  definition: string;
  category: GlossaryCategory;
  relatedTerms?: string[];
}

export const GLOSSARY_CATEGORIES: GlossaryCategory[] = [
  'General Insurance',
  'Claims',
  'Coverage',
  'Life & Health',
  'Reinsurance',
  'Regulatory',
];

export const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
