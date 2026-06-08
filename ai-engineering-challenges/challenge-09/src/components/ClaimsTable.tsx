import { useMemo, useState } from 'react';
import type { Claim } from '../types/claim';
import { downloadCsv } from '../utils/exportCsv';
import { formatCurrency } from '../utils/analytics';
import './ClaimsTable.css';

type SortKey = keyof Claim;
type SortDir = 'asc' | 'desc';

const PAGE_SIZE = 15;

const COLUMNS: Array<{ key: SortKey; label: string; align?: 'right' }> = [
  { key: 'claim_id', label: 'Claim ID' },
  { key: 'member_name', label: 'Member' },
  { key: 'claim_type', label: 'Type' },
  { key: 'diagnosis_icd10', label: 'ICD-10' },
  { key: 'submitted_amount', label: 'Submitted', align: 'right' },
  { key: 'approved_amount', label: 'Approved', align: 'right' },
  { key: 'status', label: 'Status' },
  { key: 'submitted_date', label: 'Submitted Date' },
  { key: 'insurer', label: 'Insurer' },
  { key: 'country', label: 'Country' },
];

interface ClaimsTableProps {
  claims: Claim[];
}

export function ClaimsTable({ claims }: ClaimsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('submitted_date');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [page, setPage] = useState(1);

  const sorted = useMemo(() => {
    const copy = [...claims];
    copy.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (aVal === bVal) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;

      const cmp = aVal < bVal ? -1 : 1;
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return copy;
  }, [claims, sortKey, sortDir]);

  const totalPages = Math.max(Math.ceil(sorted.length / PAGE_SIZE), 1);
  const currentPage = Math.min(page, totalPages);
  const pageRows = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
    setPage(1);
  }

  function formatCell(claim: Claim, key: SortKey): string {
    const value = claim[key];
    if (key === 'submitted_amount' || key === 'approved_amount') {
      return formatCurrency(Number(value));
    }
    return value === null ? '—' : String(value);
  }

  return (
    <section className="claims-table-section">
      <div className="table-header">
        <div>
          <h2>Claims Detail</h2>
          <p>{claims.length.toLocaleString()} claims matching filters</p>
        </div>
        <button type="button" className="export-btn" onClick={() => downloadCsv(claims)}>
          Export CSV
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              {COLUMNS.map((col) => (
                <th key={col.key} className={col.align === 'right' ? 'align-right' : ''}>
                  <button type="button" onClick={() => toggleSort(col.key)}>
                    {col.label}
                    {sortKey === col.key ? (sortDir === 'asc' ? ' ↑' : ' ↓') : ''}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((claim) => (
              <tr key={claim.claim_id}>
                {COLUMNS.map((col) => (
                  <td key={col.key} className={col.align === 'right' ? 'align-right' : ''}>
                    {col.key === 'status' ? (
                      <span className={`status-pill status-${claim.status.toLowerCase()}`}>
                        {claim.status}
                      </span>
                    ) : (
                      formatCell(claim, col.key)
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <button
          type="button"
          disabled={currentPage <= 1}
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          type="button"
          disabled={currentPage >= totalPages}
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        >
          Next
        </button>
      </div>
    </section>
  );
}
