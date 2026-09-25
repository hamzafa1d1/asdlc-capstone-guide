/* Content for the ASDLC Capstone Guide.
   Edit this file to update the guide — app.js only renders it. */

window.GUIDE = {
  docUrl: "https://docs.google.com/document/d/1vXNRej6hJEaWrtFM7qIWMgIDCAGHGPS0MogUjb9GLoE/edit?usp=sharing",
  supervisor: "Hamza Faidi",
  lastVerified: "25 September 2026",

  /* ---------------------------------------------------------------
     SHARED FLOW — every team goes through these first
  --------------------------------------------------------------- */
  shared: [
    {
      id: "start",
      num: "01",
      title: "Start here",
      kicker: "Orientation · 10 min",
      summary: "What this guide is, how the next two months are organised, and what every team ships at the end.",
      blocks: [
        { type: "lead", html: "You are building a <strong>portfolio-grade agentic AI system</strong> in a pair, over roughly one month of focused work plus a second month for evaluation depth and polish. This guide walks you through it step by step. You can jump to any section at any time — the checkmarks are there to help you, not to lock you in." },
        { type: "timeline", items: [
          { when: "Week 1", what: "Walking skeleton — something ugly that runs end to end, in a public repo." },
          { when: "Week 2", what: "The real core loop, with the first guardrails and the first Skill." },
          { when: "Week 3", what: "Evals and iteration — numbers, not adjectives." },
          { when: "Week 4", what: "Harden, ship, record the demo." },
          { when: "Month 2", what: "Stretch goals, eval depth, post-mortem, defence." }
        ]},
        { type: "callout", tone: "info", title: "The official project definitions", html: "Everything here expands on the document shared with the Head of Department. When this guide and the document disagree, <strong>the document wins</strong>. <a data-doc target=\"_blank\" rel=\"noopener\">Open “ASDLC Capstone Projects” on Google Drive ↗</a>" },
        { type: "h", text: "How to use this guide" },
        { type: "list", items: [
          "<strong>Follow the numbered path</strong> in the sidebar: shared steps first (tools, concepts, common primitives), then your own project track.",
          "Each project is split into <strong>milestones</strong>. Each milestone says what to <em>build</em>, what to <em>deliver</em>, and how to <em>measure</em> that it is done.",
          "Tick the measure checkboxes as you go. Progress is saved <strong>in your browser only</strong> — use it as a personal tracker, not as a submission.",
          "Every claim about industry comes with a source. Read the sources; they are the real curriculum."
        ]},
        { type: "h", text: "Ground rules" },
        { type: "list", items: [
          "<strong>Public repository from day one.</strong> Your Git history should tell the story of the build.",
          "<strong>Evals are written before or alongside the code</strong>, never backfilled at the end.",
          "<strong>Observability in week 1 or 2</strong>, never later.",
          "<strong>Never commit an API key.</strong> Use a <code>.env</code> file listed in <code>.gitignore</code>.",
          "Weekly check-in on the team Slack channel: what shipped, what broke, the current numbers, what is next."
        ]}
      ]
    },

    {
      id: "tools",
      num: "02",
      title: "Your free AI toolkit",
      kicker: "Setup · 1–2 h",
      summary: "Free harnesses to build with, and free model APIs for your product to call — as of September 2026.",
      blocks: [
        { type: "lead", html: "You need two different things: a <strong>coding harness</strong> (an agent that helps <em>you</em> build) and a <strong>model API</strong> (the LLM <em>your product</em> calls). Free tiers change often — the limits below were checked on the date at the bottom of this page. Always confirm in the provider's own console." },
        { type: "callout", tone: "warn", title: "Changed in 2026", html: "The free Gemini CLI tier for personal accounts <strong>ended on 18 June 2026</strong> (Google moved it to Antigravity CLI). Qwen Code's free hosted login ended in April 2026. Tutorials older than that may point you to tools that are no longer free. <a href=\"https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/\" target=\"_blank\" rel=\"noopener\">Google's announcement ↗</a>" },
        { type: "h", text: "A. Coding harnesses — to help you build" },
        { type: "tools", items: [
          { name: "GitHub Copilot — Student plan", tag: "Recommended first", free: "Free for verified students", limits: "Unlimited code completions · Auto model selection · 200 AI credits / month (since 1 June 2026) · agent mode in VS Code", how: "Verify your student status through the GitHub Student Developer Pack, then enable Copilot in VS Code.", links: [
            { t: "GitHub Student Developer Pack", url: "https://education.github.com/pack" },
            { t: "Student plan changes (GitHub, 2026)", url: "https://github.com/orgs/community/discussions/189268" }
          ]},
          { name: "OpenCode", tag: "Open source", free: "Free CLI + rotating free models", limits: "Terminal/IDE agent. The Zen gateway offers several free models for a limited time (some collect data for training). Can also run any provider or a local model.", how: "Install the CLI, pick a free Zen model or plug in one of the free APIs below.", links: [
            { t: "opencode.ai", url: "https://opencode.ai/" },
            { t: "Zen — current free models", url: "https://opencode.ai/docs/zen/" }
          ]},
          { name: "Google Antigravity", tag: "IDE + CLI", free: "Individual tier: $0", limits: "Unlimited tab completions; autonomous agent runs capped by a weekly quota. Google has reduced the free limits several times — treat it as a bonus, not your only tool.", how: "Download from antigravity.google and sign in with a Google account.", links: [
            { t: "Antigravity pricing analysis (Sep 2026)", url: "https://www.cloudzero.com/blog/google-antigravity-pricing/" }
          ]},
          { name: "Ollama (local models)", tag: "Offline", free: "Free, runs on your laptop", limits: "No rate limits, no data leaves your machine. Quality and speed depend on your RAM/GPU — small models (7–14B) are fine for dev loops and tests.", how: "Install Ollama, pull a small model, and point OpenCode or your code at localhost.", links: [
            { t: "ollama.com", url: "https://ollama.com/" }
          ]}
        ]},
        { type: "h", text: "B. Model APIs — for your product to call" },
        { type: "table", head: ["Provider", "What you get free", "Watch out for"], rows: [
          ["<a href=\"https://aistudio.google.com/\" target=\"_blank\" rel=\"noopener\">Google AI Studio</a> (Gemini API)", "Free tier on Gemini models, large context windows. Exact limits shown in your <a href=\"https://aistudio.google.com/rate-limit\" target=\"_blank\" rel=\"noopener\">rate-limit page</a>.", "Free-tier prompts may be used to improve Google products outside the EU/UK."],
          ["<a href=\"https://console.groq.com/docs/rate-limits\" target=\"_blank\" rel=\"noopener\">Groq</a>", "Very fast open models. e.g. GPT-OSS 120B: 30 req/min, 1,000 req/day, 200K tokens/day.", "Limits are per organisation, not per user — share carefully."],
          ["<a href=\"https://docs.github.com/en/github-models/use-github-models/prototyping-with-ai-models\" target=\"_blank\" rel=\"noopener\">GitHub Models</a>", "Free prototyping with your GitHub account: 150 req/day (low tier), 50 req/day (high tier), embeddings included.", "8K input / 4K output tokens per request — too small for big diffs or long contexts."],
          ["<a href=\"https://openrouter.ai/models?q=free\" target=\"_blank\" rel=\"noopener\">OpenRouter</a>", "20+ free models behind one API: 50 req/day, 1,000 req/day after a one-time $10 credit.", "Free models rotate; pin a model ID in config and have a fallback."],
          ["<a href=\"https://ollama.com/\" target=\"_blank\" rel=\"noopener\">Ollama</a> (local)", "Unlimited, private.", "Slower; weaker than frontier models — do not tune your prompts only on a local model."]
        ]},
        { type: "source", html: "Free-tier overview: <a href=\"https://openrouter.ai/blog/tutorials/free-llm-apis-compared/\" target=\"_blank\" rel=\"noopener\">OpenRouter — Free LLM APIs compared (June 2026)</a>." },
        { type: "h", text: "Make the free tiers last" },
        { type: "list", items: [
          "<strong>Cache model responses</strong> during eval runs (key = prompt hash). Re-running an unchanged eval should cost zero requests.",
          "<strong>Use a small model while developing</strong>, a stronger one for the eval runs you report.",
          "<strong>Put a hard budget cap in code</strong> (max requests / tokens per run). A loop bug can empty a daily quota in minutes.",
          "<strong>Never send secrets or private data</strong> to a free tier that may train on it.",
          "Log tokens in and out for every call from day one — you will need the cost numbers for the report."
        ]},
        { type: "checklist", id: "tools-ready", title: "You are ready when", items: [
          "Each teammate has a working coding harness (Copilot Student, OpenCode, or Antigravity).",
          "You made one successful API call from code to at least two different providers (one primary, one fallback).",
          "API keys live in .env, and .env is in .gitignore.",
          "You wrote down in the README which model(s) you use and their free-tier limits."
        ]}
      ]
    },

    {
      id: "concepts",
      num: "03",
      title: "Core concepts",
      kicker: "Reading · 3–4 h over week 1",
      summary: "What an LLM, an agent and a harness actually are — with the best primary sources to read and watch.",
      blocks: [
        { type: "lead", html: "You don't need to read everything today. Read the <strong>definitions</strong> now, then work through the <strong>essential reading</strong> during week 1. The rest is reference material for when you hit that part of the build." },
        { type: "equation", html: "<span>Agent</span> <em>=</em> <span>Model</span> <em>+</em> <span>Harness</span>" },
        { type: "defs", items: [
          { term: "Large Language Model (LLM)", def: "A neural network trained to predict the next token of text. Given a sequence of tokens it outputs a probability distribution over the next one; generation is repeated sampling from that distribution. Everything else (chat, tool use, reasoning) is built on this one operation.", src: { t: "3Blue1Brown — LLMs explained briefly", url: "https://www.3blue1brown.com/lessons/mini-llm/" } },
          { term: "Token & context window", def: "Models read and write tokens (word pieces). The context window is the maximum number of tokens the model can see at once — its entire working memory for a call. You pay per token, in and out.", src: { t: "Karpathy — Intro to LLMs (video)", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g" } },
          { term: "Context engineering", def: "Choosing what goes into the context window on each call — instructions, retrieved documents, tool results, memory — so the model has exactly what it needs and nothing that distracts it. It has largely replaced “prompt engineering” as the core skill.", src: { t: "Anthropic — Effective context engineering", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents" } },
          { term: "Agent", def: "An LLM that uses tools in a loop: it decides on an action, the environment executes it, the result comes back into the context, and it decides again — until the task is done or a stop condition fires.", src: { t: "Anthropic — Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents" } },
          { term: "Harness", def: "Everything around the model that turns it into a dependable agent: the loop, the tools and their permissions, the sandbox, the rule files, memory and progress files, guardrails, budget caps and observability. Same model, different harness, very different results — that is the “harness effect” you will measure.", src: { t: "OpenAI — Harness engineering", url: "https://openai.com/index/harness-engineering/" } },
          { term: "Tools & MCP", def: "A tool is a function the model can ask the harness to call (read a file, fetch a PR diff, query a database). The Model Context Protocol (MCP) is an open standard for exposing tools and data to any agent, so you couple to a protocol instead of a vendor.", src: { t: "modelcontextprotocol.io", url: "https://modelcontextprotocol.io/" } },
          { term: "AGENTS.md & Skills", def: "AGENTS.md is a plain Markdown file at the root of a repo that tells coding agents the project's rules. A Skill is a portable folder with a SKILL.md (name, description, instructions, optional scripts) that an agent loads only when the task needs it.", src: { t: "agents.md · agentskills.io", url: "https://agentskills.io/" } },
          { term: "RAG (retrieval-augmented generation)", def: "Retrieve relevant passages from your own corpus and put them in the context before the model answers, so answers are grounded in sources you control and can cite.", src: { t: "Lewis et al., 2020 (Facebook AI Research)", url: "https://arxiv.org/abs/2005.11401" } },
          { term: "Evals", def: "An automated test suite for an AI system: a fixed set of inputs, expected behaviour, and a scoring method. Evals are how you know whether a change made things better or worse — they are the contract between you and your users.", src: { t: "Hamel Husain — Your AI product needs evals", url: "https://hamel.dev/blog/posts/evals/" } },
          { term: "Observability", def: "Traces of every model call, tool call and retrieval, with latency, tokens and cost — so you can find out why one specific answer was wrong at 14:37 yesterday.", src: { t: "Langfuse docs", url: "https://langfuse.com/docs" } },
          { term: "Multi-agent & A2A", def: "Several agents with separate contexts that hand work to each other. The Agent2Agent (A2A) protocol, now under the Linux Foundation, standardises how agents describe themselves and exchange tasks.", src: { t: "a2a-protocol.org", url: "https://a2a-protocol.org/latest/" } }
        ]},
        { type: "h", text: "Essential reading — everyone, week 1" },
        { type: "resources", items: [
          { kind: "read", t: "Building effective agents", by: "Anthropic", url: "https://www.anthropic.com/engineering/building-effective-agents", note: "Workflows vs agents, and the five core patterns. Start here." },
          { kind: "read", t: "Effective context engineering for AI agents", by: "Anthropic", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", note: "Why what you put in the context matters more than clever prompts." },
          { kind: "read", t: "Harness engineering: leveraging Codex in an agent-first world", by: "OpenAI · Feb 2026", url: "https://openai.com/index/harness-engineering/", note: "A 3–7 person team shipped ~1M lines in ~5 months with agents writing all of the code — by engineering the harness." },
          { kind: "read", t: "Effective harnesses for long-running agents", by: "Anthropic · Nov 2025", url: "https://anthropic.com/engineering/effective-harnesses-for-long-running-agents", note: "Initializer agent, progress files, incremental commits." },
          { kind: "pdf", t: "A practical guide to building agents", by: "OpenAI", url: "https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf", note: "Short PDF: tools, instructions, orchestration, guardrails." },
          { kind: "read", t: "Your AI product needs evals", by: "Hamel Husain", url: "https://hamel.dev/blog/posts/evals/", note: "The most practical introduction to evals." }
        ]},
        { type: "h", text: "Watch" },
        { type: "resources", items: [
          { kind: "video", t: "Large Language Models explained briefly", by: "3Blue1Brown · 8 min", url: "https://www.youtube.com/watch?v=LPZh9BOjkQs", note: "The clearest visual intuition for what an LLM does." },
          { kind: "video", t: "[1hr Talk] Intro to Large Language Models", by: "Andrej Karpathy", url: "https://www.youtube.com/watch?v=zjkBMFhNj_g", note: "Pre-training, fine-tuning, tool use, security." },
          { kind: "video", t: "Software Is Changing (Again)", by: "Andrej Karpathy · YC AI Startup School", url: "https://www.youtube.com/watch?v=LCEmiRjPEtQ", note: "Software 3.0 and why partial autonomy + fast human verification wins." },
          { kind: "video", t: "How We Build Effective Agents", by: "Barry Zhang, Anthropic · AI Engineer", url: "https://www.youtube.com/watch?v=D7_ipDqhtwk", note: "When not to build an agent, and keeping them simple." },
          { kind: "video", t: "Building Agents with Model Context Protocol — full workshop", by: "Mahesh Murag, Anthropic", url: "https://www.youtube.com/watch?v=kQmXtrmQ5Zg", note: "MCP from first principles to building servers." }
        ]},
        { type: "h", text: "Go deeper (optional)" },
        { type: "resources", items: [
          { kind: "read", t: "LLM Powered Autonomous Agents", by: "Lilian Weng", url: "https://lilianweng.github.io/posts/2023-06-23-agent/", note: "Classic survey: planning, memory, tool use." },
          { kind: "read", t: "Equipping agents for the real world with Agent Skills", by: "Anthropic", url: "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills", note: "Why skills use progressive disclosure." },
          { kind: "read", t: "AI Evals: everything you need to know (FAQ)", by: "Hamel Husain & Shreya Shankar", url: "https://hamel.dev/blog/posts/evals-faq/", note: "Answers to the questions you will have in week 3." }
        ]},
        { type: "checklist", id: "concepts-ready", title: "You are ready when you can explain, without notes", items: [
          "The difference between a workflow and an agent, and why you would pick one over the other.",
          "What a harness adds to a model, with three concrete examples from your own project.",
          "What an eval is and what metric your project will report.",
          "What MCP standardises, and which MCP server your project will use (if any)."
        ]}
      ]
    },

    {
      id: "primitives",
      num: "04",
      title: "Common building blocks",
      kicker: "Applies to every project",
      summary: "The five artefacts every team produces, whatever the project — so cross-team peer review works.",
      blocks: [
        { type: "lead", html: "All projects deliberately use the same building blocks. Keep these in mind from week 1 — they carry <strong>40% of the grade</strong> through the “Context & harness” and “Eval discipline” criteria." },
        { type: "primitives", items: [
          { t: "AGENTS.md rule file", d: "Governs how your agent behaves: conventions, always/never lists, what to do when unsure. Versioned in Git — the diff history shows how you tuned it.", done: "It has changed at least 3 times, and each change is linked to an eval result.", src: { t: "agents.md", url: "https://agents.md/" } },
          { t: "At least one packaged Skill", d: "A portable folder with a SKILL.md (name + description + instructions, optional scripts). It must work when copied into another project.", done: "You copied it into a second repo and it worked without edits.", src: { t: "Agent Skills specification", url: "https://agentskills.io/" } },
          { t: "A harness", d: "Tool scoping (least privilege), a sandbox for anything that executes code, guardrails (hard limits and refusals), and observability — wired in from day one.", done: "You can show each of the four in a demo, and a test proves each guardrail fires.", src: { t: "OpenAI — Harness engineering", url: "https://openai.com/index/harness-engineering/" } },
          { t: "An eval suite (20+ items)", d: "Stored in the repo and runnable with one command. Numbers reported at three points: baseline, mid-iteration, final.", done: "RESULTS.md has a table with 3 dated rows and the commit hash for each.", src: { t: "Hamel Husain — evals", url: "https://hamel.dev/blog/posts/evals/" } },
          { t: "A written post-mortem", d: "What worked, what broke, what you'd change, and how much it cost to run. Numbers, not adjectives.", done: "A hiring manager could read it and believe your “what we would do next” section.", src: null }
        ]},
        { type: "h", text: "Suggested repository layout" },
        { type: "code", text: "your-project/\n├── AGENTS.md            # rules for the agent (and for coding agents working on this repo)\n├── README.md            # what it is, one-command setup, models + limits used\n├── ARCHITECTURE.md      # diagram + hand-off contracts\n├── skills/\n│   └── <skill-name>/SKILL.md\n├── src/                 # your agent / app\n├── evals/\n│   ├── dataset/         # inputs + expected behaviour\n│   ├── run_evals.*      # one command, prints a score table\n│   └── RESULTS.md       # dated rows: baseline → mid → final\n├── .env.example         # names of the keys, never the values\n└── docs/postmortem.md" }
      ]
    }
  ],

  /* ---------------------------------------------------------------
     PROJECT TRACKS
  --------------------------------------------------------------- */
  projects: [
    {
      id: "p1",
      slot: "Hamza 1",
      short: "AI PR Reviewer",
      title: "AI Pull Request Reviewer with a Team Playbook",
      color: "blue",
      oneLiner: "A GitHub App that reviews every pull request using your team's own rules (AGENTS.md + Skills), talks to GitHub over MCP, and never approves, merges or leaks a secret.",
      sessions: "S2 context engineering · S4 AI as reviewer · S5 harness · S6 MCP & production agents",
      parallels: "CodeRabbit · Greptile · GitHub Copilot code review · Cursor Review · Graphite",
      why: [
        "Code review is one of the biggest bottlenecks in software teams: every change waits for a human. AI reviewers are now a <strong>production system at the largest engineering organisations</strong>, not a demo.",
        "The model is a commodity. What you add is <strong>context</strong> (the team's playbook) and the <strong>harness</strong> that keeps it safe and precise. Industry data shows the hard problem is not generating comments — it is <strong>not generating useless ones</strong>."
      ],
      evidence: [
        { org: "Microsoft", stat: "90%+", label: "of pull requests company-wide supported by its AI review assistant — 600,000+ PRs a month, with a 10–20% median reduction in PR completion time across 5,000 repositories. Its lessons fed GitHub Copilot code review.", src: { t: "Engineering@Microsoft · Jul 2025", url: "https://devblogs.microsoft.com/engineering-at-microsoft/enhancing-code-quality-at-scale-with-ai-powered-code-reviews/" } },
        { org: "Uber", stat: "75%", label: "of uReview's comments rated useful by engineers; 65% are addressed in the same change. It covers 90% of ~65,000 weekly diffs and saves ~1,500 developer-hours a week — by filtering aggressively for precision.", src: { t: "Uber Engineering · Aug 2025", url: "https://www.uber.com/us/en/blog/ureview/" } },
        { org: "Google", stat: "52%", label: "of reviewer comments addressed by ML-suggested edits at a 50% target precision, projected to save hundreds of thousands of engineer-hours a year.", src: { t: "Google Research · May 2023", url: "https://research.google/blog/resolving-code-review-comments-with-ml/" } }
      ],
      lesson: "Uber's key finding: “a simple standalone prompt results in many false-positive comments.” Build your eval around <strong>precision first</strong> — a reviewer that cries wolf gets uninstalled.",
      milestones: [
        {
          id: "m1", when: "Week 1", title: "Walking skeleton",
          goal: "Prove the round trip: a PR opens → your app answers → an LLM call works from the same place.",
          build: [
            "Register a GitHub App and deploy a webhook receiver (Vercel, Cloudflare Workers, Fly.io or a small VPS).",
            "Opening a PR triggers a hard-coded “hello” comment from the bot.",
            "An LLM SDK call works from the deployed environment with a trivial prompt.",
            "Pick a target repository and write AGENTS.md v1 for it: naming conventions, testing rules, an explicit always / never list."
          ],
          deliver: [
            "Public repo with a README: what it is, one-command setup, which model and free tier you use.",
            "Link to a PR where the bot posted its hello comment.",
            "AGENTS.md v1 committed."
          ],
          measure: [
            "Opening a test PR produces a bot comment in under 60 seconds.",
            "No secret in the Git history (run a secret scanner such as gitleaks on the repo).",
            "The deployed app completes one LLM call and logs tokens in/out.",
            "AGENTS.md has at least 10 concrete rules, including always / never lists."
          ],
          resources: [
            { kind: "docs", t: "About creating GitHub Apps", by: "GitHub Docs", url: "https://docs.github.com/en/apps/creating-github-apps/about-creating-github-apps/about-creating-github-apps" },
            { kind: "docs", t: "Probot — framework for GitHub Apps", by: "Probot", url: "https://probot.github.io/docs/" },
            { kind: "read", t: "How to do a code review", by: "Google Engineering Practices", url: "https://google.github.io/eng-practices/review/", note: "Use it as the seed for your AGENTS.md rules." }
          ]
        },
        {
          id: "m2", when: "Week 2", title: "First real reviews",
          goal: "The full review flow works on real diffs, through MCP, with the first Skill and the first guardrails.",
          build: [
            "Use the official GitHub MCP server to fetch PR diffs and post comments — no custom REST wrapper.",
            "Build the flow: pull diff → load AGENTS.md → model → parse structured output (JSON schema) → one comment per finding.",
            "Package a first Skill (e.g. security-check) as a portable folder with a SKILL.md.",
            "Add guardrails: skip files it doesn't understand, cap the number of comments per PR, don't post if the diff exceeds N lines."
          ],
          deliver: [
            "A demo PR with real findings posted by the bot.",
            "skills/security-check/SKILL.md.",
            "The findings JSON schema, documented in ARCHITECTURE.md."
          ],
          measure: [
            "On 10 test PRs, 100% of model outputs parse against your schema (malformed output is retried or dropped, never posted).",
            "The Skill works unchanged when copied into a different repo.",
            "Automated tests prove each guardrail: oversized diff → no post; comment cap enforced; unknown file type skipped.",
            "Tracing is on: every review has a trace with tokens, latency and cost."
          ],
          resources: [
            { kind: "docs", t: "GitHub MCP Server (official)", by: "GitHub", url: "https://github.com/github/github-mcp-server", note: "Has pull_request_read (get_diff) and review-writing tools." },
            { kind: "video", t: "Building Agents with MCP — full workshop", by: "Anthropic", url: "https://www.youtube.com/watch?v=kQmXtrmQ5Zg" },
            { kind: "read", t: "Agent Skills — overview & spec", by: "agentskills.io", url: "https://agentskills.io/" }
          ]
        },
        {
          id: "m3", when: "Week 3", title: "Evals and the harness effect",
          goal: "Put numbers on quality, and prove that your context — not the model — makes the difference.",
          build: [
            "Curate 20+ historical PRs from public open-source repos, with the human reviewers' actual decisions and comments.",
            "Build an eval harness: run the bot on each PR, score precision (was the finding correct?) and recall (did it catch what the human caught?).",
            "Iterate: tune AGENTS.md, tune the Skills, add a second Skill (e.g. test-coverage-gap). Record the score at each iteration.",
            "Ablation: rerun with a thin context (empty AGENTS.md, no Skills) to measure the context effect."
          ],
          deliver: [
            "evals/ with the dataset, the runner and RESULTS.md.",
            "A results table: baseline vs. at least one iteration.",
            "Rich-vs-thin context numbers."
          ],
          measure: [
            "Evals run with one command and print precision and recall.",
            "The dataset has at least 20 PRs, each with ground truth written down before scoring.",
            "Precision and recall are reported at 2+ dated points, each tied to a commit.",
            "The rich-vs-thin delta is reported, whichever way it goes."
          ],
          resources: [
            { kind: "read", t: "uReview: how Uber evaluates and filters AI review comments", by: "Uber Engineering", url: "https://www.uber.com/us/en/blog/ureview/" },
            { kind: "video", t: "Building uReview, Uber's multi-agent code review engine", by: "Uber · AI Engineer", url: "https://www.youtube.com/watch?v=EL123UNokkI" },
            { kind: "read", t: "AI Evals FAQ", by: "Hamel Husain & Shreya Shankar", url: "https://hamel.dev/blog/posts/evals-faq/" }
          ]
        },
        {
          id: "m4", when: "Week 4", title: "Ship and write up",
          goal: "Harden the guardrails, run it on a real repo, and tell the story with numbers.",
          build: [
            "Rate limiting; secrets scanning on the diff before it is sent to the model; a deny-list of repos or PR authors.",
            "Make the App installable (Marketplace or public install URL) and install it on a real open-source repo.",
            "Record a 3-minute demo on a live PR.",
            "Write the report: eval numbers across iterations, rich-vs-thin comparison, 3 surprises, 3 next steps."
          ],
          deliver: [
            "Install link + a live PR on a public repo reviewed by the bot.",
            "3-minute demo video.",
            "Final eval numbers in RESULTS.md."
          ],
          measure: [
            "A fake secret planted in a test diff is blocked: 0 secrets reach the model (logged proof).",
            "The rate limit and deny-list each have a passing test.",
            "The final eval score is reported next to the baseline.",
            "The demo shows a real PR, not slides."
          ],
          resources: [
            { kind: "read", t: "Enhancing code quality at scale with AI-powered code reviews", by: "Microsoft", url: "https://devblogs.microsoft.com/engineering-at-microsoft/enhancing-code-quality-at-scale-with-ai-powered-code-reviews/" }
          ]
        },
        {
          id: "m5", when: "Month 2", title: "Depth, stretch goals, defence",
          goal: "Turn a working project into a distinction-level one.",
          build: [
            "Stretch: a third Skill for a language or framework outside the target repo.",
            "Stretch: a rich-vs-thin ablation chart in the report.",
            "Stretch: support a second Git host (GitLab or Bitbucket) through the same MCP abstraction.",
            "Grow the eval set and add a third measured iteration."
          ],
          deliver: [
            "Post-mortem, 3–5 pages.",
            "Eval numbers at three points (baseline / mid / final).",
            "Rehearsed defence: each teammate can explain any part of the code."
          ],
          measure: [
            "RESULTS.md has 3 dated rows.",
            "At least one stretch goal attempted and honestly reported.",
            "The repo runs from a fresh clone with one command."
          ],
          resources: []
        }
      ],
      mvd: [
        "Public GitHub repo with the App source, AGENTS.md, and at least one Skill.",
        "The bot demonstrably running on at least one public PR.",
        "Eval report on 20 historical PRs, with numbers at two points (baseline and final).",
        "Written post-mortem, 3–5 pages."
      ],
      stack: "Probot / Octokit or a light HTTP framework · an LLM SDK · the official MCP SDK · a webhook-capable host (Vercel, Cloudflare Workers, Fly.io). A JSON file is enough for state."
    },

    {
      id: "p2",
      slot: "Hamza 2",
      short: "Docs Q&A Agent",
      title: "Production-Grade Documentation Q&A Agent",
      color: "teal",
      oneLiner: "A support agent that answers technical questions from a real documentation corpus, with citations, a safe fallback, observability from day one, and an eval suite that gates every deploy.",
      sessions: "S4 tests & evals, the quality flywheel · S6 production agents, observability, MCP · S7 token economy",
      parallels: "Intercom Fin · Zendesk AI Agents · Notion Q&A · GitBook AI · Mintlify Chat",
      why: [
        "Grounded Q&A over company knowledge is the <strong>most widely deployed LLM application in industry</strong>. The prototype takes a weekend; the production version is where most teams fail.",
        "This project forces you across that gap: from “it answered my three questions” to “it answered 500 questions at a measured accuracy, at a known cost per query, and here is the trace of the one it got wrong.”"
      ],
      evidence: [
        { org: "DoorDash", stat: "−90%", label: "hallucinations in its RAG support assistant for delivery drivers after adding a two-tier LLM guardrail (cheap similarity check, then an LLM evaluator) — and −99% severe compliance issues. An LLM judge monitors quality on five dimensions.", src: { t: "DoorDash Engineering · Sep 2024", url: "https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/" } },
        { org: "Anthropic", stat: "−67%", label: "retrieval failures with Contextual Retrieval: −35% from contextual embeddings, −49% adding BM25 hybrid search, −67% adding a re-ranker. Exactly the levers you'll tune in week 3.", src: { t: "Anthropic · Sep 2024", url: "https://www.anthropic.com/news/contextual-retrieval" } },
        { org: "Meta (FAIR)", stat: "2020", label: "Retrieval-Augmented Generation was introduced by Facebook AI Research: combining a retriever with a generator beat pure generation on knowledge-intensive tasks and made answers traceable to sources.", src: { t: "Lewis et al., NeurIPS 2020", url: "https://arxiv.org/abs/2005.11401" } }
      ],
      lesson: "DoorDash didn't win by picking a better model. They won with <strong>guardrails + an evaluation flywheel</strong> — the same evaluate → diagnose → optimise → verify loop you will run.",
      milestones: [
        {
          id: "m1", when: "Week 1", title: "End-to-end, bad but working",
          goal: "A question goes in, retrieved chunks come out, the model answers. Quality will be bad — that is fine.",
          build: [
            "Pick and lock a corpus: big enough to be interesting (~100+ pages), small enough to index fully — Kubernetes docs, Stripe API, FastAPI docs, or an open-source handbook.",
            "Ingestion pipeline: chunk → embed → load into a vector database (pgvector, Qdrant or LanceDB).",
            "Minimal chat: question → top-k retrieval → answer.",
            "Commit everything to a public repo with a README explaining the corpus choice and licence."
          ],
          deliver: [
            "Public repo with the ingestion pipeline and minimal chat.",
            "README: corpus, page count, chunking choices, models and free-tier limits."
          ],
          measure: [
            "Ingestion is re-runnable with one command and reports pages and chunks indexed.",
            "100% of corpus pages are indexed (count matches the source).",
            "A question gets an answer end to end in under 10 s.",
            "Token usage per query is logged."
          ],
          resources: [
            { kind: "video", t: "Learn RAG From Scratch (full course)", by: "Lance Martin, LangChain · freeCodeCamp", url: "https://www.youtube.com/watch?v=sVcwVQRHIc8" },
            { kind: "docs", t: "pgvector", by: "GitHub", url: "https://github.com/pgvector/pgvector" },
            { kind: "docs", t: "Qdrant documentation", by: "Qdrant", url: "https://qdrant.tech/documentation/" }
          ]
        },
        {
          id: "m2", when: "Week 2", title: "Grounding and observability",
          goal: "Every claim cites its source, every query is traced, and you have a baseline number.",
          build: [
            "Inline citations: each claim points to a source paragraph with a clickable URL.",
            "Wire in tracing (Langfuse, LangSmith, Helicone or a homemade SQLite tracer): every query, retrieval and model call.",
            "Write 25 hand-made Q&A pairs + 5 adversarial questions (out of scope, ambiguous, traps) the agent should refuse or hedge on.",
            "Run the eval: baseline accuracy, cost per query, p95 latency."
          ],
          deliver: [
            "Citations in the UI.",
            "A tracing dashboard screenshot or link.",
            "evals/ with 30 items and RESULTS.md row #1 (baseline)."
          ],
          measure: [
            "100% of answers contain at least one citation, or are an explicit refusal.",
            "Every query in the eval run appears as a trace.",
            "Baseline accuracy, cost/query and p95 latency are recorded with the commit hash.",
            "The 5 adversarial questions are scored separately."
          ],
          resources: [
            { kind: "docs", t: "Langfuse — tracing & evals", by: "Langfuse", url: "https://langfuse.com/docs" },
            { kind: "read", t: "Path to high-quality LLM-based support automation", by: "DoorDash Engineering", url: "https://careersatdoordash.com/blog/large-language-modules-based-dasher-support-automation/" },
            { kind: "read", t: "Your AI product needs evals", by: "Hamel Husain", url: "https://hamel.dev/blog/posts/evals/" }
          ]
        },
        {
          id: "m3", when: "Week 3", title: "Run the quality flywheel",
          goal: "Three deliberate iterations, each measured, each diagnosed from traces.",
          build: [
            "Grow the eval set to 50 real questions + 10 adversarial.",
            "Iteration 1: tune the prompt. Iteration 2: tune retrieval (chunk size, top-k, hybrid BM25 + vectors). Iteration 3: add a re-ranker or a small helper model.",
            "Use the traces to diagnose the worst-scoring questions (evaluate → diagnose → optimise → verify).",
            "Track cost per query at every iteration."
          ],
          deliver: [
            "RESULTS.md with 3 iteration rows (accuracy, adversarial handling, cost/query, p95).",
            "The 5 worst failures, each linked to its trace, with a diagnosis."
          ],
          measure: [
            "60+ eval items in the repo.",
            "Each iteration changes one thing, and its effect is measured.",
            "Cost per query goes down or stays flat — it never drifts up silently.",
            "The adversarial refusal/hedge rate is reported."
          ],
          resources: [
            { kind: "read", t: "Introducing Contextual Retrieval", by: "Anthropic", url: "https://www.anthropic.com/news/contextual-retrieval", note: "Hybrid search + re-ranking, with numbers." },
            { kind: "read", t: "AI Evals FAQ", by: "Hamel Husain & Shreya Shankar", url: "https://hamel.dev/blog/posts/evals-faq/" },
            { kind: "video", t: "Why AI evals are the hottest new skill", by: "Hamel Husain & Shreya Shankar · Lenny's Podcast", url: "https://www.youtube.com/watch?v=BsWxPI9UM4c" }
          ]
        },
        {
          id: "m4", when: "Week 4", title: "Deploy and write up",
          goal: "A real interface the professor can use, with feedback flowing back into your traces.",
          build: [
            "Deploy a chat UI (Streamlit, Next.js, or a Slack bot over MCP) at a public URL.",
            "Add /feedback (thumbs up/down) stored against the trace.",
            "Run the final eval.",
            "Write the report: 3-iteration chart, cost trajectory, adversarial breakdown, 5 worst failures with traces, “another month” section."
          ],
          deliver: [
            "A public URL.",
            "A 3-minute demo: real questions, with the dashboard updating live.",
            "Final numbers in RESULTS.md."
          ],
          measure: [
            "The public URL works from a phone on mobile data.",
            "The dashboard shows latency, cost per query, and the thumbs-up/down ratio.",
            "Feedback from the demo appears in the traces.",
            "Final vs. baseline is reported for accuracy, cost and latency."
          ],
          resources: [
            { kind: "docs", t: "Build a basic LLM chat app", by: "Streamlit", url: "https://docs.streamlit.io/develop/tutorials/chat-and-llm-apps/build-conversational-apps" }
          ]
        },
        {
          id: "m5", when: "Month 2", title: "Depth, stretch goals, defence",
          goal: "Make it production-grade in the ways industry actually checks.",
          build: [
            "Stretch: model routing (small model for easy questions, large for hard) and measure the cost delta.",
            "Stretch: a Slack bot over MCP alongside the web UI.",
            "Stretch: a regression suite that runs the eval automatically on every commit (GitHub Actions).",
            "Harden the safe-answer fallback with a confidence threshold."
          ],
          deliver: [
            "Post-mortem, 3–5 pages, with numeric before/after.",
            "Rehearsed defence."
          ],
          measure: [
            "The CI eval fails the build when accuracy drops below your threshold.",
            "At least one stretch goal attempted and honestly reported.",
            "The repo runs from a fresh clone with one command."
          ],
          resources: [
            { kind: "docs", t: "GitHub Actions — quickstart", by: "GitHub Docs", url: "https://docs.github.com/en/actions/writing-workflows/quickstart" }
          ]
        }
      ],
      mvd: [
        "Public GitHub repo: ingestion pipeline, agent code, eval suite, deployment config.",
        "Live deployment reachable by the professor at a public URL.",
        "Eval suite of at least 50 questions + 10 adversarial, with numbers at three iteration points.",
        "Observability dashboard with at least latency, cost per query, and thumbs up vs. down.",
        "Written post-mortem, 3–5 pages, with a numeric before/after comparison."
      ],
      stack: "Python or TypeScript · an LLM SDK · pgvector / Qdrant / LanceDB · Langfuse / LangSmith / Helicone or a SQLite tracer · Streamlit or Next.js · Vercel, Fly.io or Render."
    },

    {
      id: "p3",
      slot: "Hamza 3",
      short: "Multi-Agent Pipeline",
      title: "Multi-Agent Feature Development Pipeline (Spec → PR)",
      color: "violet",
      oneLiner: "An orchestrator that turns a natural-language feature spec into a merge-ready pull request, by coordinating a planner, a coder, a tester and a reviewer inside a sandbox — with budget caps and rollback.",
      sessions: "S3 SDLC I · S4 SDLC II · S5 harness · S6 A2A & multi-agent · S7 economics",
      parallels: "Cognition Devin · Cursor background agents · OpenAI Codex · GitHub Copilot coding agent · Google Jules · Claude Code sub-agents",
      why: [
        "The industry is moving from <strong>conductor mode</strong> (a developer pair-programming with an AI in real time) to <strong>orchestrator mode</strong> (agents working asynchronously while humans review the output). This is the most ambitious project, and the closest to where software engineering is heading.",
        "It also forces you to face the hard parts that demos hide: state, hand-offs, budget caps, rollback, and the real cost of several agents talking in a loop. Knowing <strong>when not</strong> to use multiple agents is part of the grade."
      ],
      evidence: [
        { org: "GitHub", stat: "Issue → PR", label: "Copilot's cloud coding agent takes an issue, researches the repo, plans, edits on a branch inside an ephemeral GitHub Actions sandbox, runs tests and linters, and opens a PR for human review — respecting branch protection.", src: { t: "GitHub Docs", url: "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent" } },
        { org: "OpenAI", stat: "~1M lines", label: "shipped in ~5 months by a team of 3 growing to 7 engineers, averaging ~3.5 PRs per engineer per day, with agents writing all of the code. Humans designed the environment, the docs and the mechanical checks.", src: { t: "OpenAI · Feb 2026", url: "https://openai.com/index/harness-engineering/" } },
        { org: "Anthropic", stat: "+90% / 15×", label: "A multi-agent system beat a single agent by 90.2% on research tasks, but used ~15× the tokens of a chat. Anthropic warns most coding tasks are less parallelisable than research.", src: { t: "Anthropic Engineering · Jun 2025", url: "https://www.anthropic.com/engineering/multi-agent-research-system" } }
      ],
      lesson: "The counter-argument is just as important: Cognition (makers of Devin) argue that agents with <strong>separate contexts make conflicting decisions</strong> — “share context, and share full agent traces.” Your hand-off contracts are your answer to that. <a href=\"https://cognition.com/blog/dont-build-multi-agents\" target=\"_blank\" rel=\"noopener\">Read “Don't build multi-agents” ↗</a>",
      note: "The project definition sizes this project for 3–4 students; you are a pair. Hit the minimum viable deliverable first. The reviewer agent may start as a rule-based checker (linters + policy checks) and become an LLM agent in month 2.",
      milestones: [
        {
          id: "m1", when: "Week 1", title: "Architecture and one working agent",
          goal: "Design on paper, secure the sandbox, and get the planner working end to end.",
          build: [
            "Design the orchestration on paper first: which agent does what, what state each reads/writes, how hand-offs work. Commit the diagram.",
            "Pick the substrate: LangGraph, CrewAI, Temporal, or a custom orchestrator.",
            "Get a sandboxed code-execution environment working (Docker or E2B) <em>before</em> any code-writing agent exists. Non-negotiable.",
            "Implement the planner: spec → plan.md (files to change, tests to write, dependencies)."
          ],
          deliver: [
            "ARCHITECTURE.md with the diagram and draft hand-off contracts.",
            "Sandbox setup that runs a test command in isolation.",
            "plan.md outputs for 3 sample specs."
          ],
          measure: [
            "A command run in the sandbox cannot read or write the host file system (demonstrated).",
            "The planner produces a valid plan.md for 3 different specs.",
            "Every model call is logged with its agent name, tokens and cost.",
            "A target repo is chosen and has a working CI."
          ],
          resources: [
            { kind: "read", t: "Building effective agents (orchestrator-workers pattern)", by: "Anthropic", url: "https://www.anthropic.com/engineering/building-effective-agents" },
            { kind: "docs", t: "LangGraph overview", by: "LangChain", url: "https://docs.langchain.com/oss/python/langgraph/overview" },
            { kind: "docs", t: "E2B — sandboxes for AI agents", by: "E2B", url: "https://docs.e2b.dev/" }
          ]
        },
        {
          id: "m2", when: "Week 2", title: "Two more agents and a first end-to-end run",
          goal: "Planner → coder → tester produces a working branch for the simplest possible spec.",
          build: [
            "Coder agent: reads plan.md, edits files in the sandbox, commits to a feature branch.",
            "Tester agent: reads the coder's output, writes tests, runs them in the sandbox.",
            "Define the hand-off contracts explicitly: a schema for what each agent produces, so the next one consumes it without guessing.",
            "Run the pipeline end to end on “add a hello endpoint”. Capture the full trace."
          ],
          deliver: [
            "A feature branch produced entirely by the pipeline, with passing tests.",
            "Hand-off schemas in the repo.",
            "The full trace of the run."
          ],
          measure: [
            "Every hand-off is validated against its schema — 0 schema failures on the hello run.",
            "The tests written by the tester fail on the base branch and pass on the feature branch (they really test the feature).",
            "Total tokens and cost of the run are reported per agent."
          ],
          resources: [
            { kind: "read", t: "Don't build multi-agents", by: "Cognition (Devin)", url: "https://cognition.com/blog/dont-build-multi-agents", note: "Read before you write your hand-off contracts." },
            { kind: "read", t: "Effective harnesses for long-running agents", by: "Anthropic", url: "https://anthropic.com/engineering/effective-harnesses-for-long-running-agents" }
          ]
        },
        {
          id: "m3", when: "Week 3", title: "Reviewer, observability and evals",
          goal: "Close the loop with a reviewer, see where the tokens go, and get an honest pass rate.",
          build: [
            "Reviewer agent: reads the diff, checks it against a policy AGENTS.md (naming, security, tests present), then approves or requests changes.",
            "Dashboard: which agent did what, tokens per agent, wall time per agent, total cost per run.",
            "Eval set: 10 feature specs (2 trivial, 5 medium, 3 hard), each with a pass condition (CI passes, tests test the feature, cost under budget).",
            "Run the eval and record the pass rate. It will be lower than you expect — that is the point."
          ],
          deliver: [
            "evals/ with 10 specs + pass conditions, and RESULTS.md row #1.",
            "Dashboard screenshot with the per-agent breakdown."
          ],
          measure: [
            "The reviewer catches a deliberately planted policy violation.",
            "Pass rate on the 10 specs is reported, split by difficulty.",
            "Cost per run is reported as min / median / max."
          ],
          resources: [
            { kind: "read", t: "How we built our multi-agent research system", by: "Anthropic", url: "https://www.anthropic.com/engineering/multi-agent-research-system" },
            { kind: "docs", t: "SWE-bench — how the industry benchmarks coding agents", by: "Princeton / SWE-bench", url: "https://www.swebench.com/" }
          ]
        },
        {
          id: "m4", when: "Week 4", title: "Harden and ship",
          goal: "Make failure safe and cost bounded, fix the top failure modes, and demo it live.",
          build: [
            "Rollback: if any agent fails, restore the workspace to a known-good state.",
            "Budget caps: a hard limit on tokens per run, so a runaway loop cannot burn the quota.",
            "Fix the two most common failure modes from the eval (usually hand-off ambiguity and tests that don't really test).",
            "Record a demo: one live spec, from natural language to a merge-ready PR."
          ],
          deliver: [
            "A merge-ready PR produced live in the demo video.",
            "The report: pass rate, cost per PR (min / median / max), the three failure modes you could not fix, and “when would a single agent have been better?”"
          ],
          measure: [
            "A forced agent failure restores the workspace (test proves it).",
            "A runaway-loop test is stopped by the budget cap.",
            "At least 3 of the 10 eval specs pass end to end (MVD).",
            "The pass rate after fixes is reported next to the week-3 baseline."
          ],
          resources: [
            { kind: "read", t: "Harness engineering", by: "OpenAI", url: "https://openai.com/index/harness-engineering/" },
            { kind: "docs", t: "About Copilot coding agent", by: "GitHub Docs", url: "https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent", note: "See how a production agent scopes permissions and sandboxing." }
          ]
        },
        {
          id: "m5", when: "Month 2", title: "Depth, stretch goals, defence",
          goal: "Standards, a human in the loop, and an honest single-agent vs multi-agent verdict.",
          build: [
            "Stretch: A2A-compliant message envelopes between agents instead of ad-hoc JSON.",
            "Stretch: a human-in-the-loop escape hatch — any agent can pause and ask a question over Slack or the CLI.",
            "Stretch: model routing per agent (cheap planner, capable coder, fast reviewer).",
            "Run the same eval with a single well-instructed agent and compare."
          ],
          deliver: [
            "Post-mortem, 5–7 pages, with cost-per-PR numbers and failure-mode analysis.",
            "Rehearsed defence."
          ],
          measure: [
            "Single- vs multi-agent comparison reported with pass rate and cost.",
            "At least one stretch goal attempted and honestly reported.",
            "The repo runs from a fresh clone with one command."
          ],
          resources: [
            { kind: "docs", t: "A2A protocol documentation", by: "Linux Foundation", url: "https://a2a-protocol.org/latest/" },
            { kind: "video", t: "How We Build Effective Agents", by: "Barry Zhang, Anthropic", url: "https://www.youtube.com/watch?v=D7_ipDqhtwk" }
          ]
        }
      ],
      mvd: [
        "Public GitHub repo with the orchestrator, all agents, the sandbox setup and the eval set.",
        "End-to-end pipeline demonstrated on at least 3 of the 10 eval specs.",
        "Observability dashboard with per-agent cost and time.",
        "Written post-mortem, 5–7 pages, with cost-per-PR numbers and failure-mode analysis."
      ],
      stack: "Python or TypeScript · LangGraph, CrewAI or a custom orchestrator (Temporal / Prefect if ambitious) · Docker or E2B · GitHub over MCP · Langfuse or a homemade tracer."
    }
  ],

  /* ---------------------------------------------------------------
     FINAL DELIVERY
  --------------------------------------------------------------- */
  rubric: [
    ["Working artefact", 25, "The repo runs from a fresh clone with a single command; the deployed thing does what the README says."],
    ["Context & harness", 20, "AGENTS.md and at least one Skill are non-trivial and clearly shape behaviour; guardrails, sandbox and observability are all present and demonstrated."],
    ["Eval discipline", 20, "The eval suite is in the repo, was written before or alongside the code, has real numbers at three points in time, and drives the decisions in the report."],
    ["Written post-mortem", 15, "Honest about what broke; numbers, not adjectives; ends with a “what we would do next” a hiring manager could believe."],
    ["Demo & communication", 10, "A 3-minute video of the agent doing real work, not slides; the team answers follow-up questions unrehearsed."],
    ["Ambition & stretch", 10, "At least one stretch goal attempted and reported honestly, whether it worked or not."]
  ]
};
