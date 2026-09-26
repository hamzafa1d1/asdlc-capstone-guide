"""Step 2 - Validator (deterministic, no LLM).

Takes the generator's raw text, parses it, and checks the week against
load-management and athlete-specific rules. Returns a report dict:

  {"ok": bool, "errors": [str], "checks": [{"name", "ok", "detail"}], "plan": dict|None}

The errors list is what gets sent back to the generator on a retry.
"""
import json

DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
TYPES = {"rest", "easy", "tempo", "intervals", "hills", "long"}
HARD = {"tempo", "intervals", "hills", "long"}
ACWR_MAX = 1.10
LONG_RUN_MAX_SHARE = 0.35


def rules_for_prompt(athlete):
    """The same hard rules validate() enforces, as text for the generator prompt.

    Built from the same constants so the prompt and the validator can't drift.
    """
    recent = athlete["recent_weeks_km"]
    cap = sum(recent) / len(recent) * ACWR_MAX
    avoid = athlete.get("injury", {}).get("avoid_session_types", [])
    return [
        f"total weekly km <= {cap:.1f} (ACWR {ACWR_MAX} against the 4-week average)",
        f"at most {athlete['days_per_week']} run days; all other days are rest with 0 km",
        f"{', '.join(athlete.get('blocked_days', [])) or 'no'} blocked day(s) must be rest",
        f"no session of type {', '.join(avoid)}" if avoid else "no injury restrictions",
        f"no two hard days in a row (hard = {', '.join(sorted(HARD))})",
        "the long run is the single longest run of the week",
        f"the long run is <= {LONG_RUN_MAX_SHARE:.0%} of weekly km",
        "total_km equals the sum of the days' km",
    ]


def parse(raw):
    return json.loads(raw)


def validate(raw, athlete):
    try:
        plan = parse(raw)
    except json.JSONDecodeError as e:
        raise RuntimeError(f"validator could not parse generator output: {e}") from e

    checks = []

    def check(name, ok, detail):
        checks.append({"name": name, "ok": bool(ok), "detail": detail})

    # 1. schema
    days = plan.get("days") if isinstance(plan, dict) else None
    schema_ok = (
        isinstance(days, list)
        and [d.get("day") for d in days] == DAYS
        and all(d.get("type") in TYPES for d in days)
        and all(isinstance(d.get("km"), (int, float)) and d["km"] >= 0 for d in days)
    )
    check("schema", schema_ok,
          "7 days Mon-Sun, known session types, numeric km" if schema_ok
          else "days must be 7 entries Mon..Sun with type in "
               f"{sorted(TYPES)} and numeric km >= 0")
    if not schema_ok:
        return _report(checks, plan)

    week_km = round(sum(d["km"] for d in days), 1)
    by_day = {d["day"]: d for d in days}

    # 2. stated total matches the days
    stated = plan.get("total_km")
    check("total_matches_days",
          isinstance(stated, (int, float)) and abs(stated - week_km) <= 0.1,
          f"stated total_km={stated}, sum of days={week_km}")

    # 3. acute:chronic workload ratio
    recent = athlete["recent_weeks_km"]
    chronic = sum(recent) / len(recent)
    acwr = week_km / chronic
    cap = round(chronic * ACWR_MAX, 1)
    check("acwr", acwr <= ACWR_MAX + 1e-9,
          f"{week_km} km / {chronic:.2f} km 4-wk avg = ACWR {acwr:.2f} "
          f"(max {ACWR_MAX}, i.e. <= {cap} km)")

    # 4. blocked days are rest
    bad = [d for d in athlete.get("blocked_days", []) if by_day[d]["type"] != "rest" or by_day[d]["km"] > 0]
    check("blocked_days_rest", not bad,
          "blocked days are rest" if not bad else f"{', '.join(bad)} must be rest with 0 km")

    # 5. run days <= availability
    run_days = [d["day"] for d in days if d["type"] != "rest"]
    limit = athlete["days_per_week"]
    check("days_per_week", len(run_days) <= limit,
          f"{len(run_days)} run days ({', '.join(run_days)}), limit {limit}")

    # 6. injury restrictions
    avoid = set(athlete.get("injury", {}).get("avoid_session_types", []))
    hits = [f"{d['day']} {d['type']}" for d in days if d["type"] in avoid]
    check("injury_restrictions", not hits,
          f"no {'/'.join(sorted(avoid))} during {athlete['injury']['type']} return"
          if not hits else f"not allowed during {athlete['injury']['type']} return: {', '.join(hits)}")

    # 7. no back-to-back hard days
    pairs = [f"{a['day']}-{b['day']}" for a, b in zip(days, days[1:])
             if a["type"] in HARD and b["type"] in HARD]
    check("no_back_to_back_hard", not pairs,
          "hard sessions separated" if not pairs else f"back-to-back hard days: {', '.join(pairs)}")

    # 8. the long run is actually the longest run
    long_days = [d for d in days if d["type"] == "long"]
    others = max((d["km"] for d in days if d["type"] != "long"), default=0)
    long_ok = len(long_days) <= 1 and all(d["km"] > others for d in long_days)
    check("long_run_is_longest", long_ok,
          "long run is the longest session" if long_ok else
          "long run (" + ", ".join(f"{d['day']} {d['km']:g} km" for d in long_days) + ") "
          f"must be longer than every other run (max other {others:g} km) and appear once")

    # 9. long run share
    longest = max(d["km"] for d in days)
    share = longest / week_km if week_km else 0
    check("long_run_share", share <= LONG_RUN_MAX_SHARE + 1e-9,
          f"longest run {longest} km = {share:.0%} of week (max {LONG_RUN_MAX_SHARE:.0%})")

    return _report(checks, plan)


def _report(checks, plan):
    errors = [f"{c['name']}: {c['detail']}" for c in checks if not c["ok"]]
    return {"ok": not errors, "errors": errors, "checks": checks, "plan": plan}
