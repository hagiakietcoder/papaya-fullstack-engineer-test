import { useEffect, useId, useRef, useState } from 'react';
import type { Dependent } from '../types/claim';
import './DependentDropdown.css';

interface DependentDropdownProps {
  dependents: Dependent[];
  value: string | null;
  onChange: (dependentId: string) => void;
  error?: string;
}

export function DependentDropdown({
  dependents,
  value,
  onChange,
  error,
}: DependentDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = dependents.find((item) => item.id === value);
  const selectedIndex = dependents.findIndex((item) => item.id === value);

  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0);
    }
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  function selectOption(dependent: Dependent) {
    onChange(dependent.id);
    setIsOpen(false);
  }

  return (
    <div className="dependent-dropdown" ref={containerRef}>
      <label className="field-label" htmlFor={`${listboxId}-trigger`}>
        Select dependent
      </label>

      <button
        id={`${listboxId}-trigger`}
        type="button"
        className={`dropdown-trigger ${error ? 'has-error' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            setIsOpen((open) => !open);
          }
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setIsOpen(true);
            setHighlightedIndex((index) => Math.min(index + 1, dependents.length - 1));
          }
          if (event.key === 'ArrowUp') {
            event.preventDefault();
            setIsOpen(true);
            setHighlightedIndex((index) => Math.max(index - 1, 0));
          }
        }}
      >
        <span className="dropdown-value">
          {selected ? `${selected.name} (${selected.relationship})` : 'Choose a dependent'}
        </span>
        <span className="dropdown-chevron" aria-hidden="true">
          ▾
        </span>
      </button>

      {isOpen && (
        <ul id={listboxId} className="dropdown-menu" role="listbox">
          {dependents.map((dependent, index) => (
            <li key={dependent.id} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={dependent.id === value}
                className={`dropdown-option ${index === highlightedIndex ? 'highlighted' : ''}`}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectOption(dependent)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    selectOption(dependent);
                  }
                }}
              >
                <span className="option-name">{dependent.name}</span>
                <span className="option-meta">
                  {dependent.relationship} · DOB {dependent.dateOfBirth}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
