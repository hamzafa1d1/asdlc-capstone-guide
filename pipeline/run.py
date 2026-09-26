"""Orchestrator: generate -> validate -> (retry with errors) -> publish.

Usage:
  python -m pipeline.run --run-id 2026-09-26-a --backend api
  python -m pipeline.run --run-id 2026-09-26-a --backend inbox   # file handoff to an agent

Every attempt's prompt, raw response and validator report is kept in
runs/<run-id>/ so a run can be audited after the fact.
"""
import argparse
import json
import sys
from pathlib import Path

from . import generator, publisher, validator

MAX_ATTEMPTS = 3


def main(argv=None):
    ap = argparse.ArgumentParser()
    ap.add_argument("--run-id", required=True)
    ap.add_argument("--backend", choices=["api", "inbox"], default="api")
    ap.add_argument("--athlete", default="athlete.json")
    ap.add_argument("--week-of", default="2026-09-28")
    args = ap.parse_args(argv)

    athlete = json.loads(Path(args.athlete).read_text())
    run_dir = Path("runs") / args.run_id
    run_dir.mkdir(parents=True, exist_ok=True)
    log = {"run_id": args.run_id, "attempts": []}

    feedback = None
    for attempt in range(1, MAX_ATTEMPTS + 1):
        prompt = generator.build_prompt(athlete, args.week_of, feedback)
        try:
            raw = generator.generate(prompt, args.backend, run_dir, attempt)
        except generator.WaitingForAgent as w:
            print(f"[generate] attempt {attempt}: waiting for agent to write {w}")
            return 3

        print(f"[generate] attempt {attempt}: {len(raw)} chars")
        report = validator.validate(raw, athlete)
        (run_dir / f"attempt-{attempt}.report.json").write_text(json.dumps(report, indent=2) + "\n")

        if report["ok"]:
            log["attempts"].append({"attempt": attempt, "status": "published",
                                    "summary": "all checks passed"})
            (run_dir / "log.json").write_text(json.dumps(log, indent=2) + "\n")
            page = publisher.publish(report, athlete, log)
            print(f"[validate] attempt {attempt}: PASS -> [publish] {page}")
            return 0

        print(f"[validate] attempt {attempt}: FAIL")
        for err in report["errors"]:
            print(f"    - {err}")
        log["attempts"].append({"attempt": attempt, "status": "rejected",
                                "summary": "; ".join(report["errors"])})
        feedback = report["errors"]

    (run_dir / "log.json").write_text(json.dumps(log, indent=2) + "\n")
    print(f"[pipeline] blocked after {MAX_ATTEMPTS} attempts, nothing published")
    return 1


if __name__ == "__main__":
    sys.exit(main())
