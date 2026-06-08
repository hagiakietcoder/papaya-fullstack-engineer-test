import corporateHealthPlus from './corporate-health-plus.json';
import familyCareSilver from './family-care-silver.json';
import type { Policy } from '../../types/policy';

export interface PolicyOption {
  id: string;
  label: string;
  policy: Policy;
}

export const POLICY_OPTIONS: PolicyOption[] = [
  {
    id: 'corporate-health-plus',
    label: 'Corporate Health Plus (Gold)',
    policy: corporateHealthPlus as Policy,
  },
  {
    id: 'family-care-silver',
    label: 'Family Care Silver (Individual)',
    policy: familyCareSilver as Policy,
  },
];

export function getPolicyById(id: string): Policy {
  return POLICY_OPTIONS.find((option) => option.id === id)?.policy ?? POLICY_OPTIONS[0].policy;
}
