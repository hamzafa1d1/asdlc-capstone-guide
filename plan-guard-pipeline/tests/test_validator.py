import json
import unittest
from pathlib import Path

from pipeline import validator

ATHLETE = json.loads((Path(__file__).parent.parent / "athlete.json").read_text())
RUN_A = Path(__file__).parent.parent / "runs" / "2026-09-26-a"


def week(**overrides):
    days = [
        {"day": "Mon", "type": "easy", "km": 7},
        {"day": "Tue", "type": "rest", "km": 0},
        {"day": "Wed", "type": "tempo", "km": 7},
        {"day": "Thu", "type": "rest", "km": 0},
        {"day": "Fri", "type": "easy", "km": 6},
        {"day": "Sat", "type": "rest", "km": 0},
        {"day": "Sun", "type": "long", "km": 10},
    ]
    for d in days:
        d.update(overrides.get(d["day"], {}))
    return json.dumps({"week_of": "2026-09-28", "total_km": sum(d["km"] for d in days), "days": days})


def failed(report):
    return {c["name"] for c in report["checks"] if not c["ok"]}


class ValidatorTest(unittest.TestCase):
    def test_safe_week_passes(self):
        r = validator.validate(week(), ATHLETE)
        self.assertTrue(r["ok"], r["errors"])

    def test_acwr_over_cap(self):
        self.assertIn("acwr", failed(validator.validate(week(Sun={"km": 12}), ATHLETE)))

    def test_blocked_day(self):
        self.assertIn("blocked_days_rest",
                      failed(validator.validate(week(Tue={"type": "easy", "km": 3}), ATHLETE)))

    def test_injury(self):
        self.assertIn("injury_restrictions",
                      failed(validator.validate(week(Wed={"type": "hills"}), ATHLETE)))

    def test_back_to_back(self):
        self.assertIn("no_back_to_back_hard",
                      failed(validator.validate(week(Sat={"type": "tempo", "km": 3}, Fri={"km": 3}), ATHLETE)))

    def test_long_not_longest(self):
        self.assertIn("long_run_is_longest",
                      failed(validator.validate(week(Sun={"km": 6}, Mon={"km": 8}), ATHLETE)))

    def test_recorded_run_a_attempts(self):
        """Replays the real generator outputs from run A against the current rules."""
        expected = {
            1: {"acwr"},
            2: {"days_per_week", "no_back_to_back_hard", "long_run_is_longest"},
            3: {"long_run_is_longest"},  # passed in run A; caught after the fix
        }
        for n, names in expected.items():
            raw = (RUN_A / f"attempt-{n}.response.txt").read_text()
            self.assertEqual(failed(validator.validate(raw, ATHLETE)), names, f"attempt {n}")

    def test_prompt_rules_match_validator_cap(self):
        rules = validator.rules_for_prompt(ATHLETE)
        self.assertIn("31.1", rules[0])


if __name__ == "__main__":
    unittest.main()
