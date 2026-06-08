import type { MemberProfile } from '../types/claim';

export const mockMember: MemberProfile = {
  memberName: 'Somchai Prasert',
  policyNumber: 'POL-2024-88421',
  memberId: 'MEM-102938',
  dateOfBirth: '1985-06-12',
  dependents: [
    {
      id: 'DEP-001',
      name: 'Naree Prasert',
      relationship: 'Spouse',
      dateOfBirth: '1987-03-22',
    },
    {
      id: 'DEP-002',
      name: 'Pimchanok Prasert',
      relationship: 'Child',
      dateOfBirth: '2015-11-08',
    },
    {
      id: 'DEP-003',
      name: 'Thanawat Prasert',
      relationship: 'Child',
      dateOfBirth: '2018-07-30',
    },
  ],
};
