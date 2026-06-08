import { useEffect, useId, useRef, useState } from 'react';
import type { EmailTemplate, EventType } from '../types/template';
import './EventTypeDropdown.css';

interface EventTypeDropdownProps {
  templates: EmailTemplate[];
  value: EventType;
  descriptions: Record<EventType, string>;
  onChange: (value: EventType) => void;
}

export function EventTypeDropdown({
  templates,
  value,
  descriptions,
  onChange,
}: EventTypeDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selectedTemplate = templates.find((item) => item.id === value)!;
  const selectedIndex = templates.findIndex((item) => item.id === value);

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

  function selectOption(template: EmailTemplate) {
    onChange(template.id);
    setIsOpen(false);
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen((open) => !open);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((index) => Math.min(index + 1, templates.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    }
  }

  function handleOptionKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    template: EmailTemplate,
    index: number,
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(template);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex(Math.min(index + 1, templates.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(Math.max(index - 1, 0));
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setHighlightedIndex(0);
    }

    if (event.key === 'End') {
      event.preventDefault();
      setHighlightedIndex(templates.length - 1);
    }
  }

  return (
    <div className="event-dropdown" ref={containerRef}>
      <span className="event-dropdown__label" id={`${listboxId}-label`}>
        Event type
      </span>

      <button
        type="button"
        className={`event-dropdown__trigger${isOpen ? ' event-dropdown__trigger--open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${listboxId}-label`}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="event-dropdown__trigger-content">
          <span className="event-dropdown__title-row">
            <span
              className="event-dropdown__accent"
              style={{ backgroundColor: selectedTemplate.accentColor }}
              aria-hidden="true"
            />
            <span className="event-dropdown__trigger-label">{selectedTemplate.label}</span>
          </span>
          <span className="event-dropdown__trigger-hint">{descriptions[value]}</span>
        </span>
        <svg
          className={`event-dropdown__chevron${isOpen ? ' event-dropdown__chevron--open' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          className="event-dropdown__menu"
          role="listbox"
          aria-labelledby={`${listboxId}-label`}
        >
          {templates.map((template, index) => {
            const isSelected = template.id === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li key={template.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`event-dropdown__option${
                    isSelected ? ' event-dropdown__option--selected' : ''
                  }${isHighlighted ? ' event-dropdown__option--highlighted' : ''}`}
                  onClick={() => selectOption(template)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onKeyDown={(event) => handleOptionKeyDown(event, template, index)}
                >
                  <span className="event-dropdown__option-content">
                    <span className="event-dropdown__title-row">
                      <span
                        className="event-dropdown__accent"
                        style={{ backgroundColor: template.accentColor }}
                        aria-hidden="true"
                      />
                      <span className="event-dropdown__option-label">{template.label}</span>
                    </span>
                    <span className="event-dropdown__option-desc">
                      {descriptions[template.id]}
                    </span>
                  </span>
                  {isSelected && (
                    <svg className="event-dropdown__check" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
