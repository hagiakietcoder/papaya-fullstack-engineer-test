import { ALPHABET } from '../types/glossary';
import './AlphabetNav.css';

interface AlphabetNavProps {
  availableLetters: Set<string>;
  activeLetter: string | null;
  onSelect: (letter: string) => void;
}

export function AlphabetNav({ availableLetters, activeLetter, onSelect }: AlphabetNavProps) {
  return (
    <nav className="alphabet-nav" aria-label="Jump to letter">
      <span className="alphabet-nav__title">A–Z</span>
      <ul className="alphabet-nav__list">
        {ALPHABET.map((letter) => {
          const isAvailable = availableLetters.has(letter);
          const isActive = activeLetter === letter;

          return (
            <li key={letter}>
              <button
                type="button"
                className={`alphabet-nav__btn${
                  isActive ? ' alphabet-nav__btn--active' : ''
                }${!isAvailable ? ' alphabet-nav__btn--disabled' : ''}`}
                disabled={!isAvailable}
                onClick={() => onSelect(letter)}
                aria-label={`Jump to terms starting with ${letter}`}
              >
                {letter}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
