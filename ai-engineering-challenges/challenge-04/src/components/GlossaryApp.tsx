import { useEffect, useMemo, useState } from 'react';
import { GLOSSARY_TERMS, TERM_MAP } from '../data/glossary';
import { GLOSSARY_CATEGORIES } from '../types/glossary';
import {
  filterTerms,
  getAvailableLetters,
  getFirstLetter,
  groupTermsByCategory,
} from '../utils/search';
import { AlphabetNav } from './AlphabetNav';
import { CategorySection } from './CategorySection';
import { SearchBar } from './SearchBar';
import { TermDetail } from './TermDetail';
import './GlossaryApp.css';

export function GlossaryApp() {
  const [query, setQuery] = useState('');
  const [selectedTermId, setSelectedTermId] = useState<string>(GLOSSARY_TERMS[0].id);
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    () => new Set(GLOSSARY_CATEGORIES),
  );

  const filteredTerms = useMemo(() => filterTerms(GLOSSARY_TERMS, query), [query]);

  const groupedTerms = useMemo(
    () => groupTermsByCategory(filteredTerms),
    [filteredTerms],
  );

  const availableLetters = useMemo(
    () => getAvailableLetters(filteredTerms),
    [filteredTerms],
  );

  const selectedTerm = TERM_MAP[selectedTermId] ?? GLOSSARY_TERMS[0];

  useEffect(() => {
    if (!TERM_MAP[selectedTermId] || !filteredTerms.some((term) => term.id === selectedTermId)) {
      const fallback = filteredTerms[0];
      if (fallback) {
        setSelectedTermId(fallback.id);
      }
    }
  }, [filteredTerms, selectedTermId]);

  function handleSelectTerm(termId: string) {
    setSelectedTermId(termId);
    setActiveLetter(getFirstLetter(TERM_MAP[termId]?.name ?? ''));

    const element = document.getElementById(`term-${termId}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function handleAlphabetJump(letter: string) {
    const target = [...filteredTerms]
      .sort((a, b) => a.name.localeCompare(b.name))
      .find((term) => getFirstLetter(term.name) === letter);

    if (!target) {
      return;
    }

    setActiveLetter(letter);
    setExpandedCategories((current) => new Set(current).add(target.category));
    handleSelectTerm(target.id);
  }

  function toggleCategory(category: string) {
    setExpandedCategories((current) => {
      const next = new Set(current);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  }

  return (
    <div className="glossary-app">
      <header className="glossary-app__hero">
        <p className="glossary-app__eyebrow">Papaya Insurance</p>
        <h1>Insurance Glossary</h1>
        <p className="glossary-app__subtitle">
          Search, browse, and understand {GLOSSARY_TERMS.length} insurance terms across six
          categories. All data is bundled for fast, offline-friendly access.
        </p>
      </header>

      <SearchBar value={query} onChange={setQuery} resultCount={filteredTerms.length} />

      <div className="glossary-app__layout">
        <aside className="glossary-app__alphabet">
          <AlphabetNav
            availableLetters={availableLetters}
            activeLetter={activeLetter}
            onSelect={handleAlphabetJump}
          />
        </aside>

        <div className="glossary-app__browse">
          {filteredTerms.length === 0 ? (
            <div className="glossary-app__empty">
              <h2>No terms found</h2>
              <p>Try a different keyword or clear the search.</p>
            </div>
          ) : (
            GLOSSARY_CATEGORIES.map((category) => (
              <CategorySection
                key={category}
                category={category}
                terms={(groupedTerms[category] ?? []).sort((a, b) =>
                  a.name.localeCompare(b.name),
                )}
                isExpanded={expandedCategories.has(category)}
                selectedTermId={selectedTermId}
                query={query}
                onToggle={toggleCategory}
                onSelectTerm={handleSelectTerm}
              />
            ))
          )}
        </div>

        <aside className="glossary-app__detail">
          {filteredTerms.length > 0 && (
            <TermDetail
              term={selectedTerm}
              query={query}
              onSelectRelated={handleSelectTerm}
            />
          )}
        </aside>
      </div>
    </div>
  );
}
