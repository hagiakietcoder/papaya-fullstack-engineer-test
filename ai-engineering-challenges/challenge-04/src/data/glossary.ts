import type { GlossaryTerm } from '../types/glossary';

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  // General Insurance
  {
    id: 'premium',
    name: 'Premium',
    category: 'General Insurance',
    definition:
      'The amount a policyholder pays to an insurer in exchange for coverage over a specified period. Premiums may be paid monthly, quarterly, or annually depending on the policy terms. The premium amount reflects the level of risk, coverage scope, and actuarial assumptions behind the policy.',
    relatedTerms: ['policyholder', 'underwriting', 'renewal'],
  },
  {
    id: 'policyholder',
    name: 'Policyholder',
    category: 'General Insurance',
    definition:
      'The person or entity that owns an insurance policy and has the contractual right to coverage. The policyholder is responsible for paying premiums and may differ from the insured person or beneficiary. In group policies, the employer is often the policyholder while employees are insured members.',
    relatedTerms: ['premium', 'beneficiary', 'endorsement'],
  },
  {
    id: 'underwriting',
    name: 'Underwriting',
    category: 'General Insurance',
    definition:
      'The process insurers use to evaluate risk and decide whether to offer coverage, at what price, and under what conditions. Underwriters review applications, medical history, claims records, and other data to assess the likelihood of loss. Sound underwriting keeps premiums fair while protecting the insurer\'s financial stability.',
    relatedTerms: ['premium', 'exclusion', 'actuarial'],
  },
  {
    id: 'endorsement',
    name: 'Endorsement',
    category: 'General Insurance',
    definition:
      'A formal amendment to an existing insurance policy that changes its terms, coverage, or conditions. Endorsements can add benefits, increase limits, or introduce new exclusions. They become part of the legal contract once issued and accepted.',
    relatedTerms: ['rider', 'policyholder', 'coverage'],
  },
  {
    id: 'rider',
    name: 'Rider',
    category: 'General Insurance',
    definition:
      'An optional add-on to a base insurance policy that provides additional coverage or benefits for an extra premium. Common riders include critical illness cover, accidental death benefits, or maternity benefits. Riders allow customization without purchasing an entirely separate policy.',
    relatedTerms: ['endorsement', 'premium', 'benefit-schedule'],
  },
  {
    id: 'insurer',
    name: 'Insurer',
    category: 'General Insurance',
    definition:
      'A licensed company that underwrites insurance policies and pays valid claims according to policy terms. Insurers pool risk across many policyholders so that individual losses remain manageable. They must maintain adequate reserves and meet regulatory solvency requirements.',
    relatedTerms: ['policyholder', 'underwriting', 'solvency'],
  },
  {
    id: 'grace-period',
    name: 'Grace Period',
    category: 'General Insurance',
    definition:
      'A short window after a premium due date during which coverage remains active even if payment has not yet been received. Grace periods protect policyholders from accidental lapses caused by late payment. The exact length varies by product and jurisdiction.',
    relatedTerms: ['premium', 'renewal', 'policyholder'],
  },
  {
    id: 'renewal',
    name: 'Renewal',
    category: 'General Insurance',
    definition:
      'The continuation of an insurance policy beyond its original term, usually after review of updated risk and pricing. At renewal, insurers may adjust premiums, limits, or conditions based on claims history and market factors. Policyholders typically receive a renewal notice before the new term begins.',
    relatedTerms: ['premium', 'endorsement', 'grace-period'],
  },

  // Claims
  {
    id: 'claim',
    name: 'Claim',
    category: 'Claims',
    definition:
      'A formal request by a policyholder or insured person for payment or services under an insurance policy. Claims are submitted with supporting documents such as receipts, medical reports, or incident records. The insurer reviews each claim through adjudication before approving or denying payment.',
    relatedTerms: ['adjudication', 'deductible', 'first-notice-of-loss'],
  },
  {
    id: 'deductible',
    name: 'Deductible',
    category: 'Claims',
    definition:
      'The amount the insured must pay out of pocket before the insurer begins covering eligible expenses. Higher deductibles usually mean lower premiums because the policyholder retains more initial risk. Deductibles may apply per claim, per year, or per family depending on the plan.',
    relatedTerms: ['copay', 'coinsurance', 'claim'],
  },
  {
    id: 'copay',
    name: 'Copay',
    category: 'Claims',
    definition:
      'A fixed fee the insured pays at the time of receiving a covered service, such as a doctor visit or prescription. Copays are defined in the policy schedule and do not usually count toward the deductible. They simplify cost-sharing by giving members a predictable amount per service.',
    relatedTerms: ['coinsurance', 'deductible', 'benefit-schedule'],
  },
  {
    id: 'coinsurance',
    name: 'Coinsurance',
    category: 'Claims',
    definition:
      'A cost-sharing arrangement where the insurer and insured each pay a percentage of eligible expenses after the deductible is met. For example, an 80/20 coinsurance split means the insurer pays 80% and the member pays 20%. Coinsurance continues until the annual out-of-pocket maximum is reached, if applicable.',
    relatedTerms: ['copay', 'deductible', 'annual-limit'],
  },
  {
    id: 'adjudication',
    name: 'Adjudication',
    category: 'Claims',
    definition:
      'The systematic review process insurers use to determine whether a claim is valid, covered, and payable under policy terms. Adjudication checks eligibility, benefit limits, coding accuracy, and supporting documentation. Automated and manual steps work together to process claims efficiently and consistently.',
    relatedTerms: ['claim', 'loss-adjuster', 'subrogation'],
  },
  {
    id: 'subrogation',
    name: 'Subrogation',
    category: 'Claims',
    definition:
      'The legal right of an insurer to recover claim payments from a third party who caused the loss. After paying an insured member, the insurer may pursue the responsible party or their insurer to recoup costs. Subrogation helps keep premiums lower by returning funds that would otherwise be lost.',
    relatedTerms: ['claim', 'adjudication', 'loss-adjuster'],
  },
  {
    id: 'loss-adjuster',
    name: 'Loss Adjuster',
    category: 'Claims',
    definition:
      'A professional who investigates insurance claims to verify the cause, extent, and value of a loss. Adjusters may work for the insurer or independently to ensure fair settlement. Their findings support adjudication decisions and help resolve disputes between parties.',
    relatedTerms: ['adjudication', 'claim', 'first-notice-of-loss'],
  },
  {
    id: 'first-notice-of-loss',
    name: 'First Notice of Loss',
    category: 'Claims',
    definition:
      'The initial report to an insurer that a loss or incident has occurred and may result in a claim. Prompt notification allows the insurer to begin investigation, assign adjusters, and guide the claimant on required documents. Delays in reporting can complicate claim processing or affect coverage.',
    relatedTerms: ['claim', 'loss-adjuster', 'adjudication'],
  },

  // Coverage
  {
    id: 'sum-insured',
    name: 'Sum Insured',
    category: 'Coverage',
    definition:
      'The maximum amount an insurer will pay for a covered loss under a policy, as stated in the contract. Sum insured can apply to the entire policy or to specific items such as property or vehicles. Setting the correct sum insured prevents underinsurance and ensures adequate protection.',
    relatedTerms: ['annual-limit', 'sub-limit', 'benefit-schedule'],
  },
  {
    id: 'annual-limit',
    name: 'Annual Limit',
    category: 'Coverage',
    definition:
      'The total maximum benefit an insurer will pay for covered services within a policy year. Once the annual limit is reached, the member pays remaining costs out of pocket until the next renewal period. Health plans often set separate limits for outpatient, inpatient, and dental benefits.',
    relatedTerms: ['sub-limit', 'sum-insured', 'coinsurance'],
  },
  {
    id: 'sub-limit',
    name: 'Sub-limit',
    category: 'Coverage',
    definition:
      'A cap on coverage for a specific benefit or type of expense within a broader policy limit. For example, a health plan may include a sub-limit for physiotherapy or dental care. Sub-limits help insurers manage exposure while still offering comprehensive overall coverage.',
    relatedTerms: ['annual-limit', 'benefit-schedule', 'exclusion'],
  },
  {
    id: 'exclusion',
    name: 'Exclusion',
    category: 'Coverage',
    definition:
      'A condition or circumstance explicitly not covered by an insurance policy. Common exclusions include intentional self-harm, cosmetic procedures, or losses from illegal activities. Clear exclusions prevent misunderstandings and define the boundaries of the insurer\'s obligation to pay.',
    relatedTerms: ['waiting-period', 'pre-existing-condition', 'underwriting'],
  },
  {
    id: 'waiting-period',
    name: 'Waiting Period',
    category: 'Coverage',
    definition:
      'A defined time after a policy starts during which certain benefits are not yet payable. Waiting periods discourage people from buying insurance only when they already need treatment. Maternity, critical illness, and some outpatient benefits commonly include waiting periods.',
    relatedTerms: ['pre-existing-condition', 'exclusion', 'premium'],
  },
  {
    id: 'pre-existing-condition',
    name: 'Pre-existing Condition',
    category: 'Coverage',
    definition:
      'A medical condition, illness, or injury that existed before a policy\'s effective date or during a look-back period. Insurers may exclude, limit, or apply special waiting periods for pre-existing conditions. Disclosure during underwriting helps determine appropriate coverage terms.',
    relatedTerms: ['waiting-period', 'underwriting', 'exclusion'],
  },
  {
    id: 'benefit-schedule',
    name: 'Benefit Schedule',
    category: 'Coverage',
    definition:
      'A detailed table in a policy that lists covered services, payment limits, copays, and other benefit rules. The schedule translates general coverage promises into specific payable amounts. Members and claims teams rely on it during adjudication.',
    relatedTerms: ['copay', 'sub-limit', 'annual-limit'],
  },
  {
    id: 'network-provider',
    name: 'Network Provider',
    category: 'Coverage',
    definition:
      'A hospital, clinic, or healthcare professional that has contracted with an insurer to deliver services at agreed rates. Using network providers usually results in lower out-of-pocket costs and direct billing. Out-of-network care may still be covered but often at reduced benefit levels.',
    relatedTerms: ['copay', 'benefit-schedule', 'claim'],
  },

  // Life & Health
  {
    id: 'beneficiary',
    name: 'Beneficiary',
    category: 'Life & Health',
    definition:
      'The person or entity designated to receive insurance benefits when a covered event occurs, such as death or critical illness. Policyholders can name primary and contingent beneficiaries and update them through endorsements. Clear beneficiary designations prevent disputes during claims settlement.',
    relatedTerms: ['death-benefit', 'policyholder', 'maturity'],
  },
  {
    id: 'maturity',
    name: 'Maturity',
    category: 'Life & Health',
    definition:
      'The date on which a life insurance or savings-linked policy reaches its end term and benefits become payable. At maturity, the policyholder may receive the sum assured plus any accumulated bonuses. Maturity benefits differ from death benefits, which are triggered by the insured\'s passing.',
    relatedTerms: ['surrender-value', 'death-benefit', 'beneficiary'],
  },
  {
    id: 'surrender-value',
    name: 'Surrender Value',
    category: 'Life & Health',
    definition:
      'The amount a policyholder receives when voluntarily canceling a life policy before maturity. Surrender value is typically less than total premiums paid because it reflects the insurer\'s costs and the reduced period of risk coverage. Policies often have a minimum duration before surrender value applies.',
    relatedTerms: ['maturity', 'premium', 'beneficiary'],
  },
  {
    id: 'mortality-table',
    name: 'Mortality Table',
    category: 'Life & Health',
    definition:
      'A statistical table showing the probability of death at each age based on population data. Insurers use mortality tables to price life insurance, calculate reserves, and project long-term liabilities. Tables are updated periodically to reflect improvements in healthcare and longevity.',
    relatedTerms: ['actuarial', 'reserve', 'death-benefit'],
  },
  {
    id: 'actuarial',
    name: 'Actuarial',
    category: 'Life & Health',
    definition:
      'Relating to the mathematical and statistical methods used to assess insurance risk, pricing, and long-term financial obligations. Actuaries analyze mortality, morbidity, and claims trends to ensure premiums are adequate and reserves are sufficient. Actuarial work underpins product design and regulatory reporting.',
    relatedTerms: ['mortality-table', 'reserve', 'underwriting'],
  },
  {
    id: 'death-benefit',
    name: 'Death Benefit',
    category: 'Life & Health',
    definition:
      'The lump sum or income stream paid to beneficiaries when the insured person dies during the coverage period. Death benefit amount is defined at policy issuance and may include riders or bonuses. It is a core feature of life insurance and some health-linked products.',
    relatedTerms: ['beneficiary', 'maturity', 'rider'],
  },
  {
    id: 'critical-illness-benefit',
    name: 'Critical Illness Benefit',
    category: 'Life & Health',
    definition:
      'A lump-sum payment made when the insured is diagnosed with a specified serious illness such as cancer, stroke, or heart attack. This benefit helps cover treatment costs, income loss, and recovery expenses beyond standard medical coverage. Covered conditions are listed explicitly in the policy.',
    relatedTerms: ['rider', 'hospitalization', 'benefit-schedule'],
  },
  {
    id: 'hospitalization',
    name: 'Hospitalization',
    category: 'Life & Health',
    definition:
      'Inpatient medical care requiring admission to a hospital for at least one night. Health policies typically distinguish hospitalization benefits from outpatient visits, with separate limits and copays. Coverage may include room charges, surgery, and related inpatient services.',
    relatedTerms: ['annual-limit', 'network-provider', 'claim'],
  },

  // Reinsurance
  {
    id: 'ceding-company',
    name: 'Ceding Company',
    category: 'Reinsurance',
    definition:
      'The primary insurer that transfers a portion of its risk to a reinsurer in exchange for premium sharing. The ceding company remains responsible to policyholders but reduces its exposure to large or accumulated losses. Reinsurance allows insurers to underwrite larger policies than their capital alone would support.',
    relatedTerms: ['reinsurer', 'treaty', 'facultative'],
  },
  {
    id: 'retrocession',
    name: 'Retrocession',
    category: 'Reinsurance',
    definition:
      'Reinsurance purchased by a reinsurer to further spread risk it has assumed from primary insurers. Retrocession protects reinsurers from catastrophic accumulations and helps stabilize their own balance sheets. It operates on the same principles as primary reinsurance but one level removed.',
    relatedTerms: ['reinsurer', 'treaty', 'ceding-company'],
  },
  {
    id: 'treaty',
    name: 'Treaty',
    category: 'Reinsurance',
    definition:
      'A standing reinsurance agreement covering a defined portfolio of policies over a set period, rather than individual risks. Treaty reinsurance automatically cedes eligible business according to pre-agreed terms. It provides predictable capacity and simplifies administration for both parties.',
    relatedTerms: ['facultative', 'ceding-company', 'quota-share'],
  },
  {
    id: 'facultative',
    name: 'Facultative',
    category: 'Reinsurance',
    definition:
      'Reinsurance arranged for a single risk or policy on a case-by-case basis, with terms negotiated separately each time. Facultative cover is used for unusually large or non-standard risks that fall outside treaty arrangements. Both ceding insurer and reinsurer must agree before coverage takes effect.',
    relatedTerms: ['treaty', 'ceding-company', 'underwriting'],
  },
  {
    id: 'loss-ratio',
    name: 'Loss Ratio',
    category: 'Reinsurance',
    definition:
      'The ratio of claims paid to premiums earned, expressed as a percentage, used to measure underwriting performance. A loss ratio above 100% means claims exceeded premiums for that period. Insurers and reinsurers monitor loss ratios to adjust pricing, reserves, and reinsurance structures.',
    relatedTerms: ['claim', 'premium', 'ibnr'],
  },
  {
    id: 'reinsurer',
    name: 'Reinsurer',
    category: 'Reinsurance',
    definition:
      'A specialized insurance company that assumes portions of risk ceded by primary insurers. Reinsurers provide capacity, expertise, and capital relief for large or complex exposures. Major global reinsurers play a critical role in stabilizing the insurance market after major catastrophes.',
    relatedTerms: ['ceding-company', 'treaty', 'retrocession'],
  },
  {
    id: 'quota-share',
    name: 'Quota Share',
    category: 'Reinsurance',
    definition:
      'A proportional reinsurance treaty where the reinsurer accepts a fixed percentage of every eligible policy\'s premium and losses. For example, a 40% quota share means the reinsurer takes 40% of premiums and pays 40% of claims. It is a straightforward way to share risk and grow portfolio capacity.',
    relatedTerms: ['treaty', 'ceding-company', 'loss-ratio'],
  },

  // Regulatory
  {
    id: 'solvency',
    name: 'Solvency',
    category: 'Regulatory',
    definition:
      'An insurer\'s ability to meet its long-term financial obligations to policyholders and regulators. Solvency is measured by comparing available capital to required capital based on risk exposure. Regulators intervene when solvency margins fall below safe thresholds to protect consumers.',
    relatedTerms: ['reserve', 'risk-based-capital', 'insurer'],
  },
  {
    id: 'reserve',
    name: 'Reserve',
    category: 'Regulatory',
    definition:
      'Funds set aside by an insurer to pay future claims, benefits, and expenses. Reserves are calculated using actuarial methods and must meet statutory standards. Adequate reserving ensures the company can honor policies even during periods of unusually high claims.',
    relatedTerms: ['ibnr', 'actuarial', 'solvency'],
  },
  {
    id: 'ibnr',
    name: 'IBNR',
    category: 'Regulatory',
    definition:
      'Incurred But Not Reported — an estimate of claims that have occurred but have not yet been filed with the insurer. IBNR reserves are essential for accurate financial reporting because reporting delays are common in health and liability lines. Actuaries project IBNR using historical reporting patterns.',
    relatedTerms: ['reserve', 'loss-ratio', 'statutory-reporting'],
  },
  {
    id: 'statutory-reporting',
    name: 'Statutory Reporting',
    category: 'Regulatory',
    definition:
      'The standardized financial and operational reports insurers must file with regulatory authorities. These reports disclose premium income, reserves, solvency margins, and claims experience. Statutory reporting ensures transparency and enables supervisors to monitor market stability.',
    relatedTerms: ['compliance', 'solvency', 'reserve'],
  },
  {
    id: 'compliance',
    name: 'Compliance',
    category: 'Regulatory',
    definition:
      'The policies, processes, and controls that ensure an insurer operates within laws, regulations, and internal standards. Compliance covers licensing, consumer protection, data privacy, and anti-fraud requirements. Strong compliance programs reduce regulatory penalties and protect policyholder trust.',
    relatedTerms: ['statutory-reporting', 'audit-trail', 'solvency'],
  },
  {
    id: 'risk-based-capital',
    name: 'Risk-Based Capital',
    category: 'Regulatory',
    definition:
      'A regulatory framework that sets minimum capital requirements based on the size and type of risks an insurer carries. Higher-risk portfolios require more capital to maintain a safety buffer. Risk-based capital ratios help regulators identify companies that need corrective action early.',
    relatedTerms: ['solvency', 'reserve', 'compliance'],
  },
  {
    id: 'audit-trail',
    name: 'Audit Trail',
    category: 'Regulatory',
    definition:
      'A chronological record of system actions, policy changes, and claim decisions that supports accountability and regulatory review. Audit trails help investigators trace who changed data, when, and why. They are critical for fraud detection, compliance audits, and dispute resolution.',
    relatedTerms: ['compliance', 'adjudication', 'statutory-reporting'],
  },
];

export const TERM_MAP = Object.fromEntries(GLOSSARY_TERMS.map((term) => [term.id, term])) as Record<
  string,
  GlossaryTerm
>;
