#!/usr/bin/env python3
"""Run the full Challenge 02 pipeline: generate dirty data, clean, and report."""

from __future__ import annotations

import sys
from pathlib import Path

SCRIPTS_DIR = Path(__file__).resolve().parent / "scripts"
sys.path.insert(0, str(SCRIPTS_DIR))

from clean_claims import main as clean_main
from generate_dirty_data import main as generate_main


def main() -> None:
    generate_main()
    clean_main()


if __name__ == "__main__":
    main()
