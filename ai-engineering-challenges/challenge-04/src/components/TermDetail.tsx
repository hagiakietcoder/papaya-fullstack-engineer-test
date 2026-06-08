import { TERM_MAP } from '../data/glossary';
import type { GlossaryTerm } from '../types/glossary';
import { highlightText } from '../utils/highlight';
import './TermDetail.css';

interface TermDetailProps {
  term: GlossaryTerm;
  query: string;
  onSelectRelated: (termId: string) => void;
}

function formatRelatedLabel(termId: string): string {
  return TERM_MAP[termId]?.name ?? termId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function TermDetail({ term, query, onSelectRelated }: TermDetailProps) {
  return (
    <article className="term-detail">
      <div className="term-detail__header">
        <span className="term-detail__category">{term.category}</span>
        <h2 className="term-detail__name">{highlightText(term.name, query)}</h2>
      </div>

      <p className="term-detail__definition">{highlightText(term.definition, query)}</p>

      {term.relatedTerms && term.relatedTerms.length > 0 && (
        <div className="term-detail__related">
          <h3>Related terms</h3>
          <div className="term-detail__related-list">
            {term.relatedTerms.map((relatedId) => (
              <button
                key={relatedId}
                type="button"
                className="term-detail__related-btn"
                onClick={() => onSelectRelated(relatedId)}
              >
                {formatRelatedLabel(relatedId)}
              </button>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
