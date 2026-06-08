import { useEffect, useState } from 'react';
import { ClaimsDashboard } from './components/ClaimsDashboard';
import type { Claim } from './types/claim';
import { parseClaimsCsv } from './utils/parseClaims';
import './App.css';

function App() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/data/claims.csv')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load claims dataset');
        }
        return response.text();
      })
      .then((csv) => {
        setClaims(parseClaimsCsv(csv));
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <main className="app">
        <div className="loading-state">Loading claims data…</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="app">
        <div className="error-state">{error}</div>
      </main>
    );
  }

  return (
    <main className="app">
      <ClaimsDashboard claims={claims} />
    </main>
  );
}

export default App;
