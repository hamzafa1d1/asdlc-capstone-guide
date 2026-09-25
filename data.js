/* Site config for the ASDLC Capstone Guide.
   Section content lives in content/*.js (one file per section). Each file adds
   itself to window.GUIDE_PARTS. This file adds the start page and the final
   delivery page, then assembles everything into window.GUIDE for app.js.
   A missing part is skipped, so the site still renders. */

(function () {
  var P = window.GUIDE_PARTS = window.GUIDE_PARTS || {};

  /* ---------------- 01 Start ---------------- */
  P.start = P.start || {
    id: "start",
    num: "01",
    title: "Start here",
    kicker: "Orientation · 15 min",
    summary: "What you build, how the eight weeks are split, and the rules every pair follows.",
    blocks: [
      { type: "lead", html: "You and your partner build an agentic AI system that a hiring manager could run from a fresh clone. The capstone lasts eight weeks at roughly 15 to 20 hours per person per week. Every week ends with something you can demo, and every claim you make in the final report is backed by a number from your own evals." },
      { type: "callout", tone: "info", title: "The official project definitions win", html: "This guide expands on the scope document shared with the Head of Department. If the two disagree, <strong>the document wins</strong>. <a data-doc target=\"_blank\" rel=\"noopener\">Open \"ASDLC Capstone Projects\" on Google Drive</a>." },

      { type: "h", text: "The eight weeks", id: "timeline" },
      { type: "p", html: "Each project track breaks these weeks into its own milestones. The goals below are the same for every pair." },
      { type: "timeline", items: [
        { when: "Week 1", what: "Tools installed, public repo, rule file v1, and a walking skeleton that runs end to end on real input with tracing turned on." },
        { when: "Week 2", what: "The real core loop on real data: structured model output, the first packaged Skill, and guardrails with tests that prove they fire." },
        { when: "Week 3", what: "An eval suite of 20+ items that runs with one command, a baseline score tied to a commit hash, and a first measured iteration." },
        { when: "Week 4", what: "Deployed and usable by someone else: install link or public URL, CI that runs tests and evals on every pull request, a 3-minute demo." },
        { when: "Weeks 5-6", what: "Depth: a bigger eval set, two more measured iterations, one ablation that isolates what your harness adds, and a first stretch goal." },
        { when: "Weeks 7-8", what: "Final eval run, fresh-clone check, written post-mortem with cost numbers, recorded demo, and a rehearsed defence." }
      ]},

      { type: "h", text: "How this guide is organised", id: "organisation" },
      { type: "list", items: [
        "<strong>01 Start.</strong> This page: the plan, the rules, and how to use the site.",
        "<strong>02 Free toolkit.</strong> Coding agents and model APIs you can use at no cost as a student, with their limits checked in September 2026.",
        "<strong>03 Claude Code as a harness.</strong> The reference harness for the course. Each component (rule files, skills, hooks, subagents, MCP, permissions, headless mode and more) has its own page with the official docs and a short exercise.",
        "<strong>04 Core concepts.</strong> Definitions of LLM, agent, harness, context engineering, RAG and evals, with the primary sources to read and watch.",
        "<strong>05 Test your work.</strong> How to check that an agent works: tests for tools, eval suites, LLM judges, CI gates. Includes small labs you finish in one sitting.",
        "<strong>06 Building blocks.</strong> The artefacts every pair produces, whatever the project, so peer review across teams works.",
        "<strong>Project tracks.</strong> Pick one. Each track has six milestones (Weeks 1 to 4, Weeks 5-6, Weeks 7-8) with what to build, deliver, measure and test.",
        "<strong>Final delivery.</strong> The grading rubric and the submission checklist."
      ]},

      { type: "h", text: "How to use it", id: "how-to-use" },
      { type: "list", items: [
        "Press <code>Ctrl K</code> (or <code>Cmd K</code> on a Mac) to search every page, term, tool, component and milestone.",
        "Links marked <span class=\"cc-demo\">CC</span> open the matching Claude Code component. Use them when a milestone asks you to set up a hook, a skill or a subagent.",
        "Tick checkboxes as you go. Progress is saved in this browser only. Treat it as a personal tracker, not a submission.",
        "Every industry claim has a source link. Read the sources: they are the actual curriculum."
      ]},

      { type: "h", text: "Ground rules", id: "ground-rules" },
      { type: "list", items: [
        "<strong>Public repository from day one.</strong> The Git history should show how the project was built.",
        "Write evals before or alongside the code. Never backfill them in the last week.",
        "Turn on tracing in week 1. You need traces to explain every failure you report.",
        "Never commit an API key. Keep keys in <code>.env</code>, list <code>.env</code> in <code>.gitignore</code>, and run a secret scanner before you push.",
        "Put a hard budget cap in code (requests or tokens per run). A loop bug can empty a free quota in minutes.",
        "Post a weekly check-in on the team Slack channel: what shipped, what broke, the current numbers, what is next."
      ]},

      { type: "checklist", id: "start-ready", title: "Before you leave this page", items: [
        "You read the official project definitions document once, end to end.",
        "You and your partner agreed on a project track and told the supervisor.",
        "You created the public repository and both partners can push to it.",
        "You booked a fixed weekly slot for the Slack check-in."
      ]}
    ]
  };

  /* ---------------- Final delivery ---------------- */
  var final = {
    id: "final",
    title: "Final delivery",
    kicker: "End of week 8",
    summary: "One rubric for every project, so grading is fair whichever track you picked.",
    blocks: [
      { type: "lead", html: "Grading looks at the repository, the eval history, the post-mortem and a live defence. The weights below apply to all three tracks." },
      { type: "h", text: "Rubric", id: "rubric" },
      { type: "rubric" },
      { type: "p", html: "<span class=\"muted\">Weights are indicative and may be adjusted by the professor. See the <a data-doc target=\"_blank\" rel=\"noopener\">project definitions</a>.</span>" },

      { type: "h", text: "Submission package", id: "submission" },
      { type: "checklist", id: "deliver-pkg", title: "Everything a reviewer needs", items: [
        "Public repo link, with a README whose first command sets everything up from a fresh clone.",
        "<code>evals/RESULTS.md</code> with at least three dated rows (baseline, mid, final), each with a commit hash.",
        "A 3-minute demo video (unlisted YouTube or Drive) showing the system doing real work, not slides.",
        "Post-mortem in <code>docs/postmortem.md</code>: what worked, what broke, what you would change, what it cost to run.",
        "The rule file (<code>AGENTS.md</code> or <code>CLAUDE.md</code>) and <code>skills/</code> in the repo, with a Git history that shows how they changed.",
        "Stretch goals attempted, with an honest report of the result."
      ]},

      { type: "h", text: "Fixed rules and open choices", id: "rules" },
      { type: "callout", tone: "warn", title: "Non-negotiable", html: "Public repo from week 1. Evals written before or alongside the code. Tracing on by week 2 at the latest. A written post-mortem with numbers." },
      { type: "callout", tone: "tip", title: "Your call", html: "Language, framework and model provider. Whether a stretch goal succeeds: an honest failure scores better than not trying. Absolute eval scores: the trend across iterations and your explanation of it count for more." },

      { type: "h", text: "Defence", id: "defence" },
      { type: "list", items: [
        "Each partner can explain any file in the repo, not only the parts they wrote.",
        "Be ready to rerun the eval suite live and explain one failure from its trace.",
        "Be ready to say what one more month would buy you, with an estimate you can justify."
      ]}
    ]
  };

  /* ---------------- Assembly ---------------- */
  window.GUIDE = {
    docUrl: "https://docs.google.com/document/d/1vXNRej6hJEaWrtFM7qIWMgIDCAGHGPS0MogUjb9GLoE/edit?usp=sharing",
    supervisor: "Hamza Faidi",
    lastVerified: "25 September 2026",
    shared: [P.start, P.tools, P.harness, P.concepts, P.testing, P.primitives].filter(Boolean),
    projects: [P.p1, P.p2, P.p3].filter(Boolean),
    final: final,
    rubric: [
      ["Working artefact", 25, "The repo runs from a fresh clone with one command, and the deployed system does what the README says."],
      ["Context and harness", 20, "The rule file and at least one Skill are non-trivial and visibly shape behaviour. Guardrails, sandbox and tracing are present and demonstrated."],
      ["Eval discipline", 20, "The eval suite lives in the repo, was written before or alongside the code, has real numbers at three points in time, and drives the decisions in the report."],
      ["Written post-mortem", 15, "Honest about what broke. Numbers, not adjectives. Ends with a \"what we would do next\" section a hiring manager would believe."],
      ["Demo and communication", 10, "A 3-minute video of the agent doing real work, not slides. The pair answers follow-up questions without a script."],
      ["Ambition and stretch", 10, "At least one stretch goal attempted and reported honestly, whether it worked or not."]
    ]
  };
})();
