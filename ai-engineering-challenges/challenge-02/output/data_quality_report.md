# Claims Data Quality Report

## Overview

- Total rows before cleaning: **500**
- Exact duplicate rows removed: **12**
- Total rows after cleaning: **477**
- Rows removed during validation: **11**

## Issues Found In Source Data

| Issue Type | Rows Affected |
|------------|---------------|
| Exact duplicate rows | 12 |
| Missing claim_id | 1 |
| Duplicate claim_id values | 9 |
| Missing policy_id | 15 |
| Inconsistent member_name casing | 11 |
| claim_type typos or aliases | 12 |
| Empty / N/A diagnosis | 11 |
| Invalid submitted_amount (negative, zero, unparsable) | 10 |
| Non-standard currency codes | 7 |
| Non-ISO submitted_date formats | 20 |
| Unparseable submitted_date | 0 |
| Non-standard status values | 8 |

## Rows Removed During Cleaning

| Reason | Count |
|--------|-------|
| Rows removed due to invalid amount after cleaning | 10 |
| Rows removed due to missing claim_id after cleaning | 1 |

## Summary Statistics (Clean Data)

### Total Claims by Type

| Claim Type | Count |
|------------|-------|
| DENTAL | 125 |
| INPATIENT | 120 |
| MATERNITY | 125 |
| OUTPATIENT | 107 |

### Total Claims by Status

| Status | Count |
|--------|-------|
| APPROVED | 116 |
| IN_REVIEW | 130 |
| PENDING | 121 |
| REJECTED | 110 |

### Average Submitted Amount by Type

| Claim Type | Average Amount |
|------------|----------------|
| DENTAL | 124,042.13 |
| INPATIENT | 123,097.43 |
| MATERNITY | 114,341.00 |
| OUTPATIENT | 129,836.73 |

### Top 5 Most Common Diagnoses

| Rank | Diagnosis | Count |
|------|-----------|-------|
| 1 | Knee Injury | 42 |
| 2 | Fracture | 40 |
| 3 | Skin Rash | 37 |
| 4 | Asthma | 36 |
| 5 | Dental Checkup | 34 |

## Cleaning Rules Applied

- Removed exact duplicate rows before field normalization
- Normalized member names to title case
- Mapped claim type aliases and typos to canonical values
- Parsed all supported date formats into ISO 8601 (`YYYY-MM-DD`)
- Removed rows with missing `claim_id` or invalid `submitted_amount` (zero/negative/unparsable)
- Standardized currency codes to uppercase ISO values (`THB`, `VND`)
- Replaced `N/A`, `n/a`, and empty strings with a blank null marker
- Standardized status values to uppercase canonical values
