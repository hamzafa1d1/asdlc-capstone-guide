"""Step 3 - Publisher.

Only called when the validator report has ok=True. Writes the approved week
to docs/plan.json (machine-readable, what the app would consume) and renders
docs/index.html (the public page, served by GitHub Pages) with the
validator report attached as evidence.
"""
import html
import json
from pathlib import Path

COLORS = {"rest": "rest", "easy": "easy", "long": "long",
          "tempo": "quality", "intervals": "quality", "hills": "quality"}


def publish(report, athlete, run_log, out_dir="docs"):
    if not report["ok"]:
        raise RuntimeError("publisher refuses a plan the validator did not approve")
    out = Path(out_dir)
    out.mkdir(exist_ok=True)
    plan = report["plan"]
    (out / "plan.json").write_text(json.dumps(
        {"athlete_id": athlete["athlete_id"], "plan": plan, "validation": report["checks"]},
        indent=2) + "\n")
    (out / "index.html").write_text(_render(plan, report, athlete, run_log))
    return out / "index.html"


def _render(plan, report, athlete, run_log):
    e = html.escape
    recent = athlete["recent_weeks_km"]
    chronic = sum(recent) / len(recent)
    cap = chronic * 1.10
    week_km = round(sum(d["km"] for d in plan["days"]), 1)

    days_html = "".join(
        f'<div class="day {COLORS[d["type"]]}"><div class="dn">{e(d["day"])}</div>'
        f'<div class="ty">{e(d["type"])}</div>'
        f'<div class="km">{d["km"]:g}<span> km</span></div>'
        f'<div class="pc">{e(d.get("pace") or "")}</div>'
        f'<div class="nt">{e(d.get("notes") or "")}</div></div>'
        for d in plan["days"])

    bars = recent + [week_km]
    top = max(bars + [cap]) * 1.15
    bar_html = "".join(
        f'<div class="bar{" plan" if i == len(bars) - 1 else ""}" style="height:{v / top * 100:.1f}%">'
        f'<b>{v:g}</b><i>{"planned" if i == len(bars) - 1 else f"wk -{len(recent) - i}"}</i></div>'
        for i, v in enumerate(bars))

    checks_html = "".join(
        f'<li class="{"pass" if c["ok"] else "fail"}"><span>{"PASS" if c["ok"] else "FAIL"}</span>'
        f'<code>{e(c["name"])}</code> {e(c["detail"])}</li>' for c in report["checks"])

    runs_html = "".join(
        f'<li class="{a["status"]}"><span>{e(a["status"].upper())}</span> '
        f'attempt {a["attempt"]}: {e(a["summary"])}</li>'
        for a in run_log["attempts"])

    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Plan Guard Pipeline</title>
<style>
:root{{--bg:#f7f7f4;--card:#fff;--ink:#1b1d1f;--mute:#667;--line:#e2e2dc;
--easy:#3f8f5c;--quality:#c0622b;--long:#2f5fa8;--rest:#9a9a92;--ok:#2e7d4f;--bad:#b3261e}}
@media (prefers-color-scheme:dark){{:root{{--bg:#141517;--card:#1d1f22;--ink:#ececea;--mute:#9a9ca0;--line:#2e3034}}}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--bg);color:var(--ink);font:15px/1.5 system-ui,sans-serif}}
main{{max-width:980px;margin:0 auto;padding:32px 16px 64px}}
h1{{margin:0 0 4px;font-size:28px}}h2{{font-size:17px;margin:36px 0 12px}}
.sub{{color:var(--mute)}}
.flow{{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:20px}}
.step{{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:10px 14px}}
.step b{{display:block}}.step small{{color:var(--mute)}}.arrow{{color:var(--mute)}}
.week{{display:grid;grid-template-columns:repeat(7,1fr);gap:8px}}
@media (max-width:760px){{.week{{grid-template-columns:repeat(2,1fr)}}}}
.day{{background:var(--card);border:1px solid var(--line);border-top:4px solid var(--c);border-radius:10px;padding:10px}}
.day.easy{{--c:var(--easy)}}.day.quality{{--c:var(--quality)}}.day.long{{--c:var(--long)}}.day.rest{{--c:var(--rest);opacity:.75}}
.dn{{font-weight:700}}.ty{{color:var(--c);text-transform:uppercase;font-size:12px;font-weight:700;letter-spacing:.04em}}
.km{{font-size:24px;font-weight:700}}.km span{{font-size:13px;color:var(--mute)}}
.pc{{font-size:13px}}.nt{{font-size:12px;color:var(--mute);margin-top:4px}}
.chart{{position:relative;height:200px;display:flex;align-items:flex-end;gap:14px;padding:0 8px;
border-bottom:1px solid var(--line);background:var(--card);border-radius:10px 10px 0 0}}
.bar{{flex:1;background:var(--rest);border-radius:6px 6px 0 0;position:relative}}.bar.plan{{background:var(--long)}}
.bar b{{position:absolute;top:-20px;width:100%;text-align:center;font-size:13px}}
.bar i{{position:absolute;bottom:-22px;width:100%;text-align:center;font-size:12px;color:var(--mute);font-style:normal}}
.cap{{position:absolute;left:0;right:0;border-top:2px dashed var(--bad);font-size:12px;color:var(--bad);padding-left:6px}}
ul.list{{list-style:none;padding:0;margin:0;display:grid;gap:6px}}
ul.list li{{background:var(--card);border:1px solid var(--line);border-radius:8px;padding:8px 12px}}
ul.list li span{{font-weight:700;font-size:12px;margin-right:8px}}
li.pass span,li.published span{{color:var(--ok)}}li.fail span,li.blocked span,li.rejected span{{color:var(--bad)}}
code{{font-size:13px}}footer{{margin-top:40px;color:var(--mute);font-size:13px}}
</style></head><body><main>
<h1>Plan Guard Pipeline</h1>
<div class="sub">aitrainingplan.app: an LLM drafts the week, deterministic rules decide if it ships.
Athlete <code>{e(athlete["athlete_id"])}</code>, {e(athlete["goal"]["event"])} in {e(athlete["goal"]["target_time"])},
{athlete["goal"]["weeks_out"]} weeks out, {e(athlete["injury"]["type"])} {athlete["injury"]["weeks_ago"]} weeks ago.</div>
<div class="flow">
<div class="step"><b>1 · Generate</b><small>Claude Haiku agent → JSON week</small></div><span class="arrow">→</span>
<div class="step"><b>2 · Validate</b><small>Python rules → report</small></div><span class="arrow">→</span>
<div class="step"><b>3 · Publish</b><small>only if ok → this page + plan.json</small></div>
<span class="arrow">↺ errors fed back to step 1 (max 3 attempts)</span>
</div>

<h2>Published week of {e(plan.get("week_of", ""))} · {week_km:g} km</h2>
<div class="week">{days_html}</div>

<h2>Load: last 4 weeks vs planned (ACWR cap 1.10 = {cap:.1f} km)</h2>
<div class="chart">{bar_html}<div class="cap" style="bottom:{cap / top * 100:.1f}%">cap {cap:.1f} km</div></div>
<div style="height:28px"></div>

<h2>Validator report</h2>
<ul class="list">{checks_html}</ul>

<h2>Run log ({e(run_log["run_id"])})</h2>
<ul class="list">{runs_html}</ul>

<footer>Generated by <code>pipeline/publisher.py</code>. Machine-readable output: <a href="plan.json">plan.json</a>.</footer>
</main></body></html>
"""
