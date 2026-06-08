"""Shared constants and helpers for claims data generation and cleaning."""

from __future__ import annotations

import csv
import re
from datetime import datetime
from pathlib import Path
from typing import Any

COLUMNS = [
    "claim_id",
    "policy_id",
    "member_name",
    "claim_type",
    "diagnosis",
    "submitted_amount",
    "currency",
    "submitted_date",
    "status",
]

VALID_CLAIM_TYPES = ("OUTPATIENT", "INPATIENT", "DENTAL", "MATERNITY")
VALID_STATUSES = ("APPROVED", "REJECTED", "PENDING", "IN_REVIEW")
VALID_CURRENCIES = ("THB", "VND")

CLAIM_TYPE_ALIASES = {
    "outpatient": "OUTPATIENT",
    "outpateint": "OUTPATIENT",
    "op": "OUTPATIENT",
    "inpatient": "INPATIENT",
    "inpateint": "INPATIENT",
    "in-patient": "INPATIENT",
    "dental": "DENTAL",
    "maternity": "MATERNITY",
}

CURRENCY_ALIASES = {
    "thb": "THB",
    "baht": "THB",
    "vnd": "VND",
}

NULL_MARKERS = {"", "n/a", "na", "null", "none", "nan"}

DATE_FORMATS = (
    "%Y-%m-%d",
    "%d/%m/%Y",
    "%m/%d/%Y",
    "%B %d, %Y",
    "%b %d, %Y",
)

ISSUE_LABELS = {
    "duplicate_row": "Exact duplicate rows",
    "missing_claim_id": "Missing claim_id",
    "duplicate_claim_id": "Duplicate claim_id values",
    "missing_policy_id": "Missing policy_id",
    "inconsistent_member_name": "Inconsistent member_name casing",
    "claim_type_typo": "claim_type typos or aliases",
    "invalid_diagnosis": "Empty / N/A diagnosis",
    "invalid_amount": "Invalid submitted_amount (negative, zero, unparsable)",
    "invalid_currency": "Non-standard currency codes",
    "non_iso_date": "Non-ISO submitted_date formats",
    "invalid_date": "Unparseable submitted_date",
    "non_standard_status": "Non-standard status values",
    "removed_invalid_amount": "Rows removed due to invalid amount after cleaning",
    "removed_missing_claim_id": "Rows removed due to missing claim_id after cleaning",
}


def read_csv(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def write_csv(path: Path, rows: list[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=COLUMNS)
        writer.writeheader()
        writer.writerows(rows)


def is_null(value: str | None) -> bool:
    if value is None:
        return True
    return value.strip().lower() in NULL_MARKERS


def normalize_null(value: str | None) -> str:
    return "" if is_null(value) else value.strip()


def normalize_member_name(value: str) -> str:
    cleaned = normalize_null(value)
    if not cleaned:
        return ""
    return " ".join(part.capitalize() for part in cleaned.split())


def normalize_claim_type(value: str) -> str:
    cleaned = normalize_null(value)
    if not cleaned:
        return ""
    upper = cleaned.upper()
    if upper in VALID_CLAIM_TYPES:
        return upper
    return CLAIM_TYPE_ALIASES.get(cleaned.lower(), upper)


def normalize_status(value: str) -> str:
    cleaned = normalize_null(value)
    if not cleaned:
        return ""
    normalized = cleaned.upper().replace(" ", "_").replace("-", "_")
    aliases = {
        "INREVIEW": "IN_REVIEW",
        "IN_REVIEW": "IN_REVIEW",
    }
    return aliases.get(normalized, normalized)


def normalize_currency(value: str) -> str:
    cleaned = normalize_null(value)
    if not cleaned:
        return ""
    upper = cleaned.upper()
    if upper in VALID_CURRENCIES:
        return upper
    return CURRENCY_ALIASES.get(cleaned.lower(), upper)


def parse_amount(value: str) -> tuple[float | None, bool]:
    """Return parsed amount and whether the raw value looked invalid."""
    if is_null(value):
        return None, True

    raw = value.strip()
    invalid_hint = False

    try:
        normalized = raw.replace(",", "")
        if not re.fullmatch(r"-?\d+(\.\d+)?", normalized):
            invalid_hint = True
        amount = float(normalized)
    except ValueError:
        return None, True

    if amount <= 0:
        invalid_hint = True

    return amount, invalid_hint


def format_amount(amount: float) -> str:
    if amount.is_integer():
        return str(int(amount))
    return f"{amount:.2f}"


def parse_date(value: str) -> tuple[str, bool]:
    cleaned = normalize_null(value)
    if not cleaned:
        return "", True

    for pattern in DATE_FORMATS:
        try:
            parsed = datetime.strptime(cleaned, pattern)
            return parsed.strftime("%Y-%m-%d"), False
        except ValueError:
            continue

    return cleaned, True


def row_signature(row: dict[str, str]) -> tuple[str, ...]:
    return tuple(row.get(column, "") or "" for column in COLUMNS)
