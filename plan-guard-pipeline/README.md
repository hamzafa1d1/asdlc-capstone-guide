# Plan Guard Pipeline

A multi-step agent workflow for [aitrainingplan.app](https://aitrainingplan.app): an LLM agent drafts an athlete's next training week, a deterministic validator checks it against load-management and injury rules, and a publisher ships the week **only if every rule passes**. Failed drafts go back to the generator with the exact errors.

**Published output:** [`docs/index.html`](docs/index.html) (GitHub Pages) · [`docs/plan.json`](docs/plan.json)

```
athlete.json ──► 1. GENERATE ──raw text──► 2. VALIDATE ──ok──► 3. PUBLISH ──► docs/index.html + plan.json
                 Claude Haiku              Python rules          HTML + JSON
                      ▲                         │
                      └──── errors + previous draft (max 3 attempts) ◄── fail
```

## The steps

| # | Step | Run by | Input | Output | Hand-off |
|---|------|--------|-------|--------|----------|
| 1 | Generate | Claude Haiku agent ([`pipeline/generator.py`](pipeline/generator.py)) | athlete profile + hard rules (+ previous draft and errors on retry) | raw text that should be JSON for 7 days | `attempt-N.response.txt` → validator |
| 2 | Validate | Python, no LLM ([`pipeline/validator.py`](pipeline/validator.py)) | raw text + athlete profile | report `{ok, errors[], checks[], plan}` | `ok` → publisher; else `errors` → generator |
| 3 | Publish | Python ([`pipeline/publisher.py`](pipeline/publisher.py)) | approved report | `docs/index.html`, `docs/plan.json` | GitHub Pages |

Orchestration: [`pipeline/run.py`](pipeline/run.py). Every attempt's prompt, raw response and report is saved in [`runs/`](runs/) so each run can be audited.

### Validator rules (athlete: half marathon 1:45, 10 wks out, 26/28/30/29 km, 4 days/wk, no Tuesdays, calf strain 3 wks ago)

1. `schema`: 7 days Mon to Sun, known session types, numeric km
2. `total_matches_days`: the stated `total_km` equals the sum of the days
3. `acwr`: week km / 4-week average ≤ 1.10 (≤ 31.1 km here)
4. `blocked_days_rest`: Tuesday is a rest day
5. `days_per_week`: ≤ 4 run days
6. `injury_restrictions`: no hills or intervals during the calf return
7. `no_back_to_back_hard`: tempo, intervals, hills and long runs never on consecutive days
8. `long_run_is_longest`: the long run is the longest session (added after run A, see below)
9. `long_run_share`: longest run ≤ 35% of the week

The safety check is code, not a second LLM, on purpose: an injury rule has to give the same answer every time.

## Where it broke and what I changed

**Run [`2026-09-26-a`](runs/2026-09-26-a/)** (commit `Run 2026-09-26-a`):

- Attempt 1 was rejected on `acwr` (32 km against the 31.1 km cap).
- Attempt 2 cut the week to 30 km but now used **5 run days** and put tempo and long runs on **Sat and Sun back to back**. The fix for one rule broke two others.
- Attempt 3 passed on the last allowed try. The week it published had a **7 km "long run" shorter than Monday's 8 km easy run**, and no rule caught it.

Root cause: the rules lived only in the validator. The generator learned them one rejection at a time and rewrote the week from scratch on each retry, so it traded one violation for another. With a 3-attempt cap, that's a coin flip between publishing and being blocked.

Fix (commit `Fix retry whack-a-mole`):

- `validator.rules_for_prompt()` builds the hard rules from the same constants the validator uses, and they go into the generator prompt. The prompt and the validator can't drift apart.
- Retries send the **previous draft plus the errors** and ask for a minimal edit instead of a rewrite.
- New `long_run_is_longest` check.
- `tests/test_validator.py` replays run A's real generator outputs: attempt 3, which published before the fix, is now rejected.

**Runs [`2026-09-26-b`](runs/2026-09-26-b/) and [`2026-09-26-c`](runs/2026-09-26-c/)** after the fix: both passed on attempt 1 (30 km, ACWR 1.06, 10 km long run).

## Run it

```bash
python3 -m unittest discover -s tests -t .          # validator tests, stdlib only

# Live: generator calls the Anthropic API
ANTHROPIC_API_KEY=... python3 -m pipeline.run --run-id my-run --backend api

# Agent hand-off (how the recorded runs were made): the pipeline writes
# runs/<id>/attempt-N.prompt.txt and exits 3; an agent writes attempt-N.response.txt;
# re-run the same command to continue.
python3 -m pipeline.run --run-id my-run --backend inbox
```

No dependencies beyond Python 3.10+.

## What I'd do next

- A second LLM reviewer that scores coaching quality (rules pass ≠ good plan; 10 km long run is light for a 1:45 half).
- Compute pace zones from the athlete's threshold in code instead of trusting the model's labels.
- Measure load in TSS from real Strava/Garmin data instead of km.
