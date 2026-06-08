import type { GlossaryTerm } from '../types/glossary';
import { highlightText } from '../utils/highlight';
import './CategorySection.css';

interface CategorySectionProps {
  category: string;
  terms: GlossaryTerm[];
  isExpanded: boolean;
  selectedTermId: string | null;
  query: string;
  onToggle: (category: string) => void;
  onSelectTerm: (termId: string) => void;
}

export function CategorySection({
  category,
  terms,
  isExpanded,
  selectedTermId,
  query,
  onToggle,
  onSelectTerm,
}: CategorySectionProps) {
  if (terms.length === 0) {
    return null;
  }

  const sectionId = `category-${category.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <section className="category-section" id={sectionId}>
      <button
        type="button"
        className={`category-section__toggle${isExpanded ? ' category-section__toggle--open' : ''}`}
        aria-expanded={isExpanded}
        aria-controls={`${sectionId}-panel`}
        onClick={() => onToggle(category)}
      >
        <span className="category-section__title">{category}</span>
        <span className="category-section__count">{terms.length}</span>
        <svg className="category-section__chevron" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isExpanded && (
        <ul id={`${sectionId}-panel`} className="category-section__list">
          {terms.map((term) => (
            <li key={term.id} id={`term-${term.id}`}>
              <button
                type="button"
                className={`category-section__term${
                  selectedTermId === term.id ? ' category-section__term--active' : ''
                }`}
                onClick={() => onSelectTerm(term.id)}
              >
                <span className="category-section__term-name">
                  {highlightText(term.name, query)}
                </span>
                <span className="category-section__term-preview">
                  {highlightText(
                    term.definition.length > 90
                      ? `${term.definition.slice(0, 90)}…`
                      : term.definition,
                    query,
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
