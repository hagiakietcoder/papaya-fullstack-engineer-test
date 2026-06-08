import type { ReactNode } from 'react';
import { escapeRegExp } from './search';

export function highlightText(text: string, query: string): ReactNode {
  if (!query.trim()) {
    return text;
  }

  const regex = new RegExp(`(${escapeRegExp(query.trim())})`, 'gi');
  const parts = text.split(regex);

  return parts.map((part, index) =>
    index % 2 === 1 ? (
      <mark key={`${part}-${index}`} className="highlight">
        {part}
      </mark>
    ) : (
      part
    ),
  );
}
