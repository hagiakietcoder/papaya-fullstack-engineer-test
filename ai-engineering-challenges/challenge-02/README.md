# Challenge 02 — Claims Data Cleanup & Report

**Difficulty:** Beginner · **Estimated time:** 2–3 hours  
**Status:** ✅ Completed

## Overview

Python scripts that generate a messy CSV of 500 insurance claims, clean the data, and produce a data quality report with summary statistics.

## Outputs

| File | Description |
|------|-------------|
| [`data/claims_dirty.csv`](./data/claims_dirty.csv) | Generated source data with intentional quality issues (~18% affected rows) |
| [`output/claims_clean.csv`](./output/claims_clean.csv) | Cleaned, normalized CSV |
| [`output/data_quality_report.md`](./output/data_quality_report.md) | Data quality report |

## Run

Requires **Python 3.10+** (stdlib only — no pip dependencies).

### Quick start (recommended)

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-02
python run.py
```

Hoặc từ thư mục gốc repo:

```bash
cd ai-engineering-challenges/challenge-02
python run.py
```

### Run step by step

```powershell
cd d:\hgk\papaya-fullstack-engineer-test\ai-engineering-challenges\challenge-02\scripts
python generate_dirty_data.py
python clean_claims.py
```

### Expected output

```
Generated 500 dirty claim rows -> ...\data\claims_dirty.csv
Clean CSV written -> ...\output\claims_clean.csv (477 rows)
Report written -> ...\output\data_quality_report.md
```

### Verify results

| File | Mô tả |
|------|--------|
| `data/claims_dirty.csv` | Input — 500 rows có lỗi |
| `output/claims_clean.csv` | Output — rows đã chuẩn hoá |
| `output/data_quality_report.md` | Báo cáo thống kê & issues |

Mở báo cáo: [`output/data_quality_report.md`](./output/data_quality_report.md)

### Troubleshooting

| Lỗi | Cách xử lý |
|-----|------------|
| `python` not found | Cài [Python 3](https://www.python.org/downloads/) và tick **Add to PATH** |
| `Input file not found` | Chạy `generate_dirty_data.py` trước, hoặc dùng `python run.py` |
| Module import error | Chạy từ `challenge-02/` bằng `python run.py`, không chạy trực tiếp file trong `scripts/` |

## Cleaning Rules

1. Remove exact duplicate rows
2. Normalize `member_name` to title case
3. Fix `claim_type` typos/aliases (`Outpateint`, `OP`, … → `OUTPATIENT`)
4. Parse dates (`YYYY-MM-DD`, `DD/MM/YYYY`, `March 15, 2024`) → ISO 8601
5. Remove rows with missing `claim_id` or invalid `submitted_amount` (≤ 0, unparsable)
6. Standardize currency (`thb`, `Baht` → `THB`; `vnd` → `VND`)
7. Replace `N/A`, `n/a`, empty strings with blank null marker
8. Standardize status to uppercase canonical values

## Project Structure

```
challenge-02/
├── run.py                         # Full pipeline entry point
├── data/claims_dirty.csv          # Generated dirty input
├── output/
│   ├── claims_clean.csv           # Clean output
│   └── data_quality_report.md     # Report
└── scripts/
    ├── constants.py               # Shared helpers & mappings
    ├── generate_dirty_data.py     # Dataset generator
    └── clean_claims.py            # Cleaner + report builder
```

## Intentional Data Issues Introduced

| Column | Issues |
|--------|--------|
| claim_id | Missing, duplicated values |
| policy_id | Missing |
| member_name | Mixed casing (`JOHN DOE`, `john doe`) |
| claim_type | Typos (`Outpateint`, `OP`, lowercase) |
| diagnosis | Empty, `N/A`, `n/a` |
| submitted_amount | Negative, zero, comma-formatted strings |
| currency | `thb`, `Baht`, `vnd` |
| submitted_date | ISO, `DD/MM/YYYY`, `Month DD, YYYY` |
| status | Lowercase / spaced variants |

## Timeline Estimate

| Phase | Time |
|-------|------|
| Dataset generator with injected issues | 45 min |
| Cleaning script + issue detection | 60 min |
| Report generation + summary stats | 30 min |
| Testing edge cases + README | 15 min |
| **Total** | **~2.5 hours** |
