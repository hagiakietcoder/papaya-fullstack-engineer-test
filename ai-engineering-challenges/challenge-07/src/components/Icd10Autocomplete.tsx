import { useEffect, useId, useRef, useState } from 'react';
import { searchIcd10Codes } from '../data/icd10Codes';
import type { Icd10Code } from '../types/claim';
import './Icd10Autocomplete.css';

interface Icd10AutocompleteProps {
  code: string;
  description: string;
  onSelect: (item: Icd10Code) => void;
  onClear: () => void;
  error?: string;
}

export function Icd10Autocomplete({
  code,
  description,
  onSelect,
  onClear,
  error,
}: Icd10AutocompleteProps) {
  const [query, setQuery] = useState(code ? `${code} — ${description}` : '');
  const [results, setResults] = useState<Icd10Code[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    if (code && description) {
      setQuery(`${code} — ${description}`);
    }
  }, [code, description]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    const matches = searchIcd10Codes(value);
    setResults(matches);
    setIsOpen(matches.length > 0);
    setHighlightedIndex(0);

    if (!value.trim()) {
      onClear();
    }
  }

  function selectItem(item: Icd10Code) {
    onSelect(item);
    setQuery(`${item.code} — ${item.description}`);
    setIsOpen(false);
    setResults([]);
  }

  return (
    <div className="icd10-autocomplete" ref={containerRef}>
      <label className="field-label" htmlFor={`${listboxId}-input`}>
        ICD-10 code
      </label>

      <input
        id={`${listboxId}-input`}
        type="text"
        className={`field-input ${error ? 'has-error' : ''}`}
        value={query}
        placeholder="Search by code or description (e.g. J20.9 bronchitis)"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-autocomplete="list"
        onChange={(event) => handleInputChange(event.target.value)}
        onFocus={() => {
          if (query.trim()) {
            const matches = searchIcd10Codes(query);
            setResults(matches);
            setIsOpen(matches.length > 0);
          }
        }}
        onKeyDown={(event) => {
          if (!isOpen || results.length === 0) {
            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setHighlightedIndex((index) => Math.min(index + 1, results.length - 1));
          }

          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setHighlightedIndex((index) => Math.max(index - 1, 0));
          }

          if (event.key === 'Enter') {
            event.preventDefault();
            selectItem(results[highlightedIndex]);
          }

          if (event.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      />

      {isOpen && results.length > 0 && (
        <ul id={listboxId} className="icd10-results" role="listbox">
          {results.map((item, index) => (
            <li key={item.code} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === highlightedIndex}
                className={`icd10-option ${index === highlightedIndex ? 'highlighted' : ''}`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectItem(item)}
              >
                <span className="icd10-code">{item.code}</span>
                <span className="icd10-desc">{item.description}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="field-error">{error}</p>}
      <p className="field-hint">Search across 120+ common ICD-10 codes</p>
    </div>
  );
}
