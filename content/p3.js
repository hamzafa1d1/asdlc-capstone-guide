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
      id: "m1", when: "Week 1", title: "One agent solves a spec, sandboxed",
      hours: "30-40 h (pair)",
      goal: "By the end of the week, a single agent turns a short spec into passing hidden tests on a toy repo, inside a locked container. You also have 5 checked benchmark tasks and a script that scores any agent on them.",
      build: [
        "<strong>Write the toy target repo.</strong> A small Python library (500-800 lines, 30+ pytest tests) whose bugs and gaps you know.",
        "<strong>Build the sandbox.</strong> A <code>Dockerfile</code> with the repo's dependencies baked in and a non-root user. Run it with no network and only the task checkout mounted.",
        "<strong>Write the agent as a plain loop.</strong> About 150 lines: the model has one bash tool that runs commands inside the container, with long output cut and a step limit. This is your baseline for the whole project.",
        "<strong>Log every step.</strong> Append one line per model call to <code>runs/&lt;id&gt;/trace.jsonl</code>: tool input, exit code, tokens and cost.",
        "<strong>Create 5 benchmark tasks and a scorer.</strong> Each task has a spec with acceptance criteria (AC-1, AC-2...), hidden tests and a reference fix. <code>validate.py</code> checks the hidden tests fail before the fix and pass after. <code>run.py</code> prints pass rate, cost and steps."
      ],
      deliver: [
        "Public repo runnable with <code>make bench</code>.",
        "<code>RESULTS.md</code> row 0: single agent, 5 tasks × 3 runs.",
        "Two annotated traces: one solved task, one failed."
      ],
      measure: [
        "The validate script reports 5/5 tasks valid.",
        "Pass rate over 15 runs, median cost and steps are recorded with the commit hash.",
        "Every run has a trace file with one line per model call.",
        "At least 2 of the 5 tasks are solved at least once."
      ],
      test: {
        intro: "Run these from a fresh clone.",
        code: { lang: "bash", title: "Week 1 checks", text: "python bench/validate.py bench/tasks/     # expect: 5/5 tasks valid\npython bench/run.py --agent single --tasks bench/tasks/ --n 3\ndocker run --rm --network none sandbox:py312 python -c \"import urllib.request as u; u.urlopen('https://pypi.org')\"\n# expect: an error, non-zero exit" },
        checks: [
          "Make one hidden test pass before the fix on purpose: the validate script flags that task as invalid.",
                    "Search the traces for hidden test file names: 0 hits, so the agent never saw them."
        ]
      },
      extra: [
        "Tighten the container further: read-only root, <code>--cap-drop ALL</code>, a process limit and a memory limit.",
        "Run the same 5 tasks through Claude Code in <a data-cc=\"headless\">headless mode</a> (<code>claude -p --output-format json</code>) inside the container and keep its cost and turn count as a reference row.",
        "Report pass^3 (a task counts only if all 3 runs pass) next to the plain pass rate."
      ],
      lab: {
        id: "p3-lab-sandbox", title: "Prove your sandbox holds", time: "90 min", level: "Warm-up",
        goal: "Before any agent writes code, show with commands that a process in your container cannot reach the internet, cannot write outside <code>/workspace</code>, and is not root.",
        build: [
          "Write a Dockerfile from <code>python:3.12-slim</code> that creates a user <code>agent</code> (uid 1000) and installs pytest.",
          "Write <code>sandbox/run.sh</code> that starts the container with <code>--network none --read-only --tmpfs /tmp --user 1000:1000</code> and mounts <code>work/</code> at <code>/workspace</code>.",
          "Write <code>sandbox/escape_test.sh</code> that tries the four checks below inside the container and prints PASS or FAIL for each."
        ],
        verify: [
          "Fetching <code>https://example.com</code> fails: PASS.",
          "<code>touch /etc/pwned</code> fails with \"Read-only file system\": PASS.",
          "<code>touch /workspace/ok</code> works and the file appears in <code>work/</code> on your machine: PASS.",
          "<code>id -u</code> prints 1000: PASS."
        ],
        stretch: [
          "Allow exactly one host (your package mirror or the model API) through an egress proxy and prove every other host is still blocked.",
          "Run Claude Code itself under the sandbox runtime (<code>npx @anthropic-ai/sandbox-runtime claude</code>) and repeat the checks."
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
        { kind: "read", t: "Demystifying evals for AI agents", by: "Anthropic Engineering", date: "Jan 2026", url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", note: "pass@k vs pass^k, and why to start with 20-50 tasks from real failures." }
      ]
    },

    {
      id: "m2", when: "Week 2", title: "Try the team, then write contracts",
      hours: "30-40 h (pair)",
      goal: "By the end of the week, you have tried a four-role team (planner, tester, implementer, reviewer) in Claude Code, written each hand-off as a JSON Schema, and built your own planner that makes valid plans for 10 tasks.",
      build: [
        "<strong>Define four roles as subagents.</strong> One file each in <code>.claude/agents/</code>. Planner and reviewer are read-only, the tester writes only tests, the implementer gets its own git worktree (a separate checkout).",
        "<strong>Add two safety hooks.</strong> <a data-cc=\"hooks\">Hooks</a> are scripts Claude Code runs around tool calls. Block test edits and <code>git push</code> by the implementer, and keep the session working while tests fail.",
        "<strong>Run the 5 tasks through the team.</strong> Save each transcript. Note every place one role guessed something the previous role knew.",
        "<strong>Write the hand-off contracts.</strong> One JSON Schema per hand-off in <code>contracts/</code>: spec, plan, test plan, implementation report, test report, review. Specs get numbered criteria, allowed paths and a budget.",
        "<strong>Build your own planner.</strong> Spec in, <code>plan.json</code> out, checked against the schema and retried once with the error if invalid.",
        "<strong>Grow the benchmark to 10 tasks.</strong> Add 5, with at least 3 that touch two or more files."
      ],
      deliver: [
        "The subagents, hooks and 5 transcripts.",
        "<code>contracts/</code> and <code>ARCHITECTURE.md</code>: per hand-off, what it carries, who checks it, what happens on failure.",
        "Your planner and its 10 plans."
      ],
      measure: [
        "10/10 tasks pass the validate script.",
        "Planner output is valid for 10/10 specs, with at most one retry each.",
        "Every acceptance criterion in every spec is covered by a plan task.",
        "A scripted attempt to edit <code>tests/</code> is blocked by the hook."
      ],
      test: {
        code: { lang: "bash", title: "Week 2 checks", text: "pytest tests/contracts -q\npython -m pipeline.plan_all bench/tasks/ --report\n# expect: valid 10/10, uncovered ACs 0" },
        checks: [
          "Each schema rejects at least one broken example (missing field, wrong type).",
          "Asking the implementer subagent to change a test file ends in a permission denial.",
          "ARCHITECTURE.md names one decision you kept in a single role because splitting it caused conflicts."
        ]
      },
      extra: [
        "Write a spec linter that rejects specs with no acceptance criteria or vague ones such as \"make it faster\".",
        "Borrow spec and plan templates from GitHub Spec Kit or Kiro and compare them with your format.",
        "Add a <code>RESULTS.md</code> row: subagent team vs a single Claude Code session on the 10 tasks, same model, cost from <code>total_cost_usd</code>."
      ],
      lab: {
        id: "p3-lab-subagents", title: "Two implementers, two worktrees, no collisions", time: "2 h", level: "Warm-up",
        goal: "See worktree isolation and hooks work in Claude Code before you rebuild them in your own orchestrator.",
        build: [
          "Create <code>.claude/agents/implementer.md</code> with <code>isolation: worktree</code> and tools Read, Edit, Bash.",
          "Add a <code>PreToolUse</code> hook that logs every Bash command and its working directory to <code>hooks.log</code>.",
          "Ask Claude Code to run two implementer subagents in parallel on two independent benchmark specs."
        ],
        verify: [
          "<code>git worktree list</code> during the run shows two extra worktrees on separate branches.",
          "<code>hooks.log</code> shows each subagent's commands running only inside its own worktree.",
          "Two specs that edit the same function produce a merge conflict you can show. That is your argument for file ownership in the plan."
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
        { kind: "repo", t: "Spec Kit", by: "GitHub", url: "https://github.com/github/spec-kit", note: "Specify, plan, tasks, implement. Borrow its spec and plan templates." }
      ]
    },

    {
      id: "m3", when: "Week 3", title: "The pipeline opens its first PR",
      hours: "30-40 h (pair)",
      goal: "By the end of the week, your own orchestrator takes a spec through planner, tester and implementer, checks the result and opens a draft pull request, and you know how it compares with the week-1 agent.",
      build: [
        "<strong>Write the orchestrator as a state machine.</strong> Plan, write tests, implement, verify, PR. Save state after each stage so a crashed run can resume. Use the <a data-cc=\"agent-sdk\">Agent SDK</a> or your week-1 loop.",
        "<strong>Add the tester.</strong> It reads only the spec and writes tests per acceptance criterion. They must fail on the unchanged code, or the stage is retried.",
        "<strong>Add the implementer.</strong> It works in its own worktree inside the sandbox and cannot edit tests. On failure it gets the test output back, up to 2 retries.",
        "<strong>Verify on a clean copy.</strong> Apply the patch to a fresh checkout and run the full suite there, so workspace tricks cannot fake a pass.",
        "<strong>Open a draft PR.</strong> Push to a practice repo and run <code>gh pr create --draft</code> with spec, test results and cost in the body.",
        "<strong>Compare with the baseline.</strong> Run the 10 tasks 3 times each, single agent vs pipeline, same model and step limits."
      ],
      deliver: [
        "<code>pipeline/</code>, runnable as <code>python -m pipeline run &lt;task&gt;</code>.",
        "At least 3 draft PRs opened by the pipeline.",
        "<code>RESULTS.md</code> row 2: single vs pipeline, pass rate and cost."
      ],
      measure: [
        "No invalid hand-off reaches the next agent.",
        "100% of accepted test sets fail on the unchanged code.",
        "A run killed mid-implementation resumes without redoing the plan or tests.",
        "Both agents are compared on the same 10 tasks, task by task."
      ],
      test: {
        intro: "Run one task end to end, then crash one on purpose.",
        code: { lang: "bash", title: "Week 3 checks", text: "python -m pipeline run bench/tasks/t04 --open-pr\npython -m pipeline run bench/tasks/t07 & sleep 60; kill -9 $!\npython -m pipeline run bench/tasks/t07 --resume   # expect: resumes at IMPLEMENT" },
        checks: [
          "Replace a correct patch with an empty one: the verify stage fails the run.",
          "The PR body lists every acceptance criterion with a pass or fail mark.",
          "After resume, the state file shows the reused stages with their original timestamps."
        ]
      },
      extra: [
        "Have each agent append what it did and what is left to <code>progress.md</code>, as in Anthropic's long-running harness.",
        "Add a <code>conftest.py</code> that skips all tests to the agent's workspace and confirm the clean-copy verify still fails the run.",
        "Report cost per agent, not only per run."
      ],
      cc: ["agent-sdk", "subagents", "checkpoints", "memory", "cost-tracking", "sandboxing"],
      resources: [
        { kind: "read", t: "Effective harnesses for long-running agents", by: "Anthropic Engineering", date: "Nov 2025", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents", note: "Initializer agent, feature list marked failing, claude-progress.txt, init.sh." },
        { kind: "docs", t: "Agent SDK: Python reference", by: "Claude Code docs", url: "https://code.claude.com/docs/en/agent-sdk/python", note: "ClaudeAgentOptions, AgentDefinition, ResultMessage.total_cost_usd." },
        { kind: "read", t: "Building agents with the Claude Agent SDK", by: "Anthropic", date: "Sep 2025", url: "https://claude.com/blog/building-agents-with-the-claude-agent-sdk", note: "Gather context, act, verify. Rules-based checks before LLM judges." }
      ]
    },

    {
      id: "m4", when: "Week 4", title: "A reviewer that catches what tests miss",
      hours: "30-40 h (pair)",
      goal: "By the end of the week, every patch passes automatic checks and an LLM reviewer before it becomes a PR, and you know how many planted defects the reviewer catches.",
      build: [
        "<strong>Add automatic checks first.</strong> Scripts run on every patch: linter, type checker, only allowed paths changed, tests untouched, no new dependencies.",
        "<strong>Write the review rules.</strong> <code>POLICY.md</code> with 10-15 rules a reviewer can check, such as no secrets, no skipped tests, a test for each acceptance criterion.",
        "<strong>Add the reviewer agent.</strong> Read-only. It gets diff, spec, policy and test results, and returns approve or request changes, each finding citing a file and line. Changes go back to the implementer once.",
        "<strong>Build a planted-defect set.</strong> 15 patches: 10 with one known defect each (hardcoded secret, dropped criterion, skipped test, wrong file touched, a bug the tests miss) and 5 correct ones.",
        "<strong>Measure and rerun.</strong> Score the reviewer on the 15 patches, then run the benchmark with the reviewer on and off."
      ],
      deliver: [
        "<code>gates/</code>, <code>POLICY.md</code> and the reviewer.",
        "The 15 labelled patches and a script that scores the reviewer on them.",
        "<code>RESULTS.md</code> row 3: reviewer scores, pass rate with and without it."
      ],
      measure: [
        "The reviewer catches at least 8 of the 10 planted defects and flags at most 1 of the 5 correct patches.",
        "Every finding points to a file and line that exist in the diff.",
        "The automatic checks catch 100% of test edits and out-of-scope files before the reviewer runs.",
        "Tasks the reviewer broke are listed."
      ],
      test: {
        code: { lang: "bash", title: "Week 4 checks", text: "python bench/review_eval.py bench/review_set/ --n 3\n# expect a line like: caught 9/10  false_alarms 1/5\npython -m gates.check --diff runs/<id>/patch.diff --spec bench/tasks/t04/spec.md" },
        checks: [
          "A patch that edits a test file fails the gates with a clear message.",
          "The reviewer's trace shows only read tools.",
          "You can show one real run where a reviewer finding led to a fix that then passed."
        ]
      },
      extra: [
        "Report how often the reviewer's verdict flips across 3 runs on the same patch.",
        "Search every trace for reads of hidden test paths, and reject patches that edit CI config.",
        "Compare your reviewer with Claude Code's Code Review on the same 15 patches."
      ],
      cc: ["hooks", "permissions", "subagents", "claude-md", "github-actions"],
      resources: [
        { kind: "read", t: "Harness design for long-running application development", by: "Prithvi Rajasekaran, Anthropic Labs", date: "Mar 2026", url: "https://www.anthropic.com/engineering/harness-design-long-running-apps", note: "Why a separate evaluator beats self-review; sprint contracts between generator and evaluator." },
        { kind: "read", t: "Why SWE-bench Verified no longer measures frontier coding capabilities", by: "OpenAI", date: "Feb 2026", url: "https://openai.com/index/why-we-no-longer-evaluate-swe-bench-verified/", note: "Flawed tests and contamination: what to check in your own tasks." },
        { kind: "docs", t: "Hooks guide", by: "Claude Code docs", url: "https://code.claude.com/docs/en/hooks-guide", note: "PreToolUse deny decisions, Stop and SubagentStop exit code 2." }
      ]
    },

    {
      id: "m5", when: "Weeks 5-6", title: "Run it unattended on a real repo",
      hours: "60-80 h (pair)",
      goal: "By the end of week 6, labelling a GitHub issue on a real open-source fork produces a PR. Every run is traced and cost-capped, and failures leave the repo clean.",
      build: [
        "<strong>Trace and show every run.</strong> One record per agent call (stage, tokens, cost, time, outcome) and a dashboard page: cost per agent, pass rate by difficulty, one run's hand-offs.",
        "<strong>Cap the budget.</strong> The orchestrator stops a run that passes its dollar limit and records <code>BUDGET_EXCEEDED</code>. Test it with an impossible spec. See <a data-cc=\"cost-tracking\">cost tracking</a>.",
        "<strong>Roll back cleanly.</strong> A failed stage deletes its worktree and branch, so the repo looks exactly as it did before the run.",
        "<strong>Run implementers in parallel.</strong> When plan tasks touch different files, run them at the same time, then merge and test. Overlapping files run one after another.",
        "<strong>Add a real repository.</strong> Fork a small open-source project with fast tests and write 10 tasks from real closed issues. Total: 25+ tasks.",
        "<strong>Start runs from GitHub.</strong> A GitHub Actions workflow runs the pipeline when an issue gets the <code>agent</code> label and comments the PR link back."
      ],
      deliver: [
        "Dashboard linked from the README, with a screenshot.",
        "A labelled issue that produced a PR through Actions.",
        "<code>RESULTS.md</code> row 4: single vs pipeline vs parallel pipeline on 25+ tasks, 3 runs each."
      ],
      measure: [
        "Per-agent costs in the dashboard add up to the run total within 1%.",
        "The impossible spec stops within 10% of the cap, 3 out of 3 times.",
        "After a forced failure at each stage, <code>git status</code> matches the pre-run state.",
        "Time saved by parallel runs is reported."
      ],
      test: {
        code: { lang: "bash", title: "Weeks 5-6 checks", text: "python -m pipeline run bench/tasks/impossible-01 --budget-usd 0.50\n# expect: BUDGET_EXCEEDED, rollback ok\ngh issue create --title \"Add CSV export\" --body-file specs/csv.md --label agent\ngh run watch" },
        checks: [
          "The workflow ends with a comment on the issue linking the PR.",
          "A run's cost in the dashboard equals the sum in its trace file."
        ]
      },
      extra: [
        "Model routing: a cheaper model for planner and tester, a strong one for implementer and reviewer. Report cost and pass rate; a cheaper setup that loses pass rate is a loss.",
        "Compare your rollback with Claude Code <a data-cc=\"checkpoints\">checkpoints</a>, which do not undo files changed by Bash commands.",
        "Take reference fixes for the real-repo tasks from the project's real commits."
      ],
      cc: ["cost-tracking", "checkpoints", "github-actions", "headless", "subagents", "statusline"],
      resources: [
        { kind: "docs", t: "Run Claude Code GitHub Actions", by: "Claude Code docs", url: "https://code.claude.com/docs/en/github-actions", note: "Issue → PR in Actions; read how it scopes permissions." },
        { kind: "docs", t: "Track cost and usage (Agent SDK)", by: "Claude Code docs", url: "https://code.claude.com/docs/en/agent-sdk/cost-tracking" },
        { kind: "read", t: "Simon Willison on parallel agents", by: "Simon Willison", url: "https://simonwillison.net/tags/parallel-agents/", note: "Worktrees, and why review and merge become the bottleneck." }
      ]
    },

    {
      id: "m6", when: "Weeks 7-8", title: "Single or multi-agent: the verdict",
      hours: "60-80 h (pair)",
      goal: "By the end of week 8, you can show with evidence when your pipeline beats a single agent and why runs fail, and it passes a live run on an unseen spec.",
      build: [
        "<strong>Run the ablations.</strong> An ablation removes one part to see its value. All 25+ tasks, 3 runs, same model and budget: single, no tester, no reviewer, full, full in parallel.",
        "<strong>Show the uncertainty.</strong> On 25 tasks a few points is noise. Report per-task wins and losses and a bootstrap confidence interval (resample tasks, see how the average moves).",
        "<strong>Label every failure.</strong> Give each failed run a root cause (spec, plan, tests, code, hand-off, environment, budget) and link its trace.",
        "<strong>Fix the top two causes and rerun.</strong> Keep the before and after rows.",
        "<strong>Prepare the defence.</strong> <code>make bench</code> works from a fresh clone, a 3-minute demo video of issue to PR, and a rehearsed live run on a spec the supervisor writes."
      ],
      deliver: [
        "<code>RESULTS.md</code> with all ablations and a pass rate vs cost chart.",
        "<code>FAILURES.md</code>: failure causes with counts and trace links.",
        "Post-mortem, 5-7 pages, including a section \"When a single agent was better\" with task ids.",
        "Demo video."
      ],
      measure: [
        "Every configuration ran on the same task list and budget, and the report states both.",
        "At least 30 failed runs are labelled, each with a trace link.",
        "A fresh clone reproduces the headline numbers within the stated interval."
      ],
      test: {
        code: { lang: "bash", title: "Weeks 7-8 checks", text: "python bench/ablate.py --configs single,no-tester,no-reviewer,full,full+parallel --n 3 --budget-usd-per-task 1.00\npython bench/report.py bench/results/ablate-*.json --bootstrap 1000\ngit clone <repo> /tmp/fresh && cd /tmp/fresh && make bench" },
        checks: [
          "The report script refuses to compare runs made on different task lists or budgets.",
          "Every failure label links to a trace that exists.",
          "Each teammate can explain any hand-off contract and any check without notes."
        ]
      },
      extra: [
        "Add a \"single agent with the same spec format, plan template and checks\" row to separate the value of the scaffolding from the value of splitting roles.",
        "Try one harness upgrade and measure it: a Claude Code dynamic workflow, structured message envelopes between agents, or a channel where an agent can ask a human one question.",
        "Run the model-routing experiment from weeks 5-6 inside the ablation table."
      ],
      cc: ["agent-sdk", "subagents", "cost-tracking", "headless", "checkpoints"],
      resources: [
        { kind: "paper", t: "Coding Agents Have Converged: why the SWE-bench leaderboard can no longer order its top entries", by: "F. Liu et al., arXiv 2609.17394", date: "Sep 2026", url: "https://arxiv.org/abs/2609.17394", note: "Small score gaps are not separable; scores belong to the model + scaffold pair. Apply this to your own comparisons." },
        { kind: "docs", t: "Run agents in parallel", by: "Claude Code docs", url: "https://code.claude.com/docs/en/agents", note: "Subagents, agent view, agent teams, dynamic workflows, projects: who holds the plan in each." },
        { kind: "docs", t: "Orchestrate subagents at scale with dynamic workflows", by: "Claude Code docs", url: "https://code.claude.com/docs/en/workflows", note: "Orchestration as a script with agent(), parallel(), pipeline() and schemas. Compare with your orchestrator." }
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
