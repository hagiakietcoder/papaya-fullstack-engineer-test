"""Clean messy insurance claims CSV and produce a data quality report."""

from __future__ import annotations

from collections import Counter, defaultdict
from dataclasses import dataclass, field
from pathlib import Path
from statistics import mean

from constants import (
    COLUMNS,
    ISSUE_LABELS,
    VALID_CLAIM_TYPES,
    VALID_CURRENCIES,
    VALID_STATUSES,
    format_amount,
    is_null,
    normalize_claim_type,
    normalize_currency,
    normalize_member_name,
    normalize_null,
    normalize_status,
    parse_amount,
    parse_date,
    read_csv,
    row_signature,
    write_csv,
)

ROOT = Path(__file__).resolve().parent.parent
INPUT_PATH = ROOT / "data" / "claims_dirty.csv"
CLEAN_OUTPUT_PATH = ROOT / "output" / "claims_clean.csv"
REPORT_OUTPUT_PATH = ROOT / "output" / "data_quality_report.md"


@dataclass
class CleaningStats:
    rows_before: int = 0
    rows_after: int = 0
    duplicates_removed: int = 0
    issue_counts: Counter = field(default_factory=Counter)
    removed_rows: list[dict[str, str]] = field(default_factory=list)


def detect_raw_issues(row: dict[str, str], seen_claim_ids: set[str]) -> list[str]:
    issues: list[str] = []

    if is_null(row.get("claim_id", "")):
        issues.append("missing_claim_id")
    else:
        claim_id = row["claim_id"].strip()
        if claim_id in seen_claim_ids:
            issues.append("duplicate_claim_id")
        seen_claim_ids.add(claim_id)

    if is_null(row.get("policy_id", "")):
        issues.append("missing_policy_id")

    normalized_name = normalize_member_name(row.get("member_name", ""))
    if normalize_null(row.get("member_name", "")) and normalized_name != row.get("member_name", "").strip():
        issues.append("inconsistent_member_name")
    elif row.get("member_name", "") and row["member_name"] != normalized_name:
        issues.append("inconsistent_member_name")

    raw_type = normalize_null(row.get("claim_type", ""))
    normalized_type = normalize_claim_type(raw_type)
    if raw_type and (raw_type != normalized_type or normalized_type not in VALID_CLAIM_TYPES):
        issues.append("claim_type_typo")

    if is_null(row.get("diagnosis", "")):
        issues.append("invalid_diagnosis")

    _, amount_invalid = parse_amount(row.get("submitted_amount", ""))
    if amount_invalid:
        issues.append("invalid_amount")

    raw_currency = normalize_null(row.get("currency", ""))
    if raw_currency:
        normalized_currency = normalize_currency(raw_currency)
        if normalized_currency not in VALID_CURRENCIES:
            issues.append("invalid_currency")
        elif raw_currency.strip() != normalized_currency:
            issues.append("invalid_currency")

    raw_date = normalize_null(row.get("submitted_date", ""))
    iso_date, date_invalid = parse_date(raw_date)
    if date_invalid:
        issues.append("invalid_date")
    elif raw_date and raw_date != iso_date:
        issues.append("non_iso_date")

    raw_status = normalize_null(row.get("status", ""))
    normalized_status = normalize_status(raw_status)
    if raw_status:
        if normalized_status not in VALID_STATUSES:
            issues.append("non_standard_status")
        elif raw_status.strip() != normalized_status:
            issues.append("non_standard_status")

    return issues


def clean_row(row: dict[str, str]) -> tuple[dict[str, str] | None, list[str]]:
    removal_reasons: list[str] = []

    claim_id = normalize_null(row.get("claim_id", ""))
    if not claim_id:
        removal_reasons.append("removed_missing_claim_id")
        return None, removal_reasons

    amount, amount_invalid = parse_amount(row.get("submitted_amount", ""))
    if amount_invalid or amount is None:
        removal_reasons.append("removed_invalid_amount")
        return None, removal_reasons

    iso_date, date_invalid = parse_date(row.get("submitted_date", ""))
    if date_invalid:
        removal_reasons.append("invalid_date")

    cleaned = {
        "claim_id": claim_id,
        "policy_id": normalize_null(row.get("policy_id", "")),
        "member_name": normalize_member_name(row.get("member_name", "")),
        "claim_type": normalize_claim_type(row.get("claim_type", "")),
        "diagnosis": normalize_null(row.get("diagnosis", "")),
        "submitted_amount": format_amount(amount),
        "currency": normalize_currency(row.get("currency", "")),
        "submitted_date": iso_date,
        "status": normalize_status(row.get("status", "")),
    }

    if cleaned["claim_type"] not in VALID_CLAIM_TYPES:
        cleaned["claim_type"] = "OUTPATIENT"

    if cleaned["currency"] not in VALID_CURRENCIES:
        cleaned["currency"] = "THB"

    if cleaned["status"] not in VALID_STATUSES:
        cleaned["status"] = "PENDING"

    return cleaned, removal_reasons


def deduplicate_rows(rows: list[dict[str, str]]) -> tuple[list[dict[str, str]], int]:
    unique_rows: list[dict[str, str]] = []
    seen: set[tuple[str, ...]] = set()
    duplicates_removed = 0

    for row in rows:
        signature = row_signature(row)
        if signature in seen:
            duplicates_removed += 1
            continue
        seen.add(signature)
        unique_rows.append(row)

    return unique_rows, duplicates_removed


def build_summary_statistics(rows: list[dict[str, str]]) -> dict[str, object]:
    claims_by_type = Counter(row["claim_type"] for row in rows)
    claims_by_status = Counter(row["status"] for row in rows)

    amounts_by_type: dict[str, list[float]] = defaultdict(list)
    for row in rows:
        amounts_by_type[row["claim_type"]].append(float(row["submitted_amount"]))

    average_amount_by_type = {
        claim_type: round(mean(values), 2)
        for claim_type, values in sorted(amounts_by_type.items())
    }

    diagnosis_counter = Counter(
        row["diagnosis"] for row in rows if normalize_null(row["diagnosis"])
    )

    return {
        "claims_by_type": dict(sorted(claims_by_type.items())),
        "claims_by_status": dict(sorted(claims_by_status.items())),
        "average_amount_by_type": average_amount_by_type,
        "top_diagnoses": diagnosis_counter.most_common(5),
    }


def render_report(stats: CleaningStats, summary: dict[str, object]) -> str:
    lines = [
        "# Claims Data Quality Report",
        "",
        "## Overview",
        "",
        f"- Total rows before cleaning: **{stats.rows_before}**",
        f"- Exact duplicate rows removed: **{stats.duplicates_removed}**",
        f"- Total rows after cleaning: **{stats.rows_after}**",
        f"- Rows removed during validation: **{len(stats.removed_rows)}**",
        "",
        "## Issues Found In Source Data",
        "",
        "| Issue Type | Rows Affected |",
        "|------------|---------------|",
    ]

    for issue_key, label in ISSUE_LABELS.items():
        if issue_key.startswith("removed_"):
            continue
        count = stats.issue_counts.get(issue_key, 0)
        lines.append(f"| {label} | {count} |")

    lines.extend(
        [
            "",
            "## Rows Removed During Cleaning",
            "",
            "| Reason | Count |",
            "|--------|-------|",
            f"| {ISSUE_LABELS['removed_invalid_amount']} | {stats.issue_counts.get('removed_invalid_amount', 0)} |",
            f"| {ISSUE_LABELS['removed_missing_claim_id']} | {stats.issue_counts.get('removed_missing_claim_id', 0)} |",
            "",
            "## Summary Statistics (Clean Data)",
            "",
            "### Total Claims by Type",
            "",
            "| Claim Type | Count |",
            "|------------|-------|",
        ]
    )

    for claim_type, count in summary["claims_by_type"].items():
        lines.append(f"| {claim_type} | {count} |")

    lines.extend(["", "### Total Claims by Status", "", "| Status | Count |", "|--------|-------|"])
    for status, count in summary["claims_by_status"].items():
        lines.append(f"| {status} | {count} |")

    lines.extend(
        [
            "",
            "### Average Submitted Amount by Type",
            "",
            "| Claim Type | Average Amount |",
            "|------------|----------------|",
        ]
    )
    for claim_type, average in summary["average_amount_by_type"].items():
        lines.append(f"| {claim_type} | {average:,.2f} |")

    lines.extend(["", "### Top 5 Most Common Diagnoses", "", "| Rank | Diagnosis | Count |", "|------|-----------|-------|"])
    for rank, (diagnosis, count) in enumerate(summary["top_diagnoses"], start=1):
        lines.append(f"| {rank} | {diagnosis} | {count} |")

    lines.extend(
        [
            "",
            "## Cleaning Rules Applied",
            "",
            "- Removed exact duplicate rows before field normalization",
            "- Normalized member names to title case",
            "- Mapped claim type aliases and typos to canonical values",
            "- Parsed all supported date formats into ISO 8601 (`YYYY-MM-DD`)",
            "- Removed rows with missing `claim_id` or invalid `submitted_amount` (zero/negative/unparsable)",
            "- Standardized currency codes to uppercase ISO values (`THB`, `VND`)",
            "- Replaced `N/A`, `n/a`, and empty strings with a blank null marker",
            "- Standardized status values to uppercase canonical values",
            "",
        ]
    )

    return "\n".join(lines)


def clean_claims(input_path: Path = INPUT_PATH) -> tuple[list[dict[str, str]], CleaningStats]:
    raw_rows = read_csv(input_path)
    stats = CleaningStats(rows_before=len(raw_rows))

    deduped_rows, duplicates_removed = deduplicate_rows(raw_rows)
    stats.duplicates_removed = duplicates_removed
    stats.issue_counts["duplicate_row"] = duplicates_removed

    seen_claim_ids: set[str] = set()
    cleaned_rows: list[dict[str, str]] = []

    for row in deduped_rows:
        for issue in detect_raw_issues(row, seen_claim_ids):
            stats.issue_counts[issue] += 1

        cleaned, removal_reasons = clean_row(row)
        if cleaned is None:
            stats.removed_rows.append(row)
            for reason in removal_reasons:
                stats.issue_counts[reason] += 1
            continue

        cleaned_rows.append(cleaned)

    stats.rows_after = len(cleaned_rows)
    return cleaned_rows, stats


def main() -> None:
    if not INPUT_PATH.exists():
        raise FileNotFoundError(
            f"Input file not found: {INPUT_PATH}. Run generate_dirty_data.py first."
        )

    cleaned_rows, stats = clean_claims()
    summary = build_summary_statistics(cleaned_rows)

    write_csv(CLEAN_OUTPUT_PATH, cleaned_rows)
    REPORT_OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    REPORT_OUTPUT_PATH.write_text(render_report(stats, summary), encoding="utf-8")

    print(f"Clean CSV written -> {CLEAN_OUTPUT_PATH} ({stats.rows_after} rows)")
    print(f"Report written -> {REPORT_OUTPUT_PATH}")


if __name__ == "__main__":
    main()
