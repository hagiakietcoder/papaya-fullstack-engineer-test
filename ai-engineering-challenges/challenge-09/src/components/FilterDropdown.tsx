import { useEffect, useId, useRef, useState } from 'react';
import './FilterDropdown.css';

interface FilterDropdownProps<T extends string> {
  label: string;
  options: T[];
  selected: T[];
  onChange: (values: T[]) => void;
  formatLabel?: (value: T) => string;
}

export function FilterDropdown<T extends string>({
  label,
  options,
  selected,
  onChange,
  formatLabel = (value) => value,
}: FilterDropdownProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function toggleOption(value: T) {
    if (selected.includes(value)) {
      onChange(selected.filter((item) => item !== value));
    } else {
      onChange([...selected, value]);
    }
  }

  const displayText =
    selected.length === 0
      ? 'All'
      : selected.length === 1
        ? formatLabel(selected[0])
        : `${selected.length} selected`;

  return (
    <div className="filter-dropdown" ref={containerRef}>
      <span className="filter-label">{label}</span>
      <button
        type="button"
        className="filter-trigger"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        onClick={() => setIsOpen((open) => !open)}
      >
        <span>{displayText}</span>
        <span aria-hidden="true">▾</span>
      </button>

      {isOpen && (
        <ul id={listboxId} className="filter-menu" role="listbox">
          <li role="presentation">
            <button
              type="button"
              className={`filter-option ${selected.length === 0 ? 'active' : ''}`}
              onClick={() => onChange([])}
            >
              All
            </button>
          </li>
          {options.map((option) => (
            <li key={option} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={selected.includes(option)}
                className={`filter-option ${selected.includes(option) ? 'active' : ''}`}
                onClick={() => toggleOption(option)}
              >
                <span className="filter-check">{selected.includes(option) ? '✓' : ''}</span>
                {formatLabel(option)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
