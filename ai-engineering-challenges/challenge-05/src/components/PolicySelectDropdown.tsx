import { useEffect, useId, useRef, useState } from 'react';
import type { PolicyOption } from '../data/policies';
import './PolicySelectDropdown.css';

const TIER_COLORS: Record<string, string> = {
  Gold: '#d97706',
  Silver: '#64748b',
  Bronze: '#b45309',
  Platinum: '#2563eb',
};

function getTierColor(tier: string): string {
  return TIER_COLORS[tier] ?? '#2563eb';
}

function getPolicyDescription(option: PolicyOption): string {
  const { policy } = option;
  const holder =
    policy.policyholder.type === 'CORPORATE'
      ? `${policy.policyholder.name} · ${policy.members.total} members`
      : `${policy.policyholder.name} · ${policy.members.total} members`;
  return `${holder} · ${policy.benefits.length} benefit categories`;
}

interface PolicySelectDropdownProps {
  options: PolicyOption[];
  value: string;
  onChange: (value: string) => void;
}

export function PolicySelectDropdown({ options, value, onChange }: PolicySelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = options.find((option) => option.id === value)!;
  const selectedIndex = options.findIndex((option) => option.id === value);
  const selectedColor = getTierColor(selected.policy.plan.tier);

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

  function selectOption(option: PolicyOption) {
    onChange(option.id);
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
      setHighlightedIndex((index) => Math.min(index + 1, options.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((index) => Math.max(index - 1, 0));
    }
  }

  function handleOptionKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    option: PolicyOption,
    index: number,
  ) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectOption(option);
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex(Math.min(index + 1, options.length - 1));
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex(Math.max(index - 1, 0));
    }
  }

  return (
    <div className="policy-dropdown" ref={containerRef}>
      <span className="policy-dropdown__label" id={`${listboxId}-label`}>
        Select policy
      </span>

      <button
        type="button"
        className={`policy-dropdown__trigger${isOpen ? ' policy-dropdown__trigger--open' : ''}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-labelledby={`${listboxId}-label`}
        onClick={() => setIsOpen((open) => !open)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className="policy-dropdown__title-row">
          <span
            className="policy-dropdown__tier-dot"
            style={{ backgroundColor: selectedColor }}
            aria-hidden="true"
          />
          <span className="policy-dropdown__trigger-text">
            <span className="policy-dropdown__trigger-label">{selected.label}</span>
            <span className="policy-dropdown__trigger-hint">{getPolicyDescription(selected)}</span>
          </span>
        </span>
        <span className="policy-dropdown__tier-badge" style={{ color: selectedColor }}>
          {selected.policy.plan.tier}
        </span>
        <svg
          className={`policy-dropdown__chevron${isOpen ? ' policy-dropdown__chevron--open' : ''}`}
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
          className="policy-dropdown__menu"
          role="listbox"
          aria-labelledby={`${listboxId}-label`}
        >
          {options.map((option, index) => {
            const isSelected = option.id === value;
            const isHighlighted = index === highlightedIndex;
            const tierColor = getTierColor(option.policy.plan.tier);

            return (
              <li key={option.id} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`policy-dropdown__option${
                    isSelected ? ' policy-dropdown__option--selected' : ''
                  }${isHighlighted ? ' policy-dropdown__option--highlighted' : ''}`}
                  onClick={() => selectOption(option)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  onKeyDown={(event) => handleOptionKeyDown(event, option, index)}
                >
                  <span className="policy-dropdown__title-row">
                    <span
                      className="policy-dropdown__tier-dot"
                      style={{ backgroundColor: tierColor }}
                      aria-hidden="true"
                    />
                    <span className="policy-dropdown__option-text">
                      <span className="policy-dropdown__option-label">{option.label}</span>
                      <span className="policy-dropdown__option-desc">
                        {getPolicyDescription(option)}
                      </span>
                    </span>
                  </span>
                  <span className="policy-dropdown__option-tier" style={{ color: tierColor }}>
                    {option.policy.plan.tier}
                  </span>
                  {isSelected && (
                    <svg className="policy-dropdown__check" viewBox="0 0 20 20" fill="currentColor">
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
