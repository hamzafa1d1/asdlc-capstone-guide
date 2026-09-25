/* Project p3 (Hamza 3): Multi-Agent Feature Development Pipeline, Spec -> PR. Edit content here; app.js renders it. */
(window.GUIDE_PARTS = window.GUIDE_PARTS || {}).p3 = {
  id: "p3",
  slot: "Hamza 3",
  short: "Spec → PR Pipeline",
  title: "Multi-Agent Feature Development Pipeline (Spec → PR)",
  color: "violet",
  oneLiner: "An orchestrator that turns a written feature spec into a reviewed pull request. A planner, a tester, one or more implementers and a reviewer hand work to each other through validated contracts, every command runs in a sandbox, and a benchmark of tasks with fail-to-pass tests tells you whether the team beats a single agent.",
  sessions: "S3 SDLC I · S4 SDLC II · S5 harness · S6 A2A & multi-agent · S7 economics",
  parallels: "GitHub Copilot cloud agent (issue → PR) · OpenAI Codex cloud · Devin · Kiro specs · GitHub Spec Kit · Claude Code subagents, agent teams and dynamic workflows",

  why: [
    "Every large vendor now ships an agent that takes a task and returns a pull request: GitHub's Copilot cloud agent works from an issue inside a GitHub Actions environment, Codex cloud runs each task in its own container, and Claude Code can split a job across <a data-cc=\"subagents\">subagents</a> or a scripted workflow. Spec-driven tools (Spec Kit, Kiro) add a written spec, plan and task list in front of the code. You will build a small version of this pipeline yourself and measure it.",
    "The interesting part is the evidence, not the demo. Anthropic reports big gains from multi-agent setups on research and on long app builds, and also a large token bill. Cognition argues that agents with separate contexts make conflicting decisions. Your benchmark decides who is right for your tasks, at equal budget. A defended answer of \"a single agent was better here, and here is why\" earns full marks."
  ],

  evidence: [
    { org: "Anthropic Labs", stat: "$9 vs $200", label: "A solo agent built a retro game maker in 20 min for $9 and the core game did not work. A planner + generator + evaluator harness took 6 h and $200 and produced a working app. Generator and evaluator agreed a written \"sprint contract\" with testable criteria before each chunk of work.", src: { t: "Anthropic Engineering · Mar 2026", url: "https://www.anthropic.com/engineering/harness-design-long-running-apps" } },
    { org: "Anthropic", stat: "+90.2% / ~15×", label: "A lead agent with parallel subagents beat a single agent by 90.2% on internal research evals, using about 15× the tokens of a chat. The same post says most coding tasks have fewer truly parallel parts than research.", src: { t: "Anthropic Engineering · Jun 2025", url: "https://www.anthropic.com/engineering/multi-agent-research-system" } },
    { org: "OpenAI", stat: "≥59.4%", label: "of the hard SWE-bench Verified problems OpenAI audited had tests that reject correct fixes, so OpenAI stopped reporting Verified and pointed to SWE-bench Pro. If your benchmark's tests are wrong, your pass rate is noise: validate every task before you trust it.", src: { t: "OpenAI · Feb 2026", url: "https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/" } },
    { org: "SWE-agent team", stat: ">74%", label: "on SWE-bench Verified from mini-swe-agent, a ~100-line single agent whose only tool is bash. This is the baseline your multi-agent pipeline has to beat, at the same model and budget.", src: { t: "mini-swe-agent README", url: "https://github.com/SWE-agent/mini-swe-agent" } }
  ],

  lesson: "Two camps, one design choice. Cognition says share full context and avoid splitting decisions (<a href=\"https://cognition.com/blog/dont-build-multi-agents\" target=\"_blank\" rel=\"noopener\">\"Don't Build Multi-Agents\", Jun 2025</a>). Anthropic's long-running harnesses split roles but make each hand-off an explicit, checkable artefact: a feature list, a progress file, a sprint contract. Your hand-off contracts are where you take a position. Keep decisions that must agree (API shape, file ownership) in one place, and split only work that can be checked independently.",

  note: "The project definition sizes this for 3-4 students; you are a pair. Hit the minimum viable deliverable first. The reviewer may start as deterministic checks (linters, policy scripts) and become an LLM agent in week 4.",

  architecture: {
    code: [
      "spec.md  (user story + acceptance criteria AC-1..AC-n, allowed paths, budget)",
      "   |",
      "   v",
      "ORCHESTRATOR  state machine, runs/<id>/state.json, progress.md, trace.jsonl, budget cap",
      "   |",
      "   |  SpecIn {spec_id, acs[], allowed_paths[], budget_usd}",
      "   v",
      "PLANNER      read-only tools (plan mode)",
      "   |  Plan {tasks[{id, files[], acs[]}], risks[]}      gate: schema valid, every AC covered",
      "   v",
      "TESTER (1)   writes acceptance tests from the spec only, never sees the implementation",
      "   |  TestPlan {test_ids[], ac_map{}}                 gate: new tests FAIL on base commit",
      "   v",
      "IMPLEMENTER(s)  one git worktree per task, sandbox: --network none, non-root, /workspace only",
      "   |  ImplReport {task_id, diff_stat, notes}          gate: tests/ untouched, diff within allowed_paths",
      "   v",
      "TESTER (2)   runs full suite + lint on a pristine checkout with the patch applied",
      "   |  TestReport {f2p{pass,fail}, p2p{pass,fail}, lint}  fail -> back to implementer (max 2)",
      "   v",
      "REVIEWER     read-only: diff + spec + POLICY.md",
      "   |  Review {verdict, findings[{file, line, ac, severity}]}  request_changes -> implementer (max 1)",
      "   v",
      "PR OPENER    gh pr create --draft   body = spec, plan, test report, cost, trace link",
      "",
      "Every arrow is a JSON document validated against a schema in contracts/. Every agent call",
      "writes a span {run, agent, step, tokens_in, tokens_out, cost_usd, wall_ms} to trace.jsonl."
    ].join("\n")
  },

  stack: [
    { layer: "Prototype harness", choice: "Claude Code with project <a data-cc=\"subagents\">subagents</a> in <code>.claude/agents/</code>, run through <a data-cc=\"headless\">headless mode</a> (<code>claude -p --output-format json</code>). Use it to find the right roles and prompts before you write an orchestrator.", alt: "OpenAI Codex CLI or Codex cloud, or GitHub Copilot cloud agent (student plan credits) to compare against a production issue → PR agent." },
    { layer: "Your orchestrator", choice: "Python with a plain tool-use loop over the model API (week 1), then the <a data-cc=\"agent-sdk\">Claude Agent SDK</a> (<code>claude-agent-sdk</code>: <code>agents</code>, <code>max_turns</code>, <code>max_budget_usd</code>, <code>output_format</code>) for the multi-agent version.", alt: "OpenAI Agents SDK (handoffs), LangGraph, or TypeScript with the same SDKs. Pick one and stay with it." },
    { layer: "Model", choice: "Whatever tool-calling model you have credits for (see the Tools page). Use one strong model for implementer and reviewer, and try a cheaper one for planner and tester in weeks 5-6.", alt: "Run the same benchmark on two models; the comparison is a good report section." },
    { layer: "Sandbox", choice: "Docker: a pinned image with the repo's dependencies baked in, run with <code>--network none</code>, a non-root user, <code>--read-only</code> root, and only <code>/workspace</code> mounted. The model runs on the host; only commands run inside.", alt: "Claude Code <a data-cc=\"sandboxing\">sandbox runtime</a> (bubblewrap/Seatbelt, no Docker), the Claude Code dev container, Docker Sandboxes (microVM), or E2B's free Hobby tier." },
    { layer: "Parallel isolation", choice: "<code>git worktree</code>: one checkout and branch per implementer, discarded on failure.", alt: "Claude Code subagents with <code>isolation: worktree</code> in the prototype." },
    { layer: "Specs and contracts", choice: "<code>spec.md</code> with numbered acceptance criteria (Kiro-style EARS wording works well), JSON Schema files in <code>contracts/</code>, validated with Pydantic or <code>jsonschema</code>.", alt: "Generate the spec and plan with GitHub Spec Kit (<code>/speckit.specify</code>, <code>/speckit.plan</code>, <code>/speckit.tasks</code>) and feed its output to your pipeline." },
    { layer: "Target repos", choice: "Week 1: a toy Python library you write (~500-800 lines, pytest). From week 5: add a fork of one small real open-source Python or TypeScript project with a fast test suite.", alt: "Any language whose tests run in under 60 s inside the container." },
    { layer: "Benchmark", choice: "SWE-bench-style tasks: <code>bench/tasks/&lt;id&gt;/</code> with <code>spec.md</code>, <code>task.json</code> (base commit, FAIL_TO_PASS and PASS_TO_PASS test ids), hidden tests and a gold patch.", alt: "Borrow a few SWE-bench or Terminal-Bench tasks for a sanity check, but most tasks should be yours." },
    { layer: "Tracing and dashboard", choice: "One <code>trace.jsonl</code> per run plus a small static HTML or Streamlit page that reads them.", alt: "Self-hosted Langfuse or any OpenTelemetry backend." },
    { layer: "PR and CI", choice: "GitHub (free public repos), <code>gh pr create --draft</code>, GitHub Actions to run the pipeline when an issue gets a label.", alt: "The Claude Code <a data-cc=\"github-actions\">GitHub Action</a> as a comparison point." }
  ],

  milestones: [
    {
      id: "m1", when: "Week 1", title: "One agent, spec to green tests, inside a sandbox",
      hours: "30-40 h (pair)",
      goal: "By Friday a single agent takes a short <code>spec.md</code>, edits a toy repo inside a locked-down container until the hidden tests pass, and leaves a full trace. You also have 5 validated benchmark tasks and a script that scores any agent on them.",
      build: [
        "Write the toy target repo: a small Python library (for example a text utilities or invoice-calculation package, 500-800 lines, 30+ pytest tests). You control it, so you know every bug and every missing feature.",
        "Build the sandbox image: <code>Dockerfile</code> with Python, the repo's dependencies and pytest baked in, a non-root user, <code>WORKDIR /workspace</code>. Run it with <code>--network none --read-only --tmpfs /tmp --cap-drop ALL --pids-limit 256 --memory 2g</code> and mount only the task checkout at <code>/workspace</code>.",
        "Write the single agent as a plain loop (~150 lines): the model on the host, one <code>bash</code> tool that runs <code>docker exec</code> in the container, output truncated to the last ~8 KB, a hard step limit. This is the mini-swe-agent design and it is your baseline for the whole project.",
        "Log every step to <code>runs/&lt;id&gt;/trace.jsonl</code>: step, tool input, exit code, output size, input/output tokens, cost.",
        "Create 5 benchmark tasks in <code>bench/tasks/</code>. Each has <code>spec.md</code> (what, not how, with acceptance criteria AC-1..n), <code>task.json</code> (base commit, FAIL_TO_PASS and PASS_TO_PASS test ids, difficulty), <code>hidden_tests/</code> copied in only at grading time, and <code>gold.patch</code>.",
        "Write <code>bench/validate.py</code> (hidden tests fail on base, pass with the gold patch, PASS_TO_PASS stays green) and <code>bench/run.py</code> (runs an agent on each task N times in fresh containers and prints pass@1, pass^N, cost, steps).",
        "Run the same 5 tasks once through Claude Code in <a data-cc=\"headless\">headless mode</a> (<code>claude -p ... --output-format json</code>) inside the same container. Keep its <code>total_cost_usd</code> and <code>num_turns</code> as a reference row."
      ],
      deliver: [
        "Public repo with <code>toyrepo/</code>, <code>sandbox/Dockerfile</code>, <code>agent/single.py</code>, <code>bench/</code> and a README that runs everything with <code>make bench</code>.",
        "<code>RESULTS.md</code> row 0: single agent on 5 tasks × 3 runs, and the Claude Code reference row.",
        "One trace of a solved task and one of a failed task, each with a two-line note on what happened."
      ],
      measure: [
        "<code>validate.py</code> reports 5/5 tasks valid.",
        "Single-agent pass@1 over 15 runs, median cost per task and median steps are recorded with the commit hash.",
        "100% of runs have a trace file with one line per model call.",
        "Sandbox checks pass: no network, no writes outside <code>/workspace</code> and <code>/tmp</code>, uid is not 0."
      ],
      test: {
        intro: "Run these from a fresh clone. The table shows the expected format only; your numbers will differ.",
        code: { lang: "bash", title: "Week 1 checks", text: "make sandbox                      # builds sandbox:py312\npython bench/validate.py bench/tasks/\n# t01-slugify-unicode   OK  f2p: 2 fail on base, 2 pass on gold  p2p: 34/34\n# ...\n# 5/5 tasks valid\n\npython bench/run.py --agent single --tasks bench/tasks/ --n 3\n# task                 pass  cost_usd  steps  wall_s\n# t01-slugify-unicode  3/3   ...       ...    ...\n# pass@1 = x.xx (k/15)  pass^3 = x.xx  median cost/task = $x.xx  median steps = n\n\ndocker run --rm --network none sandbox:py312 python -c \"import urllib.request as u; u.urlopen('https://pypi.org')\"\n# expected: URLError (name resolution fails), non-zero exit" },
        checks: [
          "<code>validate.py</code> exits 0 and prints 5/5. Break one task on purpose (make a hidden test pass on base) and check it reports that task as invalid.",
          "<code>run.py</code> prints pass@1, pass^3, median cost and median steps, and writes <code>bench/results/&lt;date&gt;-single.json</code>.",
          "Every run directory contains <code>trace.jsonl</code>; <code>wc -l</code> equals the step count in the results file.",
          "Hidden tests never appear in the agent's container before grading: grep the trace for the hidden test file names and expect 0 hits.",
          "At least 2 of the 5 tasks are solved at least once. If none are, your specs or tool output are the problem, not the model; read the traces."
        ]
      },
      lab: {
        id: "p3-lab-sandbox", title: "Prove your sandbox holds", time: "90 min", level: "Warm-up",
        goal: "Before any agent writes code, show with commands that a process in your container cannot reach the internet, cannot write outside <code>/workspace</code>, and does not run as root.",
        build: [
          "Write a Dockerfile from <code>python:3.12-slim</code> that creates user <code>agent</code> (uid 1000) and installs pytest.",
          "Write <code>sandbox/run.sh</code> that starts a container with <code>--network none --read-only --tmpfs /tmp --cap-drop ALL --security-opt no-new-privileges --user 1000:1000 -v $PWD/work:/workspace</code>.",
          "Write <code>sandbox/escape_test.sh</code> that tries five things inside the container and prints PASS or FAIL for each."
        ],
        verify: [
          "<code>curl -m 5 https://example.com</code> (or a Python <code>urlopen</code>) fails: PASS.",
          "<code>touch /etc/pwned</code> fails with \"Read-only file system\": PASS.",
          "<code>touch /workspace/ok</code> succeeds and the file appears on the host in <code>work/</code>: PASS.",
          "<code>id -u</code> prints 1000: PASS.",
          "<code>ls /root</code> fails with permission denied, and nothing from your host home directory is visible: PASS."
        ],
        stretch: [
          "Allow exactly one host (your package mirror or the model API) through an egress proxy and prove every other host is still blocked.",
          "Run Claude Code itself under the sandbox runtime (<code>npx @anthropic-ai/sandbox-runtime claude</code>) and repeat the five checks."
        ],
        links: [
          { t: "Choose a sandbox environment (Claude Code docs)", url: "https://code.claude.com/docs/en/sandbox-environments" },
          { t: "Beyond permission prompts: Claude Code sandboxing (Oct 2025)", url: "https://www.anthropic.com/engineering/claude-code-sandboxing" }
        ],
        cc: ["sandboxing", "permissions"]
      },
      cc: ["agent-loop", "tools", "sandboxing", "headless", "cost-tracking"],
      resources: [
        { kind: "repo", t: "mini-swe-agent", by: "SWE-agent team (Princeton, Stanford)", url: "https://github.com/SWE-agent/mini-swe-agent", note: "Read the whole agent before you write yours. Bash-only, linear history." },
        { kind: "docs", t: "SWE-bench evaluation harness", by: "SWE-bench", url: "https://www.swebench.com/SWE-bench/reference/harness/", note: "How FAIL_TO_PASS and PASS_TO_PASS grading works in Docker." },
        { kind: "read", t: "Demystifying evals for AI agents", by: "Anthropic Engineering", date: "Jan 2026", url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", note: "pass@k vs pass^k, and why to start with 20-50 tasks from real failures." },
        { kind: "docs", t: "Run Claude Code programmatically", by: "Claude Code docs", url: "https://code.claude.com/docs/en/headless", note: "-p, --output-format json, --json-schema, --bare." },
        { kind: "read", t: "Beyond permission prompts: making Claude Code more secure and autonomous", by: "Anthropic Engineering", date: "Oct 2025", url: "https://www.anthropic.com/engineering/claude-code-sandboxing", note: "Filesystem and network isolation, and why you need both." }
      ]
    },

    {
      id: "m2", when: "Week 2", title: "Prototype the team in Claude Code, then freeze the contracts",
      hours: "30-40 h (pair)",
      goal: "Find out which roles and hand-offs actually help by building the team as Claude Code subagents first. Then write the contracts as JSON Schemas, build your own planner against them, and grow the benchmark to 10 tasks.",
      build: [
        "Write four project subagents in <code>.claude/agents/</code>: <code>planner.md</code> (tools Read, Grep, Glob; <code>permissionMode: plan</code>, see <a data-cc=\"plan-mode\">plan mode</a>), <code>tester.md</code> (may only write under <code>tests/</code>), <code>implementer.md</code> (<code>isolation: worktree</code>), <code>reviewer.md</code> (read-only tools). Keep prompts under a page each.",
        "Add <a data-cc=\"hooks\">hooks</a> in <code>.claude/settings.json</code> (<a data-cc=\"settings\">settings</a>): a <code>PreToolUse</code> hook that denies edits to <code>tests/</code> from the implementer and denies <code>git push</code> and network commands (back them with <a data-cc=\"permissions\">permission</a> deny rules); a <code>Stop</code> hook that runs the test suite and exits 2 (keep working) while tests fail.",
        "Run the 5 week-1 tasks through this subagent team with <code>claude -p</code>. Save each transcript. Note every place a subagent had to guess something the previous one knew.",
        "From those notes, write <code>contracts/</code>: JSON Schemas for SpecIn, Plan, TestPlan, ImplReport, TestReport and Review (see the architecture diagram). Every field must be something the next agent needs.",
        "Fix the spec format: numbered acceptance criteria, allowed paths, out-of-scope list, budget. Write a spec linter that rejects a spec with no acceptance criteria or with vague criteria (no observable outcome).",
        "Implement the planner in your own code: spec in, <code>plan.json</code> out, validated against the schema, retried once with the validation error if invalid. Use structured output (<code>output_format</code> in the Agent SDK or <code>--json-schema</code> in the CLI).",
        "Add 5 more benchmark tasks (10 total): at least 3 that touch two or more files and 2 that need a new module."
      ],
      deliver: [
        "<code>.claude/agents/</code>, <code>.claude/settings.json</code> hooks, and the 5 transcripts.",
        "<code>contracts/*.schema.json</code> plus <code>ARCHITECTURE.md</code> with the diagram and one paragraph per hand-off: what it carries, who validates it, what happens on failure.",
        "<code>pipeline/plan.py</code> and 10 plans for the 10 specs.",
        "<code>RESULTS.md</code> row 1: Claude Code subagent team vs Claude Code single session on 10 tasks (pass, cost, turns)."
      ],
      measure: [
        "10/10 benchmark tasks pass <code>validate.py</code>.",
        "Planner output is schema-valid for 10/10 specs, with at most one retry each.",
        "Every acceptance criterion in every spec is mapped to at least one plan task (coverage 100%).",
        "The hooks block a planted forbidden action in a scripted test (edit to <code>tests/</code>, <code>git push</code>)."
      ],
      test: {
        code: { lang: "bash", title: "Week 2 checks", text: "pytest tests/contracts -q            # schema round-trips, bad fixtures rejected\n\npython -m pipeline.plan bench/tasks/t03/spec.md -o /tmp/plan.json\npython -m pipeline.check_coverage bench/tasks/t03/spec.md /tmp/plan.json\n# AC-1 -> T1   AC-2 -> T1,T2   AC-3 -> T3\n# coverage 3/3\n\npython -m pipeline.plan_all bench/tasks/ --report\n# valid 10/10   retries 1   uncovered ACs 0\n\n# hook check: ask the implementer to edit a test, expect a denial\nclaude -p \"Use the implementer subagent to change tests/test_core.py so it passes\" \\\n  --output-format json | jq '.permission_denials | length'\n# expected: 1 or more" },
        checks: [
          "The contract tests include at least one invalid fixture per schema (missing field, wrong type) and each is rejected.",
          "The spec linter rejects a spec that says \"make it faster\" with no measurable criterion.",
          "The subagent vs single-session comparison uses the same 10 tasks, the same model and reports cost from <code>total_cost_usd</code>.",
          "ARCHITECTURE.md names at least one decision you moved back into a single agent because splitting it caused conflicts."
        ]
      },
      lab: {
        id: "p3-lab-subagents", title: "Two implementers, two worktrees, no collisions", time: "2 h", level: "Warm-up",
        goal: "See worktree isolation and hook gates work before you rebuild them in your own orchestrator.",
        build: [
          "Create <code>.claude/agents/implementer.md</code> with <code>isolation: worktree</code> and tools Read, Edit, Bash.",
          "Ask Claude Code to run two implementer subagents in parallel on two independent specs from your benchmark.",
          "Add a <code>PreToolUse</code> hook script that logs every Bash command with the working directory to <code>hooks.log</code>."
        ],
        verify: [
          "<code>git worktree list</code> during the run shows two extra worktrees on separate branches.",
          "<code>hooks.log</code> shows each subagent's commands running only inside its own worktree path.",
          "After the run, <code>git diff main..&lt;branch&gt;</code> for each branch touches only the files its spec needed.",
          "A deliberately conflicting pair (both specs edit the same function) produces a merge conflict you can show, which is your argument for file ownership in the plan."
        ],
        links: [
          { t: "Create custom subagents", url: "https://code.claude.com/docs/en/sub-agents" },
          { t: "Run parallel sessions with worktrees", url: "https://code.claude.com/docs/en/worktrees" },
          { t: "Hooks reference", url: "https://code.claude.com/docs/en/hooks" }
        ],
        cc: ["subagents", "hooks", "plan-mode", "settings"]
      },
      cc: ["subagents", "plan-mode", "hooks", "settings", "permissions", "headless"],
      resources: [
        { kind: "docs", t: "Create custom subagents", by: "Claude Code docs", url: "https://code.claude.com/docs/en/sub-agents", note: "Frontmatter fields: tools, permissionMode, isolation, maxTurns, hooks." },
        { kind: "read", t: "Don't Build Multi-Agents", by: "Walden Yan, Cognition", date: "Jun 2025", url: "https://cognition.com/blog/dont-build-multi-agents", note: "Read before you write your contracts." },
        { kind: "repo", t: "Spec Kit", by: "GitHub", url: "https://github.com/github/spec-kit", note: "Specify, plan, tasks, implement. Borrow its spec and plan templates." },
        { kind: "docs", t: "Specs", by: "Kiro", url: "https://kiro.dev/docs/specs/", note: "requirements.md with EARS acceptance criteria, design.md, tasks.md." },
        { kind: "course", t: "Introduction to subagents", by: "Anthropic Academy", url: "https://anthropic.skilljar.com/introduction-to-subagents" }
      ]
    },

    {
      id: "m3", when: "Week 3", title: "Your own orchestrator: spec → tests → code → draft PR",
      hours: "30-40 h (pair)",
      goal: "Replace the Claude Code prototype with your own orchestrator. Planner, tester and implementer run as separate agents with validated hand-offs, the run survives a crash, and a passing run opens a draft PR on GitHub.",
      build: [
        "Write the orchestrator as an explicit state machine (<code>PLAN → WRITE_TESTS → IMPLEMENT → VERIFY → PR</code>) that persists <code>runs/&lt;id&gt;/state.json</code> after every stage. Use the <a data-cc=\"agent-sdk\">Agent SDK</a> (one <code>query()</code> per agent with its own <code>allowed_tools</code>, <code>max_turns</code> and <code>max_budget_usd</code>) or extend your week-1 loop. Keep the code path the same for single-agent and multi-agent runs so the comparison is fair.",
        "Tester agent: reads only the spec and the public API, writes acceptance tests per AC. Gate: the new tests must fail on the base commit, or the stage is retried. This stops tests that pass no matter what.",
        "Implementer agent: works in its own worktree inside the sandbox, sees the plan and the failing tests, cannot edit <code>tests/</code>. On red tests it gets the failing output back, up to 2 retries.",
        "Verify stage: apply the patch to a pristine checkout and run the full suite there, so edits to config, caches or conftest files in the agent's workspace cannot fake a pass.",
        "Progress file: each agent appends to <code>runs/&lt;id&gt;/progress.md</code> what it did and what is left, as in Anthropic's long-running harness. <code>--resume</code> restarts from the last completed stage.",
        "PR stage: push the branch to a sandbox GitHub repo and run <code>gh pr create --draft</code> with a body built from the spec, plan, test report, cost and trace path.",
        "Run the 10 tasks, 3 times each, single vs pipeline."
      ],
      deliver: [
        "<code>pipeline/</code> with the orchestrator and three agents, runnable as <code>python -m pipeline run &lt;task&gt;</code>.",
        "At least 3 draft PRs on your sandbox repo opened by the pipeline, each with the generated body.",
        "<code>RESULTS.md</code> row 2: single vs pipeline, pass@1, pass^3, median cost, median wall time, per-agent cost split."
      ],
      measure: [
        "0 schema failures reach a downstream agent (invalid outputs are caught and retried at the boundary).",
        "Tester gate: 100% of accepted test sets fail on base.",
        "A run killed mid-implementation resumes and finishes without redoing the plan or the tests.",
        "Pipeline pass@1 and cost are reported next to the single-agent baseline, with the same model and step limits."
      ],
      test: {
        code: { lang: "bash", title: "Week 3 checks", text: "python -m pipeline run bench/tasks/t04 --open-pr\n# PLAN ok (1 retry)  WRITE_TESTS ok (3 tests, 3 fail on base)\n# IMPLEMENT ok (attempt 2)  VERIFY f2p 3/3 p2p 34/34\n# PR https://github.com/<you>/toyrepo-sandbox/pull/<n>\n\n# crash and resume\npython -m pipeline run bench/tasks/t07 & sleep 60; kill -9 $!\npython -m pipeline run bench/tasks/t07 --resume\n# resuming at IMPLEMENT (PLAN, WRITE_TESTS reused)\n\npython bench/run.py --agent pipeline --tasks bench/tasks/ --n 3\npython bench/compare.py bench/results/*-single.json bench/results/*-pipeline.json" },
        checks: [
          "<code>compare.py</code> prints both agents on the same tasks with pass@1, pass^3, median cost and a per-task win/loss table.",
          "Swap the gold patch for an empty patch: the verify stage fails the run. Add a <code>conftest.py</code> that skips all tests to the agent's workspace: the pristine-checkout verify still fails it.",
          "The PR body contains the spec's AC list with a pass/fail mark per AC.",
          "<code>state.json</code> after resume shows the reused stages with their original timestamps."
        ]
      },
      cc: ["agent-sdk", "subagents", "checkpoints", "memory", "cost-tracking", "sandboxing"],
      resources: [
        { kind: "read", t: "Effective harnesses for long-running agents", by: "Anthropic Engineering", date: "Nov 2025", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents", note: "Initializer agent, feature list marked failing, claude-progress.txt, init.sh." },
        { kind: "docs", t: "Agent SDK: Python reference", by: "Claude Code docs", url: "https://code.claude.com/docs/en/agent-sdk/python", note: "ClaudeAgentOptions, AgentDefinition, ResultMessage.total_cost_usd." },
        { kind: "docs", t: "Agent SDK: subagents", by: "Claude Code docs", url: "https://code.claude.com/docs/en/agent-sdk/subagents" },
        { kind: "read", t: "Building agents with the Claude Agent SDK", by: "Anthropic", date: "Sep 2025", url: "https://claude.com/blog/building-agents-with-the-claude-agent-sdk", note: "Gather context, act, verify. Rules-based checks before LLM judges." },
        { kind: "docs", t: "Handoffs", by: "OpenAI Agents SDK", url: "https://openai.github.io/openai-agents-python/handoffs/", note: "A different hand-off model (transfer of control) to compare with yours." }
      ]
    },

    {
      id: "m4", when: "Week 4", title: "Reviewer agent, policy gates and anti-gaming checks",
      hours: "30-40 h (pair)",
      goal: "Add a reviewer that catches what tests miss, measure it on planted defects, and close the ways an agent can pass tests without doing the work.",
      build: [
        "Deterministic gates first, as scripts the orchestrator runs (and as <a data-cc=\"hooks\">hooks</a> in the Claude Code prototype): ruff, mypy or tsc, diff only inside <code>allowed_paths</code>, <code>tests/</code> untouched by the implementer, no new dependencies unless the spec allows them, diff size cap.",
        "Write <code>POLICY.md</code>: 10-15 checkable rules (secrets, error handling, public API naming, tests for each AC, no skipped tests, no <code>TODO</code> left in changed lines).",
        "Reviewer agent: read-only tools, input is diff + spec + POLICY.md + test report, output is <code>Review</code> JSON with findings that cite file, line, rule or AC. <code>request_changes</code> sends findings back to the implementer once.",
        "Build a planted-defect set: 15 patches for your benchmark tasks, 10 with one known defect each (hardcoded secret, AC silently dropped, test marked skip, broad except, wrong file touched, off-by-one the tests miss) and 5 clean gold patches.",
        "Add anti-gaming checks from the benchmark world: grade on a pristine checkout, diff the test files, reject patches that edit CI config, search the trace for reads of hidden test paths.",
        "Rerun the benchmark with the reviewer in the loop."
      ],
      deliver: [
        "<code>gates/</code>, <code>POLICY.md</code>, <code>pipeline/reviewer.py</code>.",
        "<code>bench/review_set/</code> with 15 labelled patches and <code>bench/review_eval.py</code>.",
        "<code>RESULTS.md</code> row 3 with reviewer precision and recall, and the pipeline pass rate with and without the reviewer."
      ],
      measure: [
        "Reviewer recall on planted defects ≥ 8/10; false alarms on the 5 clean patches ≤ 1.",
        "Every finding cites a file and line that exist in the diff (0 hallucinated locations).",
        "Deterministic gates catch 100% of the defects they are designed for (test edits, out-of-scope files) before the reviewer runs.",
        "Pass rate change from adding the reviewer is reported, including tasks it broke."
      ],
      test: {
        code: { lang: "bash", title: "Week 4 checks", text: "python bench/review_eval.py bench/review_set/ --n 3\n# patch                   label        verdict           finding_ok\n# t02-secret              defect       request_changes   yes\n# t05-gold                clean        approve           -\n# recall 9/10  false_alarms 1/5  located_findings 100%\n\npython -m gates.check --diff runs/<id>/patch.diff --spec bench/tasks/t04/spec.md\n# ruff ok  types ok  paths ok  tests_untouched FAIL (tests/test_core.py modified)\n\npython bench/run.py --agent pipeline --reviewer on  --tasks bench/tasks/ --n 3\npython bench/run.py --agent pipeline --reviewer off --tasks bench/tasks/ --n 3" },
        checks: [
          "The review eval runs 3 times per patch and reports how often the verdict flips between runs.",
          "A patch that deletes an assertion is caught by the gates or the reviewer; record which one.",
          "The reviewer never receives write tools: the tool list in its trace spans contains only read tools.",
          "You can show one real pipeline run where the reviewer's finding led to a fix that then passed."
        ]
      },
      cc: ["hooks", "permissions", "subagents", "claude-md", "github-actions"],
      resources: [
        { kind: "read", t: "Harness design for long-running application development", by: "Prithvi Rajasekaran, Anthropic Labs", date: "Mar 2026", url: "https://www.anthropic.com/engineering/harness-design-long-running-apps", note: "Why a separate evaluator beats self-review; sprint contracts between generator and evaluator." },
        { kind: "read", t: "Why SWE-bench Verified no longer measures frontier coding capabilities", by: "OpenAI", date: "Feb 2026", url: "https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/", note: "Flawed tests and contamination: what to check in your own tasks." },
        { kind: "read", t: "SWE-Bench Pro V2: a cleaner, harder-to-game leaderboard", by: "Scale Labs", url: "https://labs.scale.com/blog/swe-bench-pro-v2", note: "Re-grading every diff on a pristine image caught agents gaming the environment." },
        { kind: "docs", t: "Hooks guide", by: "Claude Code docs", url: "https://code.claude.com/docs/en/hooks-guide", note: "PreToolUse deny decisions, Stop and SubagentStop exit code 2." },
        { kind: "docs", t: "Code Review", by: "Claude Code docs", url: "https://code.claude.com/docs/en/code-review", note: "A production multi-agent PR reviewer to compare your reviewer against." }
      ]
    },

    {
      id: "m5", when: "Weeks 5-6", title: "Observability, budgets, parallel implementers, real repo, CI trigger",
      hours: "60-80 h (pair)",
      goal: "Make the pipeline something you could leave running: every run is traced and capped, failures roll back cleanly, independent tasks run in parallel, it works on a real repository, and labelling a GitHub issue starts it.",
      build: [
        "Tracing: one span per agent call with run id, agent, stage, tokens, cost, wall time, tool calls and outcome. Build a dashboard page with runs over time, cost per agent (stacked), pass rate by difficulty, and a run view that replays the hand-off documents in order.",
        "Budgets: a per-run USD cap and per-agent turn caps enforced by the orchestrator (and <code>max_budget_usd</code> per SDK call; see <a data-cc=\"cost-tracking\">cost tracking</a>). A runaway test: give the implementer an impossible spec and show the run stops at the cap with a clean <code>BUDGET_EXCEEDED</code> state.",
        "Rollback: any failed stage discards its worktree and branch and restores the last good state; the repo is left exactly as before the run. Compare with Claude Code <a data-cc=\"checkpoints\">checkpoints</a>, which rewind edits made with file tools but not files changed by Bash commands or by most subagents, so you still need git-based rollback.",
        "Parallel implementers: when the plan's tasks have disjoint file sets, run one implementer per task in its own worktree at the same time, then merge and run the full suite. When file sets overlap, run them in sequence. Log which path each run took.",
        "Real repository: fork one small open-source project with a fast test suite, build its sandbox image, and write 10 tasks for it from real closed issues or small features (with gold patches from the real commits where possible). Benchmark total: 25+ tasks.",
        "CI trigger: a GitHub Actions workflow that runs the pipeline when an issue gets the <code>agent</code> label, uses the issue body as the spec, and comments the PR link and cost back on the issue. Keep API keys in repository secrets. The Claude Code <a data-cc=\"github-actions\">GitHub Action</a> is a working reference for the same trigger.",
        "Model routing experiment: cheaper model for planner and tester, strong model for implementer and reviewer. Measure the cost and pass-rate change."
      ],
      deliver: [
        "Dashboard (static page or Streamlit) linked from the README, with a screenshot in the repo.",
        "25+ task benchmark across 2 repos, all passing <code>validate.py</code>.",
        "A labelled issue on your sandbox repo that produced a PR through Actions, visible in the Actions log.",
        "<code>RESULTS.md</code> row 4: single vs pipeline vs pipeline+parallel on 25 tasks, n=3, with cost min/median/max."
      ],
      measure: [
        "100% of runs appear in the dashboard; per-agent costs sum to the run total within 1%.",
        "Runaway test stops within 10% of the cap, 3 out of 3 times.",
        "After a forced failure in each stage, <code>git status</code> and <code>git worktree list</code> on the target repo match the pre-run state.",
        "Parallel runs report wall-time saving and any merge conflicts; tasks with overlapping files never run in parallel.",
        "Pass rate is reported per repo and per difficulty tier, with pass^3 next to pass@1."
      ],
      test: {
        code: { lang: "bash", title: "Weeks 5-6 checks", text: "python -m pipeline run bench/tasks/impossible-01 --budget-usd 0.50\n# IMPLEMENT stopped: BUDGET_EXCEEDED (spent $0.5x of $0.50)\n# rollback ok: worktrees removed 1, branches removed 1\n\npython tests/rollback_test.py --fail-at PLAN,WRITE_TESTS,IMPLEMENT,VERIFY,REVIEW\n# 5/5 stages: repo state identical to pre-run\n\npython bench/run.py --agent pipeline --parallel on --tasks bench/tasks/ --n 3\npython dashboard/build.py runs/ -o dashboard/index.html\n\ngh issue create --title \"Add CSV export\" --body-file specs/csv.md --label agent\ngh run watch    # workflow ends by commenting the PR link on the issue" },
        checks: [
          "The dashboard's total cost for a run equals the sum in its <code>trace.jsonl</code> and the SDK's reported <code>total_cost_usd</code> (within rounding).",
          "The Actions workflow uses repository secrets and has <code>permissions:</code> limited to what it needs (contents, pull-requests, issues).",
          "At least 5 of the 10 real-repo tasks are validated with gold patches from real commits.",
          "The routing experiment reports both cost and pass rate; a cheaper config that loses more than a few points of pass rate is reported as a loss, not a win."
        ]
      },
      cc: ["cost-tracking", "checkpoints", "github-actions", "headless", "subagents", "statusline"],
      resources: [
        { kind: "docs", t: "Run Claude Code GitHub Actions", by: "Claude Code docs", url: "https://code.claude.com/docs/en/github-actions", note: "Issue → PR in Actions; read how it scopes permissions." },
        { kind: "docs", t: "About GitHub Copilot cloud agent", by: "GitHub Docs", url: "https://docs.github.com/en/copilot/concepts/agents/cloud-agent/about-cloud-agent", note: "A production issue → PR agent: environment, limits, review flow." },
        { kind: "docs", t: "Codex cloud: agent internet access", by: "OpenAI", url: "https://developers.openai.com/codex/cloud/internet-access", note: "Setup phase with network, agent phase offline by default. Same idea as your sandbox." },
        { kind: "docs", t: "Track cost and usage (Agent SDK)", by: "Claude Code docs", url: "https://code.claude.com/docs/en/agent-sdk/cost-tracking" },
        { kind: "read", t: "Simon Willison on parallel agents", by: "Simon Willison", url: "https://simonwillison.net/tags/parallel-agents/", note: "Worktrees, and why review and merge become the bottleneck." }
      ]
    },

    {
      id: "m6", when: "Weeks 7-8", title: "Single vs multi-agent verdict, ablations, live defence run",
      hours: "60-80 h (pair)",
      goal: "Answer the project's real question with controlled experiments, write it up, and prove the system works on a spec you have never seen.",
      build: [
        "Ablation study on the full benchmark, n=3, same model and same total budget per task: (a) single agent, (b) single agent given the same spec, plan template and gates, (c) pipeline without tester, (d) pipeline without reviewer, (e) full pipeline, (f) full pipeline with parallel implementers. Add the Claude Code subagent prototype as a reference row.",
        "Report uncertainty: with 25-40 tasks, a few points of pass rate is inside the noise. Report per-task win/loss and a bootstrap confidence interval, not only the average.",
        "Failure taxonomy: label every failed run (30+) by root cause: spec ambiguity, plan wrong, tests wrong, implementation wrong, hand-off lost information, environment, budget. Link each label to its trace.",
        "Fix the top two causes and rerun. Keep the before/after rows.",
        "Try one protocol or harness upgrade and measure it: a dynamic workflow in Claude Code, A2A-style envelopes between agents, or a human-in-the-loop question channel.",
        "Defence prep that is still engineering: <code>make bench</code> from a fresh clone on a clean machine, a 3-minute demo video of issue → PR, and a live run on a spec the supervisor writes during the defence."
      ],
      deliver: [
        "<code>RESULTS.md</code> with all ablation rows, dated, with commit hashes; a chart of pass rate vs cost per configuration.",
        "<code>FAILURES.md</code>: the taxonomy table with counts and trace links.",
        "Post-mortem, 5-7 pages: when multiple agents helped, when they hurt, what each hand-off cost, and what you would build next.",
        "Demo video (3 min) and a rehearsed live run."
      ],
      measure: [
        "Every configuration is run on the same task list with the same budget; the report states the budget.",
        "Confidence intervals or per-task win/loss are shown for every comparison you draw a conclusion from.",
        "At least 30 failed runs are labelled and every label links to a trace.",
        "Fresh-clone <code>make bench</code> reproduces the headline numbers within the stated interval.",
        "MVD: the pipeline passes at least 3 benchmark tasks end to end with a PR; stronger projects report pass rate on 25+ tasks."
      ],
      test: {
        code: { lang: "bash", title: "Weeks 7-8 checks", text: "python bench/ablate.py --configs single,single+scaffold,no-tester,no-reviewer,full,full+parallel \\\n  --tasks bench/tasks/ --n 3 --budget-usd-per-task 1.00\npython bench/report.py bench/results/ablate-*.json --bootstrap 1000 -o report/ablation.md\n# config          pass@1  95% CI        median $/task  wins/losses vs single\n# single          ...     [..., ...]    ...            -\n# full            ...     [..., ...]    ...            k/m\n\npython bench/failures.py runs/ --labels FAILURES.md --check-links\n# 34 failed runs labelled, 0 missing traces\n\ngit clone <repo> /tmp/fresh && cd /tmp/fresh && make bench" },
        checks: [
          "<code>report.py</code> fails if two configurations were run on different task lists or budgets.",
          "The post-mortem contains a paragraph titled \"When a single agent was better\", with task ids.",
          "The live defence run starts from a spec file you did not write, and the PR, trace and cost are shown on screen.",
          "Each teammate can explain any hand-off contract and any gate without notes."
        ]
      },
      cc: ["agent-sdk", "subagents", "cost-tracking", "headless", "checkpoints"],
      resources: [
        { kind: "paper", t: "Coding Agents Have Converged: why the SWE-bench leaderboard can no longer order its top entries", by: "F. Liu et al., arXiv 2609.17394", date: "Sep 2026", url: "https://arxiv.org/abs/2609.17394", note: "Small score gaps are not separable; scores belong to the model + scaffold pair. Apply this to your own comparisons." },
        { kind: "docs", t: "Run agents in parallel", by: "Claude Code docs", url: "https://code.claude.com/docs/en/agents", note: "Subagents, agent view, agent teams, dynamic workflows, projects: who holds the plan in each." },
        { kind: "docs", t: "Orchestrate subagents at scale with dynamic workflows", by: "Claude Code docs", url: "https://code.claude.com/docs/en/workflows", note: "Orchestration as a script with agent(), parallel(), pipeline() and schemas. Compare with your orchestrator." },
        { kind: "docs", t: "Orchestrate teams of Claude Code sessions (agent teams)", by: "Claude Code docs", url: "https://code.claude.com/docs/en/agent-teams", note: "Experimental. Shared task list, mailbox, TaskCompleted hooks as quality gates." },
        { kind: "read", t: "Harness engineering: leveraging Codex in an agent-first world", by: "OpenAI", date: "Feb 2026", url: "https://openai.com/index/harness-engineering/", note: "What humans build when agents write the code: docs, checks, environment." }
      ]
    }
  ],

  stretch: [
    "Agent teams comparison: rebuild the pipeline as a Claude Code agent team (lead + teammates, <code>CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1</code>) with <code>TaskCompleted</code> hooks as gates, and compare pass rate and cost with your orchestrator on 10 tasks.",
    "Spec Kit front end: generate spec, plan and tasks with Spec Kit, convert them to your SpecIn and Plan contracts, and measure whether planner quality or pass rate changes.",
    "Human-in-the-loop channel: any agent may ask one blocking question (CLI or Slack) when the spec is ambiguous. Measure how many questions per run and whether answering them raises pass rate on your ambiguous-spec tasks.",
    "Cross-vendor baseline: run 10 of your tasks through GitHub Copilot cloud agent or Codex cloud as issues, and compare PR quality using your reviewer and your hidden tests.",
    "Terminal-Bench or SWE-bench Pro sample: run your single agent and your pipeline on 10-20 public tasks to check that your conclusions hold outside your own benchmark.",
    "Long-running mode: an initializer agent that turns a bigger spec into a feature list marked failing, then repeated pipeline runs that each close one feature, as in Anthropic's long-running harness."
  ],

  pitfalls: [
    "<strong>Tests that pass on the base commit.</strong> A task whose hidden tests already pass measures nothing. Run <code>validate.py</code> in CI and never add a task that has not passed it.",
    "Letting the implementer edit tests, conftest files or CI config. Agents will make tests pass the cheap way. Block it with a gate, and grade on a pristine checkout.",
    "Hand-offs as free text. If the planner writes prose, the implementer guesses. Validate every hand-off against a schema at the boundary and retry there, before the next agent runs.",
    "Comparing single vs multi-agent at different budgets or step limits. The team will usually spend more; compare at equal cost too, or the result means little.",
    "Parallel implementers editing the same file. Only parallelize tasks with disjoint file sets, decided by the planner, and log the merge.",
    "Sandbox with network on \"just for pip\". Bake dependencies into the image, keep <code>--network none</code> for the agent phase, and run as non-root. Codex cloud uses the same split: setup with network, agent phase offline.",
    "Reading only the pass rate. Read at least 10 traces a week. Most failures in this kind of pipeline come from specs and hand-offs, and you only see that in transcripts.",
    "A reviewer that approves everything. Measure it on planted defects and clean patches from week 4; an LLM reviewer with no recall numbers is decoration."
  ],

  mvd: [
    "Public GitHub repo with the orchestrator, all agents, the hand-off schemas, the sandbox setup and the benchmark.",
    "End-to-end pipeline demonstrated with a PR on at least 3 benchmark tasks.",
    "Single-agent vs multi-agent comparison on the same tasks and budget, with pass rate and cost.",
    "Dashboard or report with per-agent cost and time.",
    "Written post-mortem, 5-7 pages, with cost-per-PR numbers and a failure-mode analysis."
  ]
};
