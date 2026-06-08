import { useEffect, useId, useRef, useState } from 'react';
import { providerSuggestions } from '../data/providers';
import './ProviderAutocomplete.css';

interface ProviderAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function ProviderAutocomplete({ value, onChange, error }: ProviderAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [results, setResults] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function filterProviders(input: string) {
    const normalized = input.trim().toLowerCase();
    if (!normalized) {
      return [];
    }

    return providerSuggestions
      .filter((item) => item.toLowerCase().includes(normalized))
      .slice(0, 8);
  }

  function handleInputChange(next: string) {
    setQuery(next);
    onChange(next);
    const matches = filterProviders(next);
    setResults(matches);
    setIsOpen(matches.length > 0);
    setHighlightedIndex(0);
  }

  function selectProvider(name: string) {
    setQuery(name);
    onChange(name);
    setIsOpen(false);
    setResults([]);
  }

  return (
    <div className="provider-autocomplete" ref={containerRef}>
      <label className="field-label" htmlFor={`${listboxId}-input`}>
        Provider / hospital name
      </label>

      <input
        id={`${listboxId}-input`}
        type="text"
        className={`field-input ${error ? 'has-error' : ''}`}
        value={query}
        placeholder="Start typing hospital or clinic name"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onChange={(event) => handleInputChange(event.target.value)}
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

          if (event.key === 'Enter' && results[highlightedIndex]) {
            event.preventDefault();
            selectProvider(results[highlightedIndex]);
          }

          if (event.key === 'Escape') {
            setIsOpen(false);
          }
        }}
      />

      {isOpen && results.length > 0 && (
        <ul id={listboxId} className="provider-results" role="listbox">
          {results.map((name, index) => (
            <li key={name} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={index === highlightedIndex}
                className={`provider-option ${index === highlightedIndex ? 'highlighted' : ''}`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectProvider(name)}
              >
                {name}
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
