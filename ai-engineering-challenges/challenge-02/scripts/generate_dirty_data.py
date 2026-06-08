"""Generate a dirty claims CSV with intentional data quality issues."""

from __future__ import annotations

import random
from datetime import date, timedelta
from pathlib import Path

from constants import COLUMNS, VALID_CLAIM_TYPES, VALID_STATUSES, write_csv

ROOT = Path(__file__).resolve().parent.parent
OUTPUT_PATH = ROOT / "data" / "claims_dirty.csv"

FIRST_NAMES = [
    "John",
    "Jane",
    "Somchai",
    "Malai",
    "David",
    "Emily",
    "Anh",
    "Linh",
    "Michael",
    "Sarah",
    "Prasert",
    "Nok",
    "Kevin",
    "Maria",
    "James",
    "Anna",
]

LAST_NAMES = [
    "Doe",
    "Smith",
    "Johnson",
    "Wong",
    "Tan",
    "Nguyen",
    "Brown",
    "Lee",
    "Garcia",
    "Kim",
    "Patel",
    "Sato",
    "Miller",
    "Wilson",
    "Chen",
    "Martin",
]

DIAGNOSES = [
    "Flu",
    "Common Cold",
    "Back Pain",
    "Dental Checkup",
    "Pregnancy Checkup",
    "Hypertension",
    "Diabetes Follow-up",
    "Fracture",
    "Allergic Reaction",
    "Migraine",
    "Gastroenteritis",
    "Skin Rash",
    "Asthma",
    "Knee Injury",
    "Eye Infection",
]

NAME_CASE_VARIANTS = [
    lambda name: name,
    lambda name: name.upper(),
    lambda name: name.lower(),
    lambda name: " ".join(part.capitalize() for part in name.split()),
]

CLAIM_TYPE_VARIANTS = {
    "OUTPATIENT": ["OUTPATIENT", "outpatient", "Outpateint", "OP"],
    "INPATIENT": ["INPATIENT", "inpatient", "Inpateint"],
    "DENTAL": ["DENTAL", "dental"],
    "MATERNITY": ["MATERNITY", "maternity"],
}

CURRENCY_VARIANTS = {
    "THB": ["THB", "thb", "Baht"],
    "VND": ["VND", "vnd"],
}


def random_date(start: date, end: date) -> date:
    delta = (end - start).days
    return start + timedelta(days=random.randint(0, delta))


def format_date_variant(value: date, variant: str) -> str:
    if variant == "iso":
        return value.isoformat()
    if variant == "dmy":
        return value.strftime("%d/%m/%Y")
    return value.strftime("%B %d, %Y")


def build_clean_row(index: int) -> dict[str, str]:
    claim_type = random.choice(VALID_CLAIM_TYPES)
    submitted = random_date(date(2024, 1, 1), date(2024, 12, 31))
    currency = random.choice(["THB", "VND"])
    member = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"

    return {
        "claim_id": f"CLM-{index:05d}",
        "policy_id": f"POL-{random.randint(1000, 9999)}",
        "member_name": member,
        "claim_type": claim_type,
        "diagnosis": random.choice(DIAGNOSES),
        "submitted_amount": str(random.randint(500, 250000)),
        "currency": currency,
        "submitted_date": submitted.isoformat(),
        "status": random.choice(VALID_STATUSES),
    }


def inject_issues(row: dict[str, str], issue_types: list[str]) -> dict[str, str]:
    mutated = dict(row)

    for issue in issue_types:
        if issue == "missing_claim_id":
            mutated["claim_id"] = ""
        elif issue == "duplicate_claim_id":
            mutated["claim_id"] = "CLM-DUPLICATE"
        elif issue == "missing_policy_id":
            mutated["policy_id"] = ""
        elif issue == "member_name_case":
            mutated["member_name"] = random.choice(NAME_CASE_VARIANTS)(mutated["member_name"])
        elif issue == "claim_type_typo":
            mutated["claim_type"] = random.choice(CLAIM_TYPE_VARIANTS[mutated["claim_type"]])
        elif issue == "diagnosis_null":
            mutated["diagnosis"] = random.choice(["", "N/A", "n/a"])
        elif issue == "amount_invalid":
            mutated["submitted_amount"] = random.choice(["0", "-1500", "-250", ""])
        elif issue == "amount_string":
            amount = random.randint(1000, 50000)
            mutated["submitted_amount"] = f"{amount:,}"
        elif issue == "currency_mixed":
            mutated["currency"] = random.choice(CURRENCY_VARIANTS[mutated["currency"]])
        elif issue == "date_mixed":
            submitted = date.fromisoformat(row["submitted_date"])
            mutated["submitted_date"] = format_date_variant(
                submitted, random.choice(["dmy", "long"])
            )
        elif issue == "status_variant":
            mutated["status"] = mutated["status"].lower().replace("_", " ")

    return mutated


def generate_rows(total_rows: int = 500, seed: int = 42) -> list[dict[str, str]]:
    random.seed(seed)
    duplicate_count = 12
    unique_rows = total_rows - duplicate_count
    rows: list[dict[str, str]] = []

    for index in range(1, unique_rows + 1):
        rows.append(build_clean_row(index))

    issue_pool = [
        ["missing_claim_id"],
        ["duplicate_claim_id"],
        ["missing_policy_id"],
        ["member_name_case"],
        ["claim_type_typo"],
        ["diagnosis_null"],
        ["amount_invalid"],
        ["amount_string"],
        ["currency_mixed"],
        ["date_mixed"],
        ["status_variant"],
        ["member_name_case", "claim_type_typo"],
        ["date_mixed", "currency_mixed"],
        ["diagnosis_null", "amount_string"],
        ["missing_policy_id", "member_name_case"],
        ["claim_type_typo", "amount_invalid"],
        ["date_mixed", "status_variant"],
        ["currency_mixed", "diagnosis_null"],
        ["amount_string", "date_mixed", "member_name_case"],
        ["duplicate_claim_id", "missing_policy_id"],
    ]

    issue_row_count = int(unique_rows * 0.18)
    issue_indices = random.sample(range(unique_rows), issue_row_count)

    for position in issue_indices:
        issue_types = random.choice(issue_pool)
        rows[position] = inject_issues(rows[position], issue_types)

    duplicate_sources = random.sample(range(unique_rows), duplicate_count)
    for position in duplicate_sources:
        rows.append(dict(rows[random.randrange(unique_rows)]))

    random.shuffle(rows)
    return rows


def main() -> None:
    rows = generate_rows()
    write_csv(OUTPUT_PATH, rows)
    print(f"Generated {len(rows)} dirty claim rows -> {OUTPUT_PATH}")


if __name__ == "__main__":
    main()
