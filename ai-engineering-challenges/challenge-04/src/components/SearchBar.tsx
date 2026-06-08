import './SearchBar.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
}

export function SearchBar({ value, onChange, resultCount }: SearchBarProps) {
  return (
    <div className="search-bar">
      <label className="search-bar__label" htmlFor="glossary-search">
        Search glossary
      </label>
      <div className="search-bar__input-wrap">
        <svg className="search-bar__icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
        <input
          id="glossary-search"
          type="search"
          className="search-bar__input"
          placeholder="Search terms or definitions..."
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="search-bar__clear"
            onClick={() => onChange('')}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </div>
      <p className="search-bar__meta">
        {value ? (
          <>
            <strong>{resultCount}</strong> {resultCount === 1 ? 'result' : 'results'} found
          </>
        ) : (
          'Type to search across term names and definitions'
        )}
      </p>
    </div>
  );
}
