import { useState } from 'react';
import { POLICY_OPTIONS } from '../data/policies';
import { PolicySelectDropdown } from './PolicySelectDropdown';
import { PolicySummary } from './PolicySummary';
import './PolicySummaryApp.css';

export function PolicySummaryApp() {
  const [selectedPolicyId, setSelectedPolicyId] = useState(POLICY_OPTIONS[0].id);
  const selected = POLICY_OPTIONS.find((option) => option.id === selectedPolicyId)!;

  return (
    <div className="policy-app">
      <div className="policy-app__toolbar">
        <PolicySelectDropdown
          options={POLICY_OPTIONS}
          value={selectedPolicyId}
          onChange={setSelectedPolicyId}
        />
        <p className="policy-app__hint">
          Switch between policies to see the generator adapt to different benefit structures.
        </p>
      </div>

      <PolicySummary policy={selected.policy} />
    </div>
  );
}
