import { useState } from 'react';
import { POLICY_OPTIONS } from '../data/policies';
import { PolicySummary } from './PolicySummary';
import './PolicySummaryApp.css';

export function PolicySummaryApp() {
  const [selectedPolicyId, setSelectedPolicyId] = useState(POLICY_OPTIONS[0].id);
  const selected = POLICY_OPTIONS.find((option) => option.id === selectedPolicyId)!;

  return (
    <div className="policy-app">
      <div className="policy-app__toolbar">
        <label className="policy-app__label" htmlFor="policy-select">
          Select policy
        </label>
        <select
          id="policy-select"
          className="policy-app__select"
          value={selectedPolicyId}
          onChange={(event) => setSelectedPolicyId(event.target.value)}
        >
          {POLICY_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <p className="policy-app__hint">
          Switch between policies to see the generator adapt to different benefit structures.
        </p>
      </div>

      <PolicySummary policy={selected.policy} />
    </div>
  );
}
