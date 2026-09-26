"""Step 1 - Generator agent.

Builds the prompt for an LLM that drafts one training week, and gets the raw
text back from one of two backends:

  api    - calls the Anthropic Messages API (needs ANTHROPIC_API_KEY).
  inbox  - file handoff: writes attempt-N.prompt.txt into the run folder and
           reads attempt-N.response.txt once an agent has written it. This is
           how the recorded runs in runs/ were produced (a Claude Haiku
           sub-agent read the prompt file and wrote the response file).

The generator never parses or judges its own output. That is the validator's job.
"""
import json
import os
import urllib.request
from pathlib import Path

MODEL = "claude-haiku-4-5"

SCHEMA = """{
  "week_of": "YYYY-MM-DD (a Monday)",
  "total_km": number,
  "days": [
    {"day": "Mon", "type": "rest|easy|tempo|intervals|hills|long", "km": number, "pace": "m:ss/km or null", "notes": "string"}
    ... exactly 7 entries, Mon to Sun in order
  ]
}"""


def build_prompt(athlete, week_of, feedback=None, previous=None, rules=()):
    prompt = f"""You are a running coach for aitrainingplan.app.
Draft next week's training for this athlete.

ATHLETE PROFILE (JSON):
{json.dumps(athlete, indent=2)}

Plan the week starting {week_of}.

HARD RULES (a validator rejects the week if any is broken):
{chr(10).join(f"- {r}" for r in rules)}

Return ONLY raw JSON matching this schema. No markdown, no code fences, no commentary.
{SCHEMA}
"""
    if feedback:
        prompt += (
            "\nYOUR PREVIOUS DRAFT WAS REJECTED BY THE VALIDATOR.\n"
            f"Previous draft:\n{previous}\n"
            "Errors:\n"
            + "\n".join(f"- {e}" for e in feedback)
            + "\nEdit the previous draft: fix these errors, keep every HARD RULE above "
            "satisfied, and change as little else as possible. "
            "Return the full corrected week as raw JSON only.\n"
        )
    return prompt


class WaitingForAgent(Exception):
    """Raised by the inbox backend when the response file is not there yet."""


def generate(prompt, backend, run_dir, attempt):
    run_dir = Path(run_dir)
    (run_dir / f"attempt-{attempt}.prompt.txt").write_text(prompt)
    response_file = run_dir / f"attempt-{attempt}.response.txt"

    if backend == "inbox":
        if not response_file.exists():
            raise WaitingForAgent(str(response_file))
        return response_file.read_text()

    if backend == "api":
        text = _call_anthropic(prompt)
        response_file.write_text(text)
        return text

    raise ValueError(f"unknown backend {backend!r}")


def _call_anthropic(prompt):
    key = os.environ.get("ANTHROPIC_API_KEY")
    if not key:
        raise SystemExit("ANTHROPIC_API_KEY is not set (or use --backend inbox)")
    body = json.dumps({
        "model": MODEL,
        "max_tokens": 1500,
        "messages": [{"role": "user", "content": prompt}],
    }).encode()
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages",
        data=body,
        headers={
            "x-api-key": key,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.load(resp)
    return "".join(b.get("text", "") for b in data["content"])
