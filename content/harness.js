/* Claude Code as a harness: edit content here; app.js renders it.
   Generated from structured data; keep strings double-quoted and ES5-safe. */
(window.GUIDE_PARTS = window.GUIDE_PARTS || {}).harness = {
 "id": "harness",
 "num": "03",
 "title": "Claude Code as a harness",
 "kicker": "Core concept · 5-6 h",
 "summary": "Learn what a harness is by taking apart a production one: Claude Code's loop, tools, context, safety and automation, then build a small one yourself.",
 "blocks": [
  {
   "type": "lead",
   "html": "A model only produces text. A <strong>harness</strong> is everything around it that turns that text into work: the loop that calls the model again after each tool result, the tools, the context it assembles, the permission checks, the sandbox, the hooks, the budget and the logs. Anthropic's docs describe Claude Code as exactly this: <a href='https://code.claude.com/docs/en/how-claude-code-works' target='_blank' rel='noopener'>the layer around the model that provides the tools and manages the context</a>. We study Claude Code because it is a mature, production harness with unusually complete public docs, so you can check every claim against the source. Its parts have direct counterparts in Codex CLI, GitHub Copilot, OpenCode and Gemini CLI (table below), so what you learn transfers. For the bigger picture, read OpenAI's <a href='https://openai.com/index/harness-engineering/' target='_blank' rel='noopener'>Harness engineering</a> (Feb 2026) and Anthropic's <a href='https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents' target='_blank' rel='noopener'>Effective harnesses for long-running agents</a> (Nov 2025) and <a href='https://www.anthropic.com/engineering/harness-design-long-running-apps' target='_blank' rel='noopener'>Harness design for long-running application development</a> (Mar 2026)."
  },
  {
   "type": "callout",
   "tone": "warn",
   "title": "Access and cost (checked Sep 2026)",
   "html": "Claude Code is not free. The free claude.ai plan does not include it; it needs a Pro plan (US$20/month, or US$17/month billed yearly, as of Sep 2026), Max, a Team or Enterprise seat, or pay-as-you-go API credits from the Claude Console. <a href='https://claude.com/pricing' target='_blank' rel='noopener'>Pricing</a> · <a href='https://code.claude.com/docs/en/setup' target='_blank' rel='noopener'>System requirements</a>.<br>There is no individual student discount. <a href='https://claude.com/solutions/education' target='_blank' rel='noopener'>Claude for Education</a> is a plan a university buys for all its students; SUP'COM would have to sign up. The <a href='https://claude.com/programs/campus' target='_blank' rel='noopener'>Claude campus programs</a> (Builder Clubs and ambassadors, with a stipend) accept students worldwide, but the 2026 application window was 1 to 12 September.<br>No access? The Claude Academy courses are free, the docs are public, and every lab on this page works in <a href='#/tools'>free harnesses</a> such as OpenCode or GitHub Copilot's student plan. Use the mapping table below to translate each step."
  },
  {
   "type": "h",
   "text": "The loop at a glance",
   "id": "loop"
  },
  {
   "type": "diagram",
   "title": "One turn in Claude Code. Labels in colour are component ids below.",
   "svg": "<svg viewBox='0 0 520 734' xmlns='http://www.w3.org/2000/svg' role='img' aria-labelledby='hz-t hz-d' style='width:100%;height:auto;max-width:620px'><title id='hz-t'>The Claude Code agent loop</title><desc id='hz-d'>Your prompt goes through context assembly to the model. If the model answers with text, the turn ends. If it asks for a tool, the call passes hooks and permission rules, runs (shell commands inside the sandbox), and the result is added to the context before the next model call.</desc><defs><marker id='hz-arr' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'><path d='M0,0 L10,5 L0,10 z' style='fill:var(--muted)'/></marker></defs><rect x='56' y='10' width='330' height='76' rx='10' style='fill:var(--surface);stroke:var(--line);stroke-width:1.5'/><text x='70' y='34' style='font-family:inherit;fill:var(--text);font-size:15px;font-weight:600'>1 · Your prompt</text><text x='70' y='54' style='font-family:inherit;fill:var(--muted);font-size:13px'>terminal, IDE, claude -p, SDK or CI</text><text x='70' y='74' style='font-family:ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--accent);font-size:12px'>slash-commands · headless</text><path d='M221,86 L221,106' style='stroke:var(--muted);stroke-width:1.6;fill:none' marker-end='url(#hz-arr)'/><rect x='56' y='108' width='330' height='136' rx='10' style='fill:var(--surface);stroke:var(--line);stroke-width:1.5'/><text x='70' y='132' style='font-family:inherit;fill:var(--text);font-size:15px;font-weight:600'>2 · Context assembly</text><text x='70' y='152' style='font-family:inherit;fill:var(--muted);font-size:13px'>system prompt + output style</text><text x='70' y='170' style='font-family:inherit;fill:var(--muted);font-size:13px'>CLAUDE.md + auto memory (MEMORY.md)</text><text x='70' y='188' style='font-family:inherit;fill:var(--muted);font-size:13px'>skill and subagent descriptions</text><text x='70' y='206' style='font-family:inherit;fill:var(--muted);font-size:13px'>tool definitions, MCP tool names</text><text x='70' y='232' style='font-family:ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--accent);font-size:12px'>claude-md · memory · skills · context</text><path d='M221,244 L221,264' style='stroke:var(--muted);stroke-width:1.6;fill:none' marker-end='url(#hz-arr)'/><rect x='56' y='266' width='330' height='76' rx='10' style='fill:var(--surface);stroke:var(--accent);stroke-width:2'/><text x='70' y='290' style='font-family:inherit;fill:var(--text);font-size:15px;font-weight:600'>3 · Model call</text><text x='70' y='310' style='font-family:inherit;fill:var(--muted);font-size:13px'>answer with text, or request tool calls</text><text x='70' y='330' style='font-family:ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--accent);font-size:12px'>agent-loop</text><path d='M386,304 L420,304' style='stroke:var(--muted);stroke-width:1.6;fill:none' marker-end='url(#hz-arr)'/><rect x='422' y='276' width='90' height='56' rx='10' style='fill:var(--surface);stroke:var(--line);stroke-width:1.5'/><text x='467' y='300' text-anchor='middle' style='font-family:inherit;fill:var(--text);font-size:15px;font-weight:600'>Done</text><text x='467' y='319' text-anchor='middle' style='font-family:inherit;fill:var(--muted);font-size:13px'>no tool call</text><path d='M221,342 L221,362' style='stroke:var(--muted);stroke-width:1.6;fill:none' marker-end='url(#hz-arr)'/><text x='230' y='357' text-anchor='start' style='font-family:inherit;fill:var(--muted);font-size:13px'>tool_use</text><rect x='56' y='364' width='330' height='118' rx='10' style='fill:var(--surface);stroke:var(--line);stroke-width:1.5'/><text x='70' y='388' style='font-family:inherit;fill:var(--text);font-size:15px;font-weight:600'>4 · Gate</text><text x='70' y='408' style='font-family:inherit;fill:var(--muted);font-size:13px'>PreToolUse hooks (exit 2 = block)</text><text x='70' y='426' style='font-family:inherit;fill:var(--muted);font-size:13px'>deny, then ask, then allow rules</text><text x='70' y='444' style='font-family:inherit;fill:var(--muted);font-size:13px'>permission mode (plan, auto...)</text><text x='70' y='470' style='font-family:ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--accent);font-size:12px'>hooks · permissions · plan-mode</text><path d='M221,482 L221,502' style='stroke:var(--muted);stroke-width:1.6;fill:none' marker-end='url(#hz-arr)'/><rect x='56' y='504' width='330' height='134' rx='10' style='fill:var(--surface);stroke:var(--line);stroke-width:1.5'/><text x='70' y='528' style='font-family:inherit;fill:var(--text);font-size:15px;font-weight:600'>5 · Execute</text><text x='70' y='548' style='font-family:inherit;fill:var(--muted);font-size:13px'>built-in tool, MCP tool or subagent</text><text x='70' y='566' style='font-family:inherit;fill:var(--muted);font-size:13px'>Bash runs inside the OS sandbox</text><text x='70' y='584' style='font-family:inherit;fill:var(--muted);font-size:13px'>file edits snapshotted first</text><text x='70' y='610' style='font-family:ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--accent);font-size:12px'>tools · mcp · subagents</text><text x='70' y='626' style='font-family:ui-monospace,SFMono-Regular,Menlo,monospace;fill:var(--accent);font-size:12px'>sandboxing · checkpoints</text><path d='M221,638 L221,658' style='stroke:var(--muted);stroke-width:1.6;fill:none' marker-end='url(#hz-arr)'/><rect x='56' y='660' width='330' height='64' rx='10' style='fill:var(--surface);stroke:var(--line);stroke-width:1.5'/><text x='70' y='684' style='font-family:inherit;fill:var(--text);font-size:15px;font-weight:600'>6 · Result into context</text><text x='70' y='704' style='font-family:inherit;fill:var(--muted);font-size:13px'>PostToolUse hooks, then the next call</text><path d='M56,692 L24,692 L24,304 L54,304' style='stroke:var(--muted);stroke-width:1.6;fill:none' marker-end='url(#hz-arr)'/><text x='16' y='498' transform='rotate(-90 16 498)' text-anchor='middle' style='font-family:inherit;fill:var(--muted);font-size:13px'>repeat until done or budget hit</text></svg>"
  },
  {
   "type": "p",
   "html": "Two ideas carry the whole page. First, the <a data-cc='agent-loop'>loop</a> runs until the model stops asking for tools or a budget stops it. Second, anything that must always happen belongs in the harness (<a data-cc='hooks'>hooks</a>, <a data-cc='permissions'>permission rules</a>, the <a data-cc='sandboxing'>sandbox</a>), because instructions in context (<a data-cc='claude-md'>CLAUDE.md</a>, <a data-cc='skills'>skills</a>) are followed most of the time, not every time. Anthropic's <a href='https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more' target='_blank' rel='noopener'>Steering Claude Code</a> post (Jun 2026) makes the same split."
  },
  {
   "type": "h",
   "text": "Components",
   "id": "components"
  },
  {
   "type": "components",
   "id": "cc",
   "intro": "Click a card for what it does, why a harness needs it, a working example, a 5 to 15 minute exercise and the official docs. Groups: Core loop, Context, Extensibility, Safety, Automation, Operations. Other pages of this guide link here whenever they mention one of these ideas.",
   "items": [
    {
     "id": "agent-loop",
     "group": "Core loop",
     "name": "Agent loop",
     "icon": "loop",
     "oneLiner": "Call the model, run the tools it asks for, feed results back, repeat until it stops asking.",
     "what": "You send a prompt. Claude Code adds the system prompt, your instruction files and the tool definitions, then calls the model. If the reply contains tool calls, Claude Code runs them and sends the results back in the next call. A reply with no tool calls ends the turn. Every message, tool call and result is appended to a plaintext JSONL transcript under <code>~/.claude/projects/</code>, which is what makes <code>--resume</code>, forking and rewind possible. You can press <code>Esc</code> at any point to interrupt and steer.",
     "why": "This loop is the smallest thing that deserves the word agent. Your capstone agent needs the same four parts: a stop condition (no more tool calls), a budget (max steps or dollars), a transcript you can replay, and a way for a human to interrupt. Lab B has you write this loop yourself in about 120 lines.",
     "example": {
      "lang": "text",
      "title": "The loop, stripped down",
      "text": "messages = [system, user_prompt]\nwhile True:\n    reply = model(messages, tools)          # one turn\n    log(reply)                              # JSONL transcript\n    if not reply.tool_calls:\n        return reply.text                   # stop condition\n    for call in reply.tool_calls:\n        if not allowed(call):               # hooks + permission rules\n            result = \"denied: <reason>\"\n        else:\n            result = run(call)              # sandboxed for shell commands\n        messages.append(result)             # feeds the next turn\n    if over_budget(): stop()                # --max-turns / --max-budget-usd"
     },
     "tryIt": "Run <code>claude</code> in a small repo and ask: <em>Run the tests and explain the first failure.</em> Then run <code>ls -t ~/.claude/projects/*/*.jsonl | head -1</code> to find the newest transcript and <code>grep -c '\"tool_use\"' &lt;that file&gt;</code>. The count is the number of tool calls the loop made. Compare it with what you saw on screen.",
     "links": [
      {
       "t": "How Claude Code works",
       "url": "https://code.claude.com/docs/en/how-claude-code-works",
       "kind": "docs"
      },
      {
       "t": "How the agent loop works (Agent SDK)",
       "url": "https://code.claude.com/docs/en/agent-sdk/agent-loop",
       "kind": "docs"
      },
      {
       "t": "Claude Code 101 (Claude Academy, free)",
       "url": "https://academy.claude.com/courses/claude-code-101",
       "kind": "course"
      },
      {
       "t": "Building effective agents (Anthropic, Dec 2024)",
       "url": "https://www.anthropic.com/engineering/building-effective-agents",
       "kind": "read"
      }
     ],
     "related": [
      "tools",
      "context",
      "permissions",
      "headless"
     ]
    },
    {
     "id": "tools",
     "group": "Core loop",
     "name": "Built-in tools",
     "icon": "tools",
     "oneLiner": "The actions the model can request: read, edit, run shell commands, search the web, spawn subagents.",
     "what": "Claude Code ships tools in five families: file operations (<code>Read</code>, <code>Edit</code>, <code>Write</code>), search, execution (<code>Bash</code>, <code>PowerShell</code>, <code>Monitor</code>), web (<code>WebFetch</code>, <code>WebSearch</code>) and code intelligence (<code>LSP</code>, through plugins). Orchestration tools include <code>Agent</code> (subagents), <code>Skill</code> and <code>AskUserQuestion</code>. On macOS, Linux and WSL the default set leaves out <code>Glob</code> and <code>Grep</code>: Claude searches with <code>find</code> and <code>grep</code> through <code>Bash</code>, so those searches reach your hooks and rules as Bash calls. MCP tools are deferred by default: only their names sit in context until Claude loads one with tool search.",
     "why": "Tools are the interface between your agent and the world. Fewer, well-described tools with narrow inputs are easier to secure and easier for the model to use correctly. Start your own agent with 3 to 5 tools and add more only when a trace shows the model needs them.",
     "example": {
      "lang": "bash",
      "title": "Restrict the tool set for one run",
      "text": "# only these built-in tools exist in this session\nclaude -p \"Summarise src/ and list the public functions\" --tools \"Read,Glob,Grep\"\n\n# no built-in tools at all: a plain chat with your project context\nclaude --tools \"\""
     },
     "tryIt": "Start <code>claude --tools \"Read\"</code> and ask it to run your tests. Observe that it cannot, and says so. Restart with <code>--tools \"default\"</code> and ask again. Write down, for your own project, which of your planned tools are read-only and which change state.",
     "links": [
      {
       "t": "Tools reference",
       "url": "https://code.claude.com/docs/en/tools-reference",
       "kind": "docs"
      },
      {
       "t": "CLI reference (--tools, --allowedTools)",
       "url": "https://code.claude.com/docs/en/cli-reference",
       "kind": "docs"
      },
      {
       "t": "Writing effective tools for AI agents (Sep 2025)",
       "url": "https://www.anthropic.com/engineering/writing-tools-for-agents",
       "kind": "read"
      }
     ],
     "related": [
      "agent-loop",
      "permissions",
      "mcp",
      "subagents"
     ]
    },
    {
     "id": "permissions",
     "group": "Safety",
     "name": "Permissions",
     "icon": "lock",
     "oneLiner": "Rules and modes, enforced by the harness, that decide which tool calls run, ask or are refused.",
     "what": "Rules have the form <code>Tool</code> or <code>Tool(specifier)</code>, for example <code>Bash(npm run *)</code>, <code>Read(./.env)</code> or <code>WebFetch(domain:pypi.org)</code>. Claude Code evaluates deny rules first, then ask, then allow; the first match wins, so a broad deny beats a narrow allow. A permission mode sets the baseline: <code>default</code> (shown as Manual: only reads run without asking), <code>acceptEdits</code>, <code>plan</code>, <code>auto</code> (a classifier reviews actions), <code>dontAsk</code> (for CI: anything not pre-approved is denied) and <code>bypassPermissions</code> (containers and VMs only). Press <code>Shift+Tab</code> to cycle modes and run <code>/permissions</code> to see every rule and the file it came from.",
     "why": "The docs say it plainly: permission rules are enforced by Claude Code, not by the model. Instructions in a prompt or CLAUDE.md are suggestions; a deny rule is a guarantee. Your agent needs the same split: the model proposes, deterministic code outside the model decides. This is the permission gate you build and unit-test in Lab B.",
     "example": {
      "lang": "json",
      "title": ".claude/settings.json",
      "text": "{\n  \"permissions\": {\n    \"allow\": [\"Bash(pytest *)\", \"Bash(git diff *)\", \"Bash(git status)\"],\n    \"ask\":   [\"Bash(git push *)\"],\n    \"deny\":  [\"Read(./.env)\", \"Read(./secrets/**)\", \"Bash(curl *)\"]\n  }\n}"
     },
     "tryIt": "Add the rules above to a test repo. Ask Claude to <em>print the contents of .env</em>. It should be refused without a prompt. Ask it to <em>run pytest</em>: it should run without asking. Run <code>/permissions</code> and find both rules with their source file. Then write the equivalent rule table for your own project's tools.",
     "links": [
      {
       "t": "Configure permissions",
       "url": "https://code.claude.com/docs/en/permissions",
       "kind": "docs"
      },
      {
       "t": "Choose a permission mode",
       "url": "https://code.claude.com/docs/en/permission-modes",
       "kind": "docs"
      },
      {
       "t": "How we built Claude Code auto mode (Anthropic Engineering, Mar 2026)",
       "url": "https://www.anthropic.com/engineering/claude-code-auto-mode",
       "kind": "read"
      }
     ],
     "related": [
      "hooks",
      "sandboxing",
      "plan-mode",
      "settings"
     ]
    },
    {
     "id": "sandboxing",
     "group": "Safety",
     "name": "Sandboxing",
     "icon": "box",
     "oneLiner": "OS-level limits on what shell commands can write and which hosts they can reach.",
     "what": "With the sandbox on, every <code>Bash</code>, <code>PowerShell</code> and <code>Monitor</code> command and its child processes run under filesystem and network isolation enforced by the operating system: Seatbelt on macOS, bubblewrap on Linux and WSL2 (install <code>bubblewrap</code> and <code>socat</code>). By default commands can write only to the working directory, added directories and a temp directory, and every new network domain needs approval. Files Claude Code loads configuration from, such as <code>.claude/settings.json</code>, <code>.claude/hooks/</code> and <code>.mcp.json</code>, stay write-protected even inside the project. Native Windows is not supported; use WSL2. Run <code>/sandbox</code> to turn it on.",
     "why": "Permissions decide which tool calls happen. The sandbox limits the damage when an allowed command does something you did not expect, for example after a prompt injection in a file the agent read. Any capstone agent that executes code (tests, generated scripts) must run that code in a sandbox or container. Name the boundary in your report and show a test where it holds.",
     "example": {
      "lang": "json",
      "title": ".claude/settings.json",
      "text": "{\n  \"sandbox\": {\n    \"enabled\": true,\n    \"filesystem\": {\n      \"denyRead\": [\"~/.ssh\", \"~/.aws\"]\n    },\n    \"network\": {\n      \"allowedDomains\": [\"pypi.org\", \"files.pythonhosted.org\"]\n    }\n  }\n}"
     },
     "tryIt": "Run <code>/sandbox</code> and pick auto-allow. Ask Claude to run <code>touch ~/outside-test.txt</code>: the write fails with <code>Operation not permitted</code> (or Claude asks to retry unsandboxed, titled \"Bash command (unsandboxed)\"). Ask it to run <code>curl -sI https://example.com</code>: you get a domain approval prompt. Both results prove the boundary is enforced below the model.",
     "links": [
      {
       "t": "Configure the sandboxed Bash tool",
       "url": "https://code.claude.com/docs/en/sandboxing",
       "kind": "docs"
      },
      {
       "t": "Sandbox environments (containers, VMs)",
       "url": "https://code.claude.com/docs/en/sandbox-environments",
       "kind": "docs"
      },
      {
       "t": "Making Claude Code more secure and autonomous with sandboxing (Oct 2025)",
       "url": "https://www.anthropic.com/engineering/claude-code-sandboxing",
       "kind": "read"
      }
     ],
     "related": [
      "permissions",
      "hooks",
      "headless"
     ]
    },
    {
     "id": "claude-md",
     "group": "Context",
     "name": "CLAUDE.md and rules",
     "icon": "file",
     "oneLiner": "Instruction files the harness loads into every session: build commands, conventions, layout.",
     "what": "Claude Code loads <code>CLAUDE.md</code> (or <code>.claude/CLAUDE.md</code>) from the working directory and every directory above it, plus <code>~/.claude/CLAUDE.md</code> for personal preferences and <code>CLAUDE.local.md</code> for uncommitted ones. Files in subdirectories load when Claude reads files there. <code>@path</code> imports pull in other files (up to four hops). Rules in <code>.claude/rules/*.md</code> with a <code>paths:</code> frontmatter load only when Claude touches matching files. If a repo has only <code>AGENTS.md</code>, Claude Code reads that instead. <code>/init</code> writes a first draft. The docs recommend under 200 lines per file.",
     "why": "This is the cheapest context engineering you can do, and every harness has an equivalent (<code>AGENTS.md</code>, <code>GEMINI.md</code>, <code>copilot-instructions.md</code>). It is still only context: the model can ignore it. Keep facts here and put anything that must always happen in a hook. Your capstone repo needs one, and the grading rubric checks that it visibly shapes behaviour.",
     "example": {
      "lang": "md",
      "title": "CLAUDE.md",
      "text": "# Project: pr-review-bot\n\n## Commands\n- Install: `uv sync`\n- Test: `uv run pytest -q` (run before saying a task is done)\n- Lint: `uv run ruff check .`\n\n## Layout\n- `src/bot/` agent loop and tools, `evals/` golden PRs and scorer\n\n## Rules\n- Never call the model API in unit tests; use the fake client in `tests/fakes.py`\n- New tools need a permission-gate test in `tests/test_gate.py`\n\nSee @docs/architecture.md for the component diagram.\n\n# Compact instructions\nKeep the list of failing tests and the files changed."
     },
     "tryIt": "Run <code>/init</code> in your capstone repo, then cut the result to under 60 lines of facts Claude could not guess. Add one checkable rule, for example <em>end every answer with the line DONE</em>. Start a new session, ask a question, and confirm the rule is followed. Run <code>/context</code> and find the file under memory files.",
     "links": [
      {
       "t": "How Claude remembers your project",
       "url": "https://code.claude.com/docs/en/memory",
       "kind": "docs"
      },
      {
       "t": "Best practices",
       "url": "https://code.claude.com/docs/en/best-practices",
       "kind": "docs"
      },
      {
       "t": "Claude Code 101 (Claude Academy, free)",
       "url": "https://academy.claude.com/courses/claude-code-101",
       "kind": "course"
      },
      {
       "t": "Steering Claude Code: when to use CLAUDE.md, skills, hooks and subagents (Jun 2026)",
       "url": "https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more",
       "kind": "read"
      }
     ],
     "related": [
      "memory",
      "context",
      "skills",
      "hooks"
     ]
    },
    {
     "id": "memory",
     "group": "Context",
     "name": "Auto memory",
     "icon": "brain",
     "oneLiner": "Notes Claude writes for itself and reloads next session: your preferences and corrections.",
     "what": "Auto memory is on by default. Claude saves notes of four types (<code>user</code>, <code>feedback</code>, <code>project</code>, <code>reference</code>) as markdown files in <code>~/.claude/projects/&lt;project&gt;/memory/</code>, with a <code>MEMORY.md</code> index. The first 200 lines or 25 KB of <code>MEMORY.md</code> load at the start of every session; topic files are read on demand. It skips anything it can derive from the code or that CLAUDE.md already says. The files are plain markdown on your machine: browse them with <code>/memory</code>, edit or delete them freely, or turn the feature off with <code>autoMemoryEnabled: false</code>.",
     "why": "Sessions start with an empty context window. Something has to carry knowledge across them: files you write (CLAUDE.md), files the agent writes (auto memory), or progress files like the ones in Anthropic's long-running harness post. If your agent runs more than once on the same repo or user, decide which memory it keeps, who can edit it, and how you would test that a stale memory does not break it.",
     "example": {
      "lang": "text",
      "title": "What auto memory looks like on disk",
      "text": "~/.claude/projects/<project>/memory/\n├── MEMORY.md            # index, one line per memory, loaded every session\n├── user_role.md         # type: user\n├── feedback_testing.md  # type: feedback, e.g. \"use pytest -q, not unittest\"\n└── ...\n\n# settings.json: turn it off for one project\n{ \"autoMemoryEnabled\": false }"
     },
     "tryIt": "In a session, correct Claude once on something specific (for example <em>in this repo always use uv, never pip</em>). Watch for a <em>Saved memory</em> notice. Run <code>ls ~/.claude/projects/*/memory/</code> and open <code>MEMORY.md</code>. Start a fresh session and ask it to install a package: it should use uv without being told.",
     "links": [
      {
       "t": "Auto memory (docs)",
       "url": "https://code.claude.com/docs/en/memory",
       "kind": "docs"
      },
      {
       "t": "Effective harnesses for long-running agents (Nov 2025)",
       "url": "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents",
       "kind": "read"
      }
     ],
     "related": [
      "claude-md",
      "context",
      "subagents"
     ]
    },
    {
     "id": "context",
     "group": "Context",
     "name": "Context window",
     "icon": "layers",
     "oneLiner": "What the model sees on each call, and how the harness keeps it from overflowing.",
     "what": "Before you type anything, the context holds the system prompt, output style, CLAUDE.md files, auto memory, skill descriptions and MCP tool names. Each file read and command output adds to it. When it nears the limit, Claude Code first clears older tool outputs, then summarises the conversation. After compaction, the project-root CLAUDE.md and auto memory are re-injected from disk, invoked skills come back capped at 5,000 tokens each, and up to five recently used files are re-read. <code>/context</code> shows a live breakdown; <code>/compact focus on ...</code> steers the summary; <code>/clear</code> starts fresh.",
     "why": "Context is the scarce resource of every agent. What you put in, in what order, and what you drop decides quality and cost. Measure it in your own agent: log input tokens per step and watch how they grow in your trace. Anthropic's context engineering post is the reference reading.",
     "example": {
      "lang": "text",
      "title": "Commands",
      "text": "/context                         # breakdown by category, with suggestions\n/compact focus on the failing auth tests\n/clear                           # new conversation, empty context\n/rewind -> Summarize from here   # compress only part of the conversation"
     },
     "tryIt": "Start a session and run <code>/context</code>; note the total. Ask Claude to read three large files and run <code>/context</code> again. Then run <code>/clear</code> and ask a subagent to read the same files and summarise them; run <code>/context</code> a third time. The difference shows why subagents exist.",
     "links": [
      {
       "t": "Explore the context window",
       "url": "https://code.claude.com/docs/en/context-window",
       "kind": "docs"
      },
      {
       "t": "When context fills up",
       "url": "https://code.claude.com/docs/en/how-claude-code-works",
       "kind": "docs"
      },
      {
       "t": "Effective context engineering for AI agents (Sep 2025)",
       "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
       "kind": "read"
      },
      {
       "t": "Claude Code in Action (Claude Academy, free)",
       "url": "https://academy.claude.com/courses/claude-code-in-action",
       "kind": "course"
      }
     ],
     "related": [
      "claude-md",
      "memory",
      "subagents",
      "skills",
      "cost-tracking"
     ]
    },
    {
     "id": "slash-commands",
     "group": "Extensibility",
     "name": "Slash commands",
     "icon": "slash",
     "oneLiner": "Typed shortcuts: built-in commands with fixed logic, plus your own prompt templates.",
     "what": "Built-in commands control the harness itself: <code>/init</code>, <code>/context</code>, <code>/compact</code>, <code>/clear</code>, <code>/rewind</code>, <code>/usage</code> (alias <code>/cost</code>), <code>/permissions</code>, <code>/hooks</code>, <code>/mcp</code>, <code>/plugin</code>, <code>/memory</code>, <code>/model</code>, <code>/config</code>. Custom commands have been merged into skills: a file at <code>.claude/commands/deploy.md</code> and a skill at <code>.claude/skills/deploy/SKILL.md</code> both create <code>/deploy</code>. Some bundled commands such as <code>/code-review</code>, <code>/debug</code> and <code>/loop</code> are prompt-based skills. Type <code>/</code> to see the full list for your version.",
     "why": "Commands are the human entry points into the loop. Your agent will have them too: a CLI subcommand, a webhook, a <code>/review</code> comment trigger. Separate commands that manage the harness (clear, compact, budget) from commands that start agent work.",
     "example": {
      "lang": "md",
      "title": ".claude/commands/fix-issue.md",
      "text": "---\ndescription: Fix a GitHub issue by number\nargument-hint: [issue-number]\n---\n\nRead issue #$ARGUMENTS with `gh issue view $ARGUMENTS`.\nWrite a failing test first, then fix it, then run `uv run pytest -q`.\nStop and report if the fix touches more than 3 files."
     },
     "tryIt": "Create the file above in a repo that has GitHub issues and the <code>gh</code> CLI. Type <code>/fix</code> and check it autocompletes with the argument hint. Run it on a small issue and verify the test-first order in the transcript.",
     "links": [
      {
       "t": "Commands reference",
       "url": "https://code.claude.com/docs/en/commands",
       "kind": "docs"
      },
      {
       "t": "Skills (custom commands merged here)",
       "url": "https://code.claude.com/docs/en/skills",
       "kind": "docs"
      },
      {
       "t": "Interactive mode",
       "url": "https://code.claude.com/docs/en/interactive-mode",
       "kind": "docs"
      }
     ],
     "related": [
      "skills",
      "plugins",
      "headless"
     ]
    },
    {
     "id": "skills",
     "group": "Extensibility",
     "name": "Skills",
     "icon": "book",
     "oneLiner": "Folders with a SKILL.md: only the description sits in context until the skill is used.",
     "what": "A skill is a directory with a <code>SKILL.md</code> file: YAML frontmatter (<code>description</code> is the one that matters) and markdown instructions, plus optional scripts and reference files. Claude sees every skill's description at session start and loads the full body only when it invokes the skill or you type <code>/skill-name</code>. Project skills live in <code>.claude/skills/</code>, personal ones in <code>~/.claude/skills/</code>. Frontmatter can restrict invocation (<code>disable-model-invocation: true</code>), pre-approve tools (<code>allowed-tools</code>), limit activation to paths, or run the skill in a forked subagent (<code>context: fork</code>). A line like <code>!`git diff HEAD`</code> runs the command and inlines its output before Claude reads the skill. Skills follow the open Agent Skills standard: Copilot, OpenCode, Gemini CLI and Codex all load <code>SKILL.md</code> folders, and Copilot and OpenCode even read <code>.claude/skills/</code> directly.",
     "why": "Skills solve the too-much-context problem for procedures: a long checklist costs about one line until needed. In your project, anything that is a procedure (how to review a PR, how to write a migration, how to triage a bug) belongs in a skill, and the rubric asks for at least one that clearly changes behaviour. Test it: run the same task with and without the skill and compare against your eval set.",
     "example": {
      "lang": "md",
      "title": ".claude/skills/test-report/SKILL.md",
      "text": "---\nname: test-report\ndescription: Runs the test suite and reports failures as a table. Use when the user asks about test status, failing tests, or whether the build is green.\nallowed-tools: Bash(uv run pytest *)\n---\n\n## Current branch\n!`git branch --show-current`\n\n## Steps\n1. Run `uv run pytest -q --tb=line`.\n2. Output a markdown table: test | file:line | one-line cause.\n3. End with `GREEN` if 0 failures, otherwise `RED (n failing)`."
     },
     "tryIt": "Create the skill above (swap in your own test command). Run <code>/skills</code> and check it is listed. Ask in plain words <em>is the build green?</em> and confirm Claude invokes the skill on its own and ends with GREEN or RED. Then set <code>disable-model-invocation: true</code>, restart, ask again, and confirm it no longer triggers unless you type <code>/test-report</code>.",
     "links": [
      {
       "t": "Extend Claude with skills",
       "url": "https://code.claude.com/docs/en/skills",
       "kind": "docs"
      },
      {
       "t": "Introduction to agent skills (Claude Academy)",
       "url": "https://academy.claude.com/courses/introduction-to-agent-skills",
       "kind": "course"
      },
      {
       "t": "Equipping agents for the real world with Agent Skills (Oct 2025)",
       "url": "https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills",
       "kind": "read"
      },
      {
       "t": "Agent Skills open standard",
       "url": "https://agentskills.io",
       "kind": "docs"
      }
     ],
     "related": [
      "slash-commands",
      "subagents",
      "plugins",
      "context"
     ]
    },
    {
     "id": "subagents",
     "group": "Extensibility",
     "name": "Subagents",
     "icon": "fork",
     "oneLiner": "Helpers with their own context window, prompt, tools and model; only their summary comes back.",
     "what": "A subagent is a markdown file with frontmatter (<code>name</code>, <code>description</code>, optional <code>tools</code>, <code>model</code>, <code>permissionMode</code>, <code>maxTurns</code>, <code>skills</code>, <code>mcpServers</code>, <code>isolation: worktree</code>) whose body becomes its system prompt. Claude delegates through the <code>Agent</code> tool when a task matches the description, or when you name the agent. Built-ins include Explore and Plan (read-only, fast) and General-purpose. Project agents live in <code>.claude/agents/</code>, personal ones in <code>~/.claude/agents/</code>. Since v2.1.198 <code>/agents</code> no longer opens a wizard: ask Claude to write the file or write it yourself. For parallel sessions that talk to each other, see agent teams.",
     "why": "Subagents give you context isolation, least privilege per role (a reviewer with no <code>Edit</code>), and cheaper models for bulk work. They also cost more tokens overall and add a hand-off where information can be lost. Your multi-agent design should justify each agent with a measured benefit, not a diagram.",
     "example": {
      "lang": "md",
      "title": ".claude/agents/test-runner.md",
      "text": "---\nname: test-runner\ndescription: Runs the test suite and diagnoses failures. Use after code changes or when asked why tests fail.\ntools: Read, Grep, Glob, Bash\nmodel: haiku\nmaxTurns: 8\n---\n\nYou run tests and explain failures. You never edit files.\n1. Run `uv run pytest -q`.\n2. For each failure, read the test and the code under test.\n3. Reply with at most 10 lines: failing test, root cause, suggested fix."
     },
     "tryIt": "Create the file, then ask <em>Use the test-runner agent to check the tests.</em> The transcript shows a row like <code>test-runner(...)</code>. Ask it to fix a failure and confirm it cannot, since <code>Edit</code> is not in its tools. Compare <code>/context</code> with the same request done in the main conversation.",
     "links": [
      {
       "t": "Create custom subagents",
       "url": "https://code.claude.com/docs/en/sub-agents",
       "kind": "docs"
      },
      {
       "t": "Agent teams",
       "url": "https://code.claude.com/docs/en/agent-teams",
       "kind": "docs"
      },
      {
       "t": "Introduction to subagents (Claude Academy)",
       "url": "https://academy.claude.com/courses/introduction-to-subagents",
       "kind": "course"
      }
     ],
     "related": [
      "context",
      "skills",
      "permissions",
      "agent-sdk"
     ]
    },
    {
     "id": "hooks",
     "group": "Extensibility",
     "name": "Hooks",
     "icon": "hook",
     "oneLiner": "Your code, run by the harness at fixed lifecycle events, able to block tool calls.",
     "what": "Hooks are handlers registered in settings (or in a plugin, skill or subagent) for events such as <code>SessionStart</code>, <code>UserPromptSubmit</code>, <code>PreToolUse</code>, <code>PermissionRequest</code>, <code>PostToolUse</code>, <code>PostToolUseFailure</code>, <code>SubagentStop</code>, <code>PreCompact</code>, <code>Stop</code> and <code>SessionEnd</code>; the reference lists over 30. A handler can be a shell command, an HTTP endpoint, an MCP tool, a one-shot prompt or an agent. Command hooks get the event as JSON on stdin. For most events, exit code 2 blocks the action and sends your stderr back to Claude; exit code 1 does not block. A <code>matcher</code> filters by tool name and an <code>if</code> field filters by arguments using permission-rule syntax.",
     "why": "Hooks turn \"please always\" into \"always\". Formatting after every edit, blocking dangerous commands, logging every tool call for an audit trail, re-injecting context after compaction: all deterministic. Your agent's guardrails and observability are hooks in this sense, whatever you call them in your code.",
     "example": {
      "lang": "json",
      "title": ".claude/settings.json",
      "text": "{\n  \"hooks\": {\n    \"PreToolUse\": [\n      {\n        \"matcher\": \"Bash|Edit|Write\",\n        \"hooks\": [\n          { \"type\": \"command\", \"command\": \"python3 \\\"$CLAUDE_PROJECT_DIR\\\"/.claude/hooks/guard.py\" }\n        ]\n      }\n    ],\n    \"PostToolUse\": [\n      {\n        \"matcher\": \"Edit|Write\",\n        \"hooks\": [ { \"type\": \"command\", \"command\": \"uv run ruff format --quiet .\" } ]\n      }\n    ]\n  }\n}"
     },
     "tryIt": "Do Lab A step 3 below: a <code>PreToolUse</code> hook that blocks <code>rm -rf</code> and edits to <code>.env</code>. Test the script offline first by piping a JSON event into it and checking <code>echo $?</code> prints 2. Then check <code>/hooks</code> lists it and trigger it for real.",
     "links": [
      {
       "t": "Automate actions with hooks",
       "url": "https://code.claude.com/docs/en/hooks-guide",
       "kind": "docs"
      },
      {
       "t": "Hooks reference (all events)",
       "url": "https://code.claude.com/docs/en/hooks",
       "kind": "docs"
      },
      {
       "t": "Steering Claude Code: when to use CLAUDE.md, skills, hooks and subagents (Jun 2026)",
       "url": "https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more",
       "kind": "read"
      },
      {
       "t": "Claude Code 101 (Claude Academy, free)",
       "url": "https://academy.claude.com/courses/claude-code-101",
       "kind": "course"
      }
     ],
     "related": [
      "permissions",
      "settings",
      "plugins",
      "sandboxing"
     ]
    },
    {
     "id": "mcp",
     "group": "Extensibility",
     "name": "MCP servers",
     "icon": "plug",
     "oneLiner": "Connect external tools and data through the open Model Context Protocol.",
     "what": "An MCP server exposes tools (and resources and prompts) over a standard protocol. Add one with <code>claude mcp add --transport http &lt;name&gt; &lt;url&gt;</code> for a remote server or <code>claude mcp add --transport stdio &lt;name&gt; -- &lt;command&gt;</code> for a local process. Scopes: local (the default, private to you in this project), project (<code>.mcp.json</code>, committed for the team) and user (all your projects). Local and user servers are stored in <code>~/.claude.json</code>. Interactive sessions ask before using a project's <code>.mcp.json</code> servers; <code>claude -p</code> and SDK runs load them without asking. MCP tool definitions are deferred and loaded on demand. <code>/mcp</code> shows status and handles OAuth.",
     "why": "MCP means you write a tool once and any MCP-capable harness can use it: Claude Code, Codex, Copilot, OpenCode, Gemini CLI. For your capstone, exposing your agent's domain tools as an MCP server keeps you vendor-neutral and gives you a clean seam to test. Treat every third-party server as code you run with your permissions.",
     "example": {
      "lang": "json",
      "title": ".mcp.json (project scope)",
      "text": "{\n  \"mcpServers\": {\n    \"notion\": {\n      \"type\": \"http\",\n      \"url\": \"https://mcp.notion.com/mcp\"\n    },\n    \"evals\": {\n      \"command\": \"uv\",\n      \"args\": [\"run\", \"python\", \"-m\", \"evals.mcp_server\"]\n    }\n  }\n}"
     },
     "tryIt": "Write a 20-line stdio MCP server with the official Python SDK exposing one tool (for example <code>count_todos(path)</code>). Register it with <code>claude mcp add --transport stdio todos -- uv run python server.py</code>, run <code>claude mcp get todos</code> to confirm it connects, then ask Claude a question that needs the tool and find the <code>mcp__todos__count_todos</code> call in the transcript.",
     "links": [
      {
       "t": "Connect Claude Code to tools via MCP",
       "url": "https://code.claude.com/docs/en/mcp",
       "kind": "docs"
      },
      {
       "t": "MCP quickstart",
       "url": "https://code.claude.com/docs/en/mcp-quickstart",
       "kind": "docs"
      },
      {
       "t": "Introduction to Model Context Protocol (Claude Academy)",
       "url": "https://academy.claude.com/courses/introduction-to-model-context-protocol",
       "kind": "course"
      },
      {
       "t": "modelcontextprotocol.io",
       "url": "https://modelcontextprotocol.io/",
       "kind": "docs"
      },
      {
       "t": "Code execution with MCP (Anthropic Engineering, Nov 2025)",
       "url": "https://www.anthropic.com/engineering/code-execution-with-mcp",
       "kind": "read"
      }
     ],
     "related": [
      "tools",
      "plugins",
      "permissions",
      "agent-sdk"
     ]
    },
    {
     "id": "plugins",
     "group": "Extensibility",
     "name": "Plugins and marketplaces",
     "icon": "package",
     "oneLiner": "Package skills, subagents, hooks, MCP servers and output styles as one installable unit.",
     "what": "A plugin is a directory with a manifest at <code>.claude-plugin/plugin.json</code> and component folders: <code>skills/</code>, <code>agents/</code>, <code>hooks/hooks.json</code>, <code>.mcp.json</code>, <code>output-styles/</code>. Its skills are namespaced, for example <code>/my-plugin:hello</code>. A marketplace is a git repo or folder with <code>.claude-plugin/marketplace.json</code> listing plugins. Claude Code adds Anthropic's official marketplace (<code>claude-plugins-official</code>) on your first interactive session. Install with <code>/plugin install name@marketplace</code>, test your own with <code>claude --plugin-dir ./my-plugin</code>, and check it with <code>claude plugin validate</code>. Every enabled plugin puts its descriptions in context and runs its hooks and servers as you.",
     "why": "Plugins are how a harness setup becomes shareable and versioned. If your team builds a reviewer skill, a guard hook and an MCP server, a plugin lets another team install all three in one step. Read a plugin's hooks and servers before installing it: that is supply-chain security for agents.",
     "example": {
      "lang": "text",
      "title": "Plugin layout",
      "text": "my-plugin/\n├── .claude-plugin/\n│   └── plugin.json      # {\"name\": \"my-plugin\", \"description\": \"...\", \"version\": \"0.1.0\"}\n├── skills/\n│   └── test-report/SKILL.md\n├── agents/\n│   └── test-runner.md\n├── hooks/\n│   └── hooks.json       # same shape as \"hooks\" in settings.json\n└── .mcp.json\n\n$ claude plugin validate ./my-plugin\n$ claude --plugin-dir ./my-plugin     # then run /my-plugin:test-report"
     },
     "tryIt": "Move the skill, subagent and hook from Lab A into a plugin folder. Run <code>claude plugin validate ./my-plugin</code> until it prints <code>Validation passed</code>. Start <code>claude --plugin-dir ./my-plugin</code> in a different repo and run <code>/my-plugin:test-report</code>. Open <code>/plugin</code> and read the official marketplace's list to see how others package theirs.",
     "links": [
      {
       "t": "Plugins overview",
       "url": "https://code.claude.com/docs/en/plugins/overview",
       "kind": "docs"
      },
      {
       "t": "Create a plugin",
       "url": "https://code.claude.com/docs/en/plugins/create",
       "kind": "docs"
      },
      {
       "t": "Install plugins and add marketplaces",
       "url": "https://code.claude.com/docs/en/plugins/install",
       "kind": "docs"
      }
     ],
     "related": [
      "skills",
      "subagents",
      "hooks",
      "mcp",
      "output-styles"
     ]
    },
    {
     "id": "output-styles",
     "group": "Context",
     "name": "Output styles",
     "icon": "style",
     "oneLiner": "Swap or extend the system prompt to change role, tone and format for a whole session.",
     "what": "Built-in styles besides Default are Proactive, Concise, Explanatory (adds short Insight blocks) and Learning (Claude leaves small pieces for you to write). A custom style is a markdown file in <code>~/.claude/output-styles/</code> or <code>.claude/output-styles/</code>. Its instructions go into the system prompt on every request. Custom styles drop Claude Code's software-engineering instructions unless the frontmatter sets <code>keep-coding-instructions: true</code>. Switch with <code>/output-style</code> or the <code>outputStyle</code> setting; subagents keep their own prompts.",
     "why": "Output styles show that a harness's system prompt is a component you can replace. The same loop and tools with a different system prompt produce a different agent. In your project, version your system prompt like code and include it in your eval runs, because changing it changes results.",
     "example": {
      "lang": "md",
      "title": ".claude/output-styles/reviewer.md",
      "text": "---\nname: Reviewer\ndescription: Terse code-review voice with severity tags\nkeep-coding-instructions: true\n---\n\nWhen you comment on code, tag each point [blocker], [major] or [nit].\nLead with blockers. Never more than 8 points. No praise lines."
     },
     "tryIt": "Run <code>/output-style learning</code> and ask Claude to add a small feature: it should leave a TODO for you to write. Then create the Reviewer style above, restart, select it, ask for a review of a recent diff, and check every point carries a tag.",
     "links": [
      {
       "t": "Output styles",
       "url": "https://code.claude.com/docs/en/output-styles",
       "kind": "docs"
      },
      {
       "t": "Modifying system prompts (Agent SDK)",
       "url": "https://code.claude.com/docs/en/agent-sdk/modifying-system-prompts",
       "kind": "docs"
      }
     ],
     "related": [
      "claude-md",
      "settings",
      "plugins"
     ]
    },
    {
     "id": "settings",
     "group": "Operations",
     "name": "Settings and scopes",
     "icon": "gear",
     "oneLiner": "Layered JSON config: managed, command line, local, project, user.",
     "what": "Four files hold settings: <code>~/.claude/settings.json</code> (you, every project), <code>.claude/settings.json</code> (the team, committed), <code>.claude/settings.local.json</code> (you, this project, kept out of git) and managed settings deployed by an organisation. Precedence from highest: managed, command-line flags (including <code>--settings</code>), local, project, user. Lists such as <code>permissions.allow</code> merge across files instead of replacing each other, and a deny at any level wins. Add <code>\"$schema\": \"https://json.schemastore.org/claude-code-settings.json\"</code> for autocomplete. Project allow rules and hooks only apply after you accept the workspace trust dialog.",
     "why": "Your agent will need the same layering: safe defaults in code, team config in the repo, personal overrides out of git, secrets from the environment. Writing down which setting lives at which level avoids the classic bug where it works on one laptop only.",
     "example": {
      "lang": "json",
      "title": ".claude/settings.json (committed)",
      "text": "{\n  \"$schema\": \"https://json.schemastore.org/claude-code-settings.json\",\n  \"permissions\": {\n    \"defaultMode\": \"acceptEdits\",\n    \"allow\": [\"Bash(uv run pytest *)\"],\n    \"deny\": [\"Read(./.env)\"]\n  },\n  \"env\": { \"PYTHONDONTWRITEBYTECODE\": \"1\" },\n  \"outputStyle\": \"Explanatory\"\n}"
     },
     "tryIt": "Put <code>\"outputStyle\": \"Concise\"</code> in <code>~/.claude/settings.json</code> and <code>\"outputStyle\": \"Explanatory\"</code> in the project's <code>.claude/settings.json</code>. Start a session and check which one applies (project wins). Then run <code>claude --settings '{\"outputStyle\":\"Learning\"}'</code> and confirm the flag wins for that session.",
     "links": [
      {
       "t": "Settings files and precedence",
       "url": "https://code.claude.com/docs/en/settings",
       "kind": "docs"
      },
      {
       "t": "All settings",
       "url": "https://code.claude.com/docs/en/settings-reference",
       "kind": "docs"
      }
     ],
     "related": [
      "permissions",
      "hooks",
      "sandboxing",
      "statusline"
     ]
    },
    {
     "id": "checkpoints",
     "group": "Safety",
     "name": "Checkpoints and rewind",
     "icon": "undo",
     "oneLiner": "Automatic file snapshots before each prompt, so you can roll back code, conversation or both.",
     "what": "Every prompt that starts a turn creates a checkpoint of the files Claude's edit tools touch; Claude Code keeps the 100 most recent per session, and they survive <code>--resume</code>. Press <code>Esc</code> twice (with an empty prompt) or run <code>/rewind</code>, pick a message, then choose restore code and conversation, restore conversation only, restore code only, or summarise from or up to that point. Changes made through Bash (<code>rm</code>, <code>mv</code>, scripts) are not tracked, and nothing remote (databases, deployments) can be rolled back. Checkpoints complement git; they do not replace it.",
     "why": "Undo is a harness feature. An agent that edits state should record enough to reverse its own actions, or should work on a branch or worktree that you can throw away. For your project, decide what \"undo\" means for each tool and test it.",
     "example": {
      "lang": "text",
      "title": "Rewind menu",
      "text": "Esc Esc   (or /rewind)\n  > \"refactor the parser into two modules\"\n      Restore code and conversation\n      Restore conversation\n      Restore code\n      Summarize from here\n      Summarize up to here\n      Never mind"
     },
     "tryIt": "Ask Claude to rename a function across the repo. Run <code>git diff --stat</code> and note the files. Press <code>Esc Esc</code>, pick that prompt, choose <em>Restore code</em>. <code>git diff --stat</code> should now be empty. Repeat with a change made by a Bash <code>sed -i</code> command and observe that rewind does not undo it.",
     "links": [
      {
       "t": "Checkpointing",
       "url": "https://code.claude.com/docs/en/checkpointing",
       "kind": "docs"
      },
      {
       "t": "Manage sessions (resume, fork)",
       "url": "https://code.claude.com/docs/en/sessions",
       "kind": "docs"
      }
     ],
     "related": [
      "agent-loop",
      "permissions",
      "sandboxing"
     ]
    },
    {
     "id": "headless",
     "group": "Automation",
     "name": "Headless mode (claude -p)",
     "icon": "terminal",
     "oneLiner": "Run the same loop non-interactively from scripts and CI, with JSON output.",
     "what": "<code>claude -p \"prompt\"</code> runs one task and exits with 0 on success and non-zero on failure. <code>--output-format json</code> returns <code>result</code>, <code>session_id</code>, <code>num_turns</code>, <code>usage</code> and <code>total_cost_usd</code>; <code>stream-json</code> emits one event per line; <code>--json-schema</code> puts schema-valid output in <code>structured_output</code>. Pre-approve tools with <code>--allowedTools</code>, deny the rest with <code>--permission-mode dontAsk</code>, and cap runs with <code>--max-turns</code> and <code>--max-budget-usd</code>. <code>--bare</code> skips hooks, skills, plugins, MCP servers, auto memory and CLAUDE.md for reproducible runs. A <code>-p</code> run shows no trust dialog, so in a repo you did not write it runs that repo's hooks and <code>.mcp.json</code> servers unless you use <code>--bare</code> or <code>--setting-sources user</code>.",
     "why": "Headless mode is how an agent becomes a component in a pipeline: an eval runner, a pre-commit reviewer, a nightly triage job. Your capstone evals should run headless, produce JSON you can score, and stop on a budget.",
     "example": {
      "lang": "bash",
      "title": "A scriptable, budgeted run",
      "text": "claude -p \"List every test file and how many tests it defines\" \\\n  --output-format json \\\n  --allowedTools \"Read\" \"Bash(uv run pytest --collect-only *)\" \\\n  --permission-mode dontAsk \\\n  --max-turns 6 --max-budget-usd 0.50 > run.json\n\njq '{turns: .num_turns, cost: .total_cost_usd, session: .session_id}' run.json\njq -r '.result' run.json"
     },
     "tryIt": "Run the command above in your repo. Check <code>echo $?</code> is 0 and that <code>jq .num_turns run.json</code> is at most 6. Run it again with <code>--max-turns 1</code> and observe the error exit. Resume the first run with <code>claude -p --resume &lt;session_id&gt; \"now group them by folder\"</code>.",
     "links": [
      {
       "t": "Run Claude Code programmatically",
       "url": "https://code.claude.com/docs/en/headless",
       "kind": "docs"
      },
      {
       "t": "CLI reference",
       "url": "https://code.claude.com/docs/en/cli-reference",
       "kind": "docs"
      }
     ],
     "related": [
      "agent-sdk",
      "github-actions",
      "cost-tracking",
      "permissions"
     ]
    },
    {
     "id": "agent-sdk",
     "group": "Automation",
     "name": "Claude Agent SDK",
     "icon": "code",
     "oneLiner": "Claude Code's loop, tools and context management as a Python or TypeScript library.",
     "what": "The Claude Agent SDK (renamed from the Claude Code SDK) gives your program the same agent loop, built-in tools, hooks, subagents, MCP, permissions and sessions. Install <code>pip install claude-agent-sdk</code> or <code>npm install @anthropic-ai/claude-agent-sdk</code>; both bundle the Claude Code binary. You call <code>query()</code> with a prompt and options (<code>allowed_tools</code>, <code>permission_mode</code>, <code>max_turns</code>, <code>max_budget_usd</code>) and iterate over messages until a <code>ResultMessage</code> with cost and session ID. It authenticates with an API key; Anthropic does not allow third-party products to use claude.ai login. For a hosted harness, Anthropic also offers Managed Agents on the Claude Platform.",
     "why": "If you build on the SDK, you inherit a production harness and spend your time on domain tools and evals. If you build your own loop (Lab B), you learn what the SDK hides. Many teams do the second first, then decide. Either way, the SDK docs are a checklist of what a serious harness handles: permissions, hooks, sessions, cost, observability.",
     "example": {
      "lang": "py",
      "title": "agent.py (based on the SDK quickstart)",
      "text": "import asyncio\nfrom claude_agent_sdk import query, ClaudeAgentOptions, AssistantMessage, ResultMessage\n\nasync def main():\n    async for message in query(\n        prompt=\"Review utils.py for bugs that would cause crashes. Fix any issues you find.\",\n        options=ClaudeAgentOptions(\n            allowed_tools=[\"Read\", \"Edit\", \"Glob\"],\n            permission_mode=\"acceptEdits\",\n            max_turns=10,\n        ),\n    ):\n        if isinstance(message, AssistantMessage):\n            for block in message.content:\n                if hasattr(block, \"text\"):\n                    print(block.text)\n                elif hasattr(block, \"name\"):\n                    print(f\"Tool: {block.name}\")\n        elif isinstance(message, ResultMessage):\n            print(f\"Done: {message.subtype}\")\n\nasyncio.run(main())"
     },
     "tryIt": "If you have API credits: run the quickstart on a file with a planted bug and check the diff. Set <code>max_turns=1</code> and observe the <code>error_max_turns</code> result subtype. Without credits: read the agent-loop page and list which of its features your Lab B harness lacks.",
     "links": [
      {
       "t": "Agent SDK overview",
       "url": "https://code.claude.com/docs/en/agent-sdk/overview",
       "kind": "docs"
      },
      {
       "t": "Agent SDK quickstart",
       "url": "https://code.claude.com/docs/en/agent-sdk/quickstart",
       "kind": "docs"
      },
      {
       "t": "Building agents with the Claude Agent SDK (Sep 2025)",
       "url": "https://claude.com/blog/building-agents-with-the-claude-agent-sdk",
       "kind": "read"
      },
      {
       "t": "Claude Managed Agents (Claude Platform docs)",
       "url": "https://platform.claude.com/docs/en/managed-agents/overview",
       "kind": "docs"
      }
     ],
     "related": [
      "agent-loop",
      "headless",
      "hooks",
      "permissions"
     ]
    },
    {
     "id": "github-actions",
     "group": "Automation",
     "name": "GitHub Actions",
     "icon": "ci",
     "oneLiner": "Run Claude Code on GitHub events: @claude mentions, pull requests, schedules.",
     "what": "The <code>anthropics/claude-code-action@v1</code> action runs Claude Code inside a GitHub Actions runner. Without a <code>prompt</code> input it answers <code>@claude</code> mentions in issues and PRs; with a <code>prompt</code> it runs on any event, including a cron schedule. <code>/install-github-app</code> in the terminal installs the GitHub App and stores the credential as a repository secret (<code>ANTHROPIC_API_KEY</code>, or <code>CLAUDE_CODE_OAUTH_TOKEN</code> for a subscription). Tools are granted with <code>claude_args: --allowedTools ...</code>, and your repo's CLAUDE.md applies. Runs consume Actions minutes plus API usage.",
     "why": "This is the headless loop wired to an event source, with the repo as the sandbox and the PR as the review gate. The AI PR reviewer track is exactly this shape. Even if you use another model, copy the pattern: trigger, scoped token, allowlisted tools, output as a PR comment.",
     "example": {
      "lang": "text",
      "title": ".github/workflows/claude.yml",
      "text": "name: Claude Code\non:\n  issue_comment:\n    types: [created]\n  pull_request_review_comment:\n    types: [created]\njobs:\n  claude:\n    if: contains(github.event.comment.body, '@claude')\n    runs-on: ubuntu-latest\n    permissions:\n      contents: write\n      pull-requests: write\n      issues: write\n      id-token: write\n      actions: read\n    steps:\n      - uses: actions/checkout@v6\n        with:\n          fetch-depth: 1\n      - uses: anthropics/claude-code-action@v1\n        with:\n          anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}"
     },
     "tryIt": "In a throwaway public repo with a credential available, add the workflow, open an issue and comment <em>@claude explain what this repo does</em>. Check the Actions tab for the run and the reply comment. Without a credential, read the workflow and write down each permission it requests and why.",
     "links": [
      {
       "t": "Claude Code GitHub Actions",
       "url": "https://code.claude.com/docs/en/github-actions",
       "kind": "docs"
      },
      {
       "t": "anthropics/claude-code-action",
       "url": "https://github.com/anthropics/claude-code-action",
       "kind": "repo"
      }
     ],
     "related": [
      "headless",
      "permissions",
      "claude-md",
      "cost-tracking"
     ]
    },
    {
     "id": "plan-mode",
     "group": "Core loop",
     "name": "Plan mode",
     "icon": "map",
     "oneLiner": "Explore and write a plan first; edits stay blocked until you approve it.",
     "what": "In plan mode Claude reads files, runs exploratory commands and writes a plan, but does not edit your source. Enter it with <code>Shift+Tab</code>, by starting a prompt with <code>/plan</code>, or with <code>claude --permission-mode plan</code>. When the plan is ready you choose to approve (and continue in auto mode or with manual approval of each edit) or keep planning; <code>Ctrl+G</code> opens the plan in your editor. The approved plan is re-injected after compaction.",
     "why": "Separating plan from act is a harness pattern you can copy: a cheap read-only phase, a human or evaluator checkpoint, then execution with more permissions. The Explore, Plan, Code, Commit workflow taught in Claude Code 101 is built on it, and it makes a good milestone structure for agent tasks in your own system.",
     "example": {
      "lang": "bash",
      "title": "Start read-only, then approve",
      "text": "claude --permission-mode plan\n> /plan add rate limiting to the webhook handler. List files to change and tests to add.\n# review the plan, press Ctrl+G to edit it, then choose\n#   \"Yes, manually approve edits\""
     },
     "tryIt": "Start in plan mode and ask for a medium change. While it plans, ask it to <em>just make the edit now</em>: it should refuse to edit. Edit the plan with <code>Ctrl+G</code> to remove one step, approve, and check that the removed step is not done.",
     "links": [
      {
       "t": "Plan mode (permission modes)",
       "url": "https://code.claude.com/docs/en/permission-modes",
       "kind": "docs"
      },
      {
       "t": "Common workflows",
       "url": "https://code.claude.com/docs/en/common-workflows",
       "kind": "docs"
      },
      {
       "t": "Claude Code 101 (Claude Academy, free)",
       "url": "https://academy.claude.com/courses/claude-code-101",
       "kind": "course"
      }
     ],
     "related": [
      "permissions",
      "agent-loop",
      "subagents"
     ]
    },
    {
     "id": "cost-tracking",
     "group": "Operations",
     "name": "Cost and usage",
     "icon": "coins",
     "oneLiner": "Token counts, session cost, plan limits and hard budget caps.",
     "what": "<code>/usage</code> (alias <code>/cost</code>) shows session token usage per model, cache statistics and, on Pro and Max plans, plan limit bars. The dollar figure is computed locally at list price and matters for API users; subscribers pay a flat plan price within usage limits. Scripts get <code>total_cost_usd</code> from <code>--output-format json</code>, and <code>--max-budget-usd</code> stops a headless run at a cap. Teams export metrics through OpenTelemetry. The docs' levers for spending less: clear between tasks, move long instructions from CLAUDE.md into skills, delegate verbose work to subagents, pick the right model.",
     "why": "Cost per task is one of the numbers your capstone report must give. Log input and output tokens on every model call from day one, set a hard cap in code, and cache model responses during eval reruns so an unchanged eval costs nothing.",
     "example": {
      "lang": "bash",
      "title": "Measure and cap",
      "text": "# interactive\n/usage\n\n# scripted: fail the job if a run gets expensive\nclaude -p \"triage the open TODOs in src/\" --output-format json \\\n  --max-budget-usd 0.25 | jq '{cost: .total_cost_usd, turns: .num_turns}'"
     },
     "tryIt": "Run one task twice: once in the main conversation, once delegated to a subagent on a cheaper model. Compare the <code>/usage</code> totals. In your own agent, add a per-run token counter to the trace and print the total at exit.",
     "links": [
      {
       "t": "Manage costs effectively",
       "url": "https://code.claude.com/docs/en/costs",
       "kind": "docs"
      },
      {
       "t": "Monitoring with OpenTelemetry",
       "url": "https://code.claude.com/docs/en/monitoring-usage",
       "kind": "docs"
      },
      {
       "t": "Track cost and usage (Agent SDK)",
       "url": "https://code.claude.com/docs/en/agent-sdk/cost-tracking",
       "kind": "docs"
      }
     ],
     "related": [
      "headless",
      "context",
      "statusline",
      "subagents"
     ]
    },
    {
     "id": "statusline",
     "group": "Operations",
     "name": "Status line",
     "icon": "gauge",
     "oneLiner": "A script that renders live session data (model, context %, cost) at the bottom of the terminal.",
     "what": "Configure <code>statusLine</code> in settings with a command. Claude Code runs it and passes session JSON on stdin, with fields such as <code>model.display_name</code>, <code>context_window.used_percentage</code>, <code>cost.total_cost_usd</code> and <code>rate_limits.five_hour.used_percentage</code>; whatever your script prints is shown. <code>/statusline</code> can generate one for you from a description.",
     "why": "It is a tiny observability surface: the numbers you should watch while an agent runs. Your own agent deserves the same: a one-line live view of step count, tokens used and budget left, plus the full trace on disk.",
     "example": {
      "lang": "json",
      "title": "~/.claude/settings.json (example from the docs)",
      "text": "{\n  \"statusLine\": {\n    \"type\": \"command\",\n    \"command\": \"jq -r '\\\"[\\\\(.model.display_name)] \\\\(.context_window.used_percentage // 0)% context\\\"'\"\n  }\n}"
     },
     "tryIt": "Run <code>/statusline show model, context percent and session cost</code>. Work for a few prompts and watch the context percentage rise, then drop after <code>/compact</code>.",
     "links": [
      {
       "t": "Customize your status line",
       "url": "https://code.claude.com/docs/en/statusline",
       "kind": "docs"
      }
     ],
     "related": [
      "cost-tracking",
      "context",
      "settings"
     ]
    }
   ]
  },
  {
   "type": "h",
   "text": "Same concepts in other harnesses",
   "id": "mapping"
  },
  {
   "type": "p",
   "html": "Checked against each project's own docs or source in Sep 2026. A dash means we could not confirm an equivalent, not that none exists. Codex details come from its published config schema; Copilot column covers Copilot CLI and the cloud agent (formerly coding agent). Google has moved free personal use from Gemini CLI to Antigravity CLI (see <a href='#/tools'>free toolkit</a>); the Gemini CLI column describes the open-source CLI."
  },
  {
   "type": "table",
   "head": [
    "Component",
    "Codex CLI",
    "GitHub Copilot",
    "OpenCode",
    "Gemini CLI"
   ],
   "rows": [
    [
     "<a data-cc='claude-md'>Rules file</a>",
     "<code>AGENTS.md</code> (<a href='https://developers.openai.com/codex/guides/agents-md' target='_blank' rel='noopener'>docs</a>)",
     "<code>.github/copilot-instructions.md</code>, <code>AGENTS.md</code>, <code>CLAUDE.md</code> (<a href='https://docs.github.com/en/copilot/how-tos/copilot-cli/customize-copilot/add-custom-instructions' target='_blank' rel='noopener'>docs</a>)",
     "<code>AGENTS.md</code>, falls back to <code>CLAUDE.md</code> (<a href='https://opencode.ai/docs/rules/' target='_blank' rel='noopener'>docs</a>)",
     "<code>GEMINI.md</code> (<a href='https://geminicli.com/docs/cli/gemini-md' target='_blank' rel='noopener'>docs</a>)"
    ],
    [
     "<a data-cc='settings'>Config</a>",
     "<code>config.toml</code> in <code>$CODEX_HOME</code> (<a href='https://developers.openai.com/codex/config-reference' target='_blank' rel='noopener'>docs</a>)",
     "<code>~/.copilot/settings.json</code> (CLI)",
     "<code>opencode.json</code>",
     "<code>~/.gemini/settings.json</code>, <code>.gemini/settings.json</code>"
    ],
    [
     "<a data-cc='permissions'>Permissions</a>",
     "<code>approval_policy</code>: <code>on-request</code>, <code>never</code> or granular",
     "<code>--allow-tool</code>, <code>--allow-url</code>, <code>--allow-all-tools</code>",
     "<code>permission</code>: <code>allow</code> / <code>ask</code> / <code>deny</code>; <code>--auto</code> (<a href='https://opencode.ai/docs/permissions/' target='_blank' rel='noopener'>docs</a>)",
     "Policy engine rules (<a href='https://geminicli.com/docs/reference/policy-engine' target='_blank' rel='noopener'>docs</a>)"
    ],
    [
     "<a data-cc='sandboxing'>Sandbox</a>",
     "<code>sandbox_mode</code>: <code>read-only</code>, <code>workspace-write</code>, <code>danger-full-access</code> (<a href='https://developers.openai.com/codex/security' target='_blank' rel='noopener'>docs</a>)",
     "CLI local sandboxing (public preview); cloud agent runs in a GitHub Actions environment",
     "—",
     "<code>--sandbox</code> / <code>GEMINI_SANDBOX</code>: Seatbelt, Docker, Podman (<a href='https://geminicli.com/docs/cli/sandbox' target='_blank' rel='noopener'>docs</a>)"
    ],
    [
     "<a data-cc='hooks'>Hooks</a>",
     "<code>hooks</code> in config: <code>PreToolUse</code>, <code>PostToolUse</code>, <code>SessionStart</code>, <code>Stop</code>...",
     "<code>.github/hooks/*.json</code>: <code>preToolUse</code>, <code>postToolUse</code>... (<a href='https://docs.github.com/en/copilot/concepts/agents/hooks' target='_blank' rel='noopener'>docs</a>)",
     "JS/TS plugins with events such as <code>tool.execute.before</code> (<a href='https://opencode.ai/docs/plugins/' target='_blank' rel='noopener'>docs</a>)",
     "<code>BeforeTool</code>, <code>AfterTool</code>, <code>SessionStart</code>... (<a href='https://geminicli.com/docs/hooks/' target='_blank' rel='noopener'>docs</a>)"
    ],
    [
     "<a data-cc='skills'>Skills</a>",
     "Skills (<code>SKILL.md</code>) (<a href='https://developers.openai.com/codex/skills' target='_blank' rel='noopener'>docs</a>)",
     "<code>.github/skills</code>, <code>.claude/skills</code>, <code>.agents/skills</code> (<a href='https://docs.github.com/en/copilot/concepts/agents/about-agent-skills' target='_blank' rel='noopener'>docs</a>)",
     "<code>.opencode/skills</code>, also reads <code>.claude/skills</code> (<a href='https://opencode.ai/docs/skills/' target='_blank' rel='noopener'>docs</a>)",
     "Agent Skills (<a href='https://geminicli.com/docs/cli/skills' target='_blank' rel='noopener'>docs</a>)"
    ],
    [
     "<a data-cc='subagents'>Subagents</a>",
     "Multi-agent roles under <code>agents</code> in config",
     "Custom agents",
     "Subagents General, Explore, Scout; <code>@</code>-mention (<a href='https://opencode.ai/docs/agents/' target='_blank' rel='noopener'>docs</a>)",
     "Subagents (<a href='https://geminicli.com/docs/core/subagents' target='_blank' rel='noopener'>docs</a>)"
    ],
    [
     "<a data-cc='mcp'>MCP</a>",
     "<code>mcp_servers</code> in config; <code>codex mcp</code>",
     "<code>/mcp add</code>; GitHub MCP server built in",
     "<code>mcp</code> in <code>opencode.json</code>",
     "<code>mcpServers</code> in settings"
    ],
    [
     "<a data-cc='plugins'>Plugins</a>",
     "Plugins and marketplaces; <code>codex plugin</code>",
     "CLI plugins, <code>marketplace.json</code>",
     "npm or local JS/TS plugins",
     "Extensions (<a href='https://geminicli.com/docs/extensions/' target='_blank' rel='noopener'>docs</a>)"
    ],
    [
     "<a data-cc='plan-mode'>Plan first</a>",
     "—",
     "CLI plan mode (<code>Shift+Tab</code>)",
     "Built-in Plan agent (<code>Tab</code>)",
     "Plan mode (<a href='https://geminicli.com/docs/cli/plan-mode' target='_blank' rel='noopener'>docs</a>)"
    ],
    [
     "<a data-cc='checkpoints'>Undo</a>",
     "—",
     "CLI rewind picker (<code>Esc Esc</code>)",
     "—",
     "Checkpointing and <code>/rewind</code>"
    ],
    [
     "<a data-cc='memory'>Memory</a>",
     "<code>memories</code> subsystem in config",
     "—",
     "—",
     "Auto Memory (experimental)"
    ],
    [
     "<a data-cc='headless'>Headless</a>",
     "<code>codex exec --json</code>, <code>--output-schema</code>",
     "<code>copilot -p \"...\"</code> (<a href='https://docs.github.com/en/copilot/how-tos/copilot-cli/automate-copilot-cli/run-cli-programmatically' target='_blank' rel='noopener'>docs</a>)",
     "<code>opencode run \"...\"</code> (<a href='https://opencode.ai/docs/cli/' target='_blank' rel='noopener'>docs</a>)",
     "<code>gemini -p \"...\" --output-format json</code> (<a href='https://geminicli.com/docs/cli/headless' target='_blank' rel='noopener'>docs</a>)"
    ],
    [
     "<a data-cc='github-actions'>CI / GitHub</a>",
     "—",
     "Copilot cloud agent (assign an issue); CLI in Actions",
     "<code>opencode github install</code>; <code>/opencode</code> in comments (<a href='https://opencode.ai/docs/github/' target='_blank' rel='noopener'>docs</a>)",
     "<a href='https://github.com/google-github-actions/run-gemini-cli' target='_blank' rel='noopener'>run-gemini-cli</a> action"
    ],
    [
     "<a data-cc='agent-sdk'>SDK</a>",
     "—",
     "—",
     "<code>@opencode-ai/sdk</code> (<a href='https://opencode.ai/docs/sdk/' target='_blank' rel='noopener'>docs</a>)",
     "—"
    ]
   ]
  },
  {
   "type": "h",
   "text": "Learn Claude Code",
   "id": "learn"
  },
  {
   "type": "resources",
   "items": [
    {
     "kind": "course",
     "t": "Claude Code 101",
     "by": "Claude Academy · free",
     "url": "https://academy.claude.com/courses/claude-code-101",
     "note": "About 1.5 h, 12 lessons: the Explore, Plan, Code, Commit workflow, context, CLAUDE.md, subagents, MCP, hooks."
    },
    {
     "kind": "course",
     "t": "Claude Code in Action",
     "by": "Claude Academy · free",
     "url": "https://academy.claude.com/courses/claude-code-in-action",
     "note": "Hands-on follow-up for people who already use AI coding tools."
    },
    {
     "kind": "course",
     "t": "Introduction to agent skills",
     "by": "Claude Academy · free",
     "url": "https://academy.claude.com/courses/introduction-to-agent-skills",
     "note": "From a first SKILL.md to a skills-based workflow."
    },
    {
     "kind": "course",
     "t": "Introduction to subagents",
     "by": "Claude Academy · free",
     "url": "https://academy.claude.com/courses/introduction-to-subagents",
     "note": "Recorded before /agents lost its wizard (v2.1.198); write the files by hand instead."
    },
    {
     "kind": "course",
     "t": "Introduction to Model Context Protocol",
     "by": "Claude Academy · free",
     "url": "https://academy.claude.com/courses/introduction-to-model-context-protocol",
     "note": "Build MCP servers and clients in Python."
    },
    {
     "kind": "docs",
     "t": "Quickstart",
     "by": "Claude Code docs",
     "url": "https://code.claude.com/docs/en/quickstart",
     "note": "Install, first task, first commit."
    },
    {
     "kind": "docs",
     "t": "How Claude Code works",
     "by": "Claude Code docs",
     "url": "https://code.claude.com/docs/en/how-claude-code-works",
     "note": "The agentic loop, tools, sessions, context, checkpoints, permissions on one page."
    },
    {
     "kind": "docs",
     "t": "Best practices",
     "by": "Claude Code docs",
     "url": "https://code.claude.com/docs/en/best-practices",
     "note": "The former engineering post, now maintained in the docs."
    },
    {
     "kind": "read",
     "t": "Steering Claude Code: when to use CLAUDE.md, skills, hooks and subagents",
     "by": "Anthropic",
     "date": "Jun 2026",
     "url": "https://claude.com/blog/steering-claude-code-skills-hooks-rules-subagents-and-more",
     "note": "Context cost and reliability of each mechanism, side by side."
    },
    {
     "kind": "read",
     "t": "How we built Claude Code auto mode",
     "by": "Anthropic Engineering",
     "date": "Mar 2026",
     "url": "https://www.anthropic.com/engineering/claude-code-auto-mode",
     "note": "A classifier as a permission layer: design and trade-offs."
    },
    {
     "kind": "read",
     "t": "Building agents with the Claude Agent SDK",
     "by": "Anthropic",
     "date": "Sep 2025",
     "url": "https://claude.com/blog/building-agents-with-the-claude-agent-sdk",
     "note": "Why the Claude Code harness became a general agent library."
    },
    {
     "kind": "read",
     "t": "Making Claude Code more secure and autonomous with sandboxing",
     "by": "Anthropic Engineering",
     "date": "Oct 2025",
     "url": "https://www.anthropic.com/engineering/claude-code-sandboxing"
    },
    {
     "kind": "read",
     "t": "Scaling Managed Agents: decoupling the brain from the hands",
     "by": "Anthropic Engineering",
     "date": "Apr 2026",
     "url": "https://www.anthropic.com/engineering/managed-agents",
     "note": "Harnesses encode assumptions that go stale as models improve."
    },
    {
     "kind": "read",
     "t": "Effective context engineering for AI agents",
     "by": "Anthropic Engineering",
     "date": "Sep 2025",
     "url": "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents"
    }
   ]
  },
  {
   "type": "h",
   "text": "Labs",
   "id": "labs"
  },
  {
   "type": "lab",
   "id": "lab-dissect",
   "title": "Lab A: Dissect the harness",
   "time": "90 min",
   "level": "Core",
   "goal": "Configure one of each core Claude Code component in a small Python repo and prove, with an observable output, that each one works. You finish with a repo you can show and a one-page map from each component to your own project.",
   "build": [
    "<strong>Access first.</strong> Claude Code needs a Pro or Max plan, a Team or Enterprise seat, or Claude Console API credits; the free claude.ai plan does not include it (see the callout above). No access? Do the same steps in OpenCode or Codex CLI using the mapping table: OpenCode reads <code>CLAUDE.md</code> when there is no <code>AGENTS.md</code> and loads skills from <code>.claude/skills/</code>.",
    "Install and check: <code>curl -fsSL https://claude.ai/install.sh | bash</code> (Windows: use WSL2 or <code>irm https://claude.ai/install.ps1 | iex</code>), then <code>claude --version</code>. Start <code>claude</code>, log in, and run <code>/doctor</code>.",
    "Create a toy repo: <code>mkdir harness-lab &amp;&amp; cd harness-lab &amp;&amp; git init</code>, add <code>calc.py</code> with an <code>add(a, b)</code> function that has a planted bug (<code>return a - b</code>) and <code>test_calc.py</code> with two pytest tests (<code>add(2, 3) == 5</code> fails, <code>add(0, 0) == 0</code> passes), plus a <code>.env</code> containing <code>API_KEY=fake</code>. Commit.",
    "<strong><a data-cc='claude-md'>CLAUDE.md</a>:</strong> run <code>/init</code>, then trim it to the test command and one checkable rule: <em>End every final answer with the line LAB-A</em>.",
    "<strong><a data-cc='hooks'>Hook</a>:</strong> save the guard script below as <code>.claude/hooks/guard.py</code> and register it in <code>.claude/settings.json</code> as a <code>PreToolUse</code> hook with matcher <code>Bash|Edit|Write</code> and command <code>python3 \"$CLAUDE_PROJECT_DIR\"/.claude/hooks/guard.py</code> (see the Hooks card for the JSON). Restart Claude Code.",
    "<strong><a data-cc='skills'>Skill</a>:</strong> create <code>.claude/skills/test-report/SKILL.md</code> from the Skills card, replacing <code>uv run pytest</code> with <code>python3 -m pytest</code> in both <code>allowed-tools</code> and the steps.",
    "<strong><a data-cc='subagents'>Subagent</a>:</strong> create <code>.claude/agents/test-runner.md</code> from the Subagents card (tools <code>Read, Grep, Glob, Bash</code>, no <code>Edit</code>; test command <code>python3 -m pytest -q</code>).",
    "<strong><a data-cc='headless'>Headless</a>:</strong> run <code>claude -p \"Which test fails and why? Do not edit files.\" --output-format json --allowedTools \"Read\" \"Bash(python3 -m pytest *)\" --max-turns 6 &gt; run.json</code>.",
    "Write <code>DISSECTION.md</code>: for each component you touched, one line on what it did here and one line on what the equivalent is (or will be) in your capstone agent."
   ],
   "verify": [
    "<code>claude --version</code> prints a version; <code>/doctor</code> reports no errors.",
    "New session, ask <em>what does this repo do?</em>: the answer ends with <code>LAB-A</code>. <code>/context</code> lists your CLAUDE.md under memory files.",
    "Offline hook test: <code>echo '{\"tool_name\":\"Bash\",\"tool_input\":{\"command\":\"rm -rf build\"}}' | python3 .claude/hooks/guard.py; echo $?</code> prints the Blocked message and <code>2</code>. The same with <code>ls</code> prints <code>0</code>.",
    "Live hook test: <code>mkdir build</code>, then ask Claude <em>delete the build folder with rm -rf</em>. Claude reports that the call was blocked by guard.py, and <code>ls -d build</code> still succeeds. Ask it to <em>add DEBUG=1 to .env</em>: blocked, and <code>git diff .env</code> is empty. <code>/hooks</code> lists the PreToolUse hook.",
    "<code>/skills</code> lists <code>test-report</code>. Asking <em>is the build green?</em> invokes it and the answer contains <code>RED (1 failing)</code>.",
    "Asking <em>use the test-runner agent to diagnose the failure</em> shows a <code>test-runner(...)</code> row in the transcript and names <code>calc.py</code> and the minus sign. Asking the subagent to fix it fails for lack of an edit tool.",
    "<code>jq '{turns: .num_turns, cost: .total_cost_usd, session: .session_id}' run.json</code> prints three non-null fields, with <code>turns</code> at most 6, and <code>git status --short</code> shows no modified tracked files.",
    "<code>DISSECTION.md</code> has at least 6 component rows, each with a concrete counterpart in your project."
   ],
   "code": {
    "lang": "py",
    "title": ".claude/hooks/guard.py",
    "text": "#!/usr/bin/env python3\n# .claude/hooks/guard.py: PreToolUse hook. Exit 2 blocks the tool call; stderr goes back to Claude.\nimport json, re, sys\n\nevent = json.load(sys.stdin)\ntool = event.get(\"tool_name\", \"\")\ninp = event.get(\"tool_input\", {})\n\nif tool == \"Bash\" and re.search(r\"\\brm\\s+-[a-zA-Z]*r[a-zA-Z]*f|\\brm\\s+-[a-zA-Z]*f[a-zA-Z]*r\", inp.get(\"command\", \"\")):\n    print(\"Blocked by guard.py: recursive force delete (rm -rf) is not allowed.\", file=sys.stderr)\n    sys.exit(2)\n\nif tool in (\"Edit\", \"Write\") and re.search(r\"(^|/)\\.env(\\.|$)\", inp.get(\"file_path\", \"\").replace(\"\\\\\", \"/\")):\n    print(\"Blocked by guard.py: .env files hold secrets and are read-only for agents.\", file=sys.stderr)\n    sys.exit(2)\n\nsys.exit(0)"
   },
   "stretch": [
    "Turn on the <a data-cc='sandboxing'>sandbox</a> with <code>/sandbox</code> and show that <code>touch ~/outside.txt</code> fails.",
    "Package the hook, skill and subagent as a <a data-cc='plugins'>plugin</a> and load it in another repo with <code>--plugin-dir</code>.",
    "Add a <code>PostToolUse</code> hook that appends every tool call to <code>.claude/audit.jsonl</code>, and count the lines after a session."
   ],
   "links": [
    {
     "t": "Claude Code quickstart",
     "url": "https://code.claude.com/docs/en/quickstart"
    },
    {
     "t": "Hooks guide",
     "url": "https://code.claude.com/docs/en/hooks-guide"
    },
    {
     "t": "Run Claude Code programmatically",
     "url": "https://code.claude.com/docs/en/headless"
    },
    {
     "t": "Claude Code in Action (Claude Academy)",
     "url": "https://academy.claude.com/courses/claude-code-in-action"
    }
   ],
   "cc": [
    "claude-md",
    "hooks",
    "skills",
    "subagents",
    "headless",
    "permissions",
    "context"
   ]
  },
  {
   "type": "lab",
   "id": "lab-mini-harness",
   "title": "Lab B: Build a small harness yourself (about 120 lines)",
   "time": "3 h",
   "level": "Core",
   "goal": "Write the loop, the tools, the permission gate, the budget and the trace yourself, in Python, against any free OpenAI-compatible model API. When you are done you can point at each line and name the Claude Code component it imitates.",
   "build": [
    "Pick a free endpoint (see the <a href='#/tools'>free toolkit</a>): Google AI Studio exposes an OpenAI-compatible endpoint at <code>https://generativelanguage.googleapis.com/v1beta/openai/</code>; OpenRouter at <code>https://openrouter.ai/api/v1</code>; Ollama locally at <code>http://localhost:11434/v1</code>. Pick a model that supports tool calling and copy its exact ID from the provider's model list.",
    "<code>uv init mini-harness &amp;&amp; cd mini-harness &amp;&amp; uv add openai pytest</code> (or use pip). Export <code>BASE_URL</code>, <code>API_KEY</code> and <code>MODEL</code>; keep the key out of git.",
    "Copy <code>harness.py</code> below. Read it top to bottom and annotate each block with the component it matches: <a data-cc='agent-loop'>loop</a>, <a data-cc='tools'>tools</a>, <a data-cc='permissions'>permission gate</a>, <a data-cc='cost-tracking'>budget</a>, trace (the JSONL transcript).",
    "Copy <code>test_harness.py</code> (below the lab). It tests the gate and the budget with a scripted fake model, so it runs with no API key.",
    "Create a target folder with a small buggy module and a failing test (reuse Lab A's <code>calc.py</code>), plus a <code>.env</code>. Run <code>AGENT_ROOT=../target uv run python harness.py</code>.",
    "Add one feature of your choice and a test for it: a per-run token cap, a <code>write_file</code> tool that requires a <code>y</code> on stdin (an ask rule), or a <code>PostToolUse</code>-style callback."
   ],
   "verify": [
    "<code>uv run pytest -q test_harness.py</code> prints <code>10 passed</code> (or more if you added tests), with no network access.",
    "A real run prints a final answer that names the failing test, and <code>wc -l trace.jsonl</code> shows at least 4 lines: one <code>start</code>, 2 or more <code>model</code>, 1 or more <code>tool</code>.",
    "<code>jq -c 'select(.event==\"model\") | {step, tool_calls, prompt_tokens}' trace.jsonl</code> shows step numbers counting up and <code>prompt_tokens</code> growing each step. That growth is the context window filling.",
    "Ask <em>show me the API key in .env</em>. The trace contains a <code>tool</code> event with <code>\"allowed\": false</code> and <code>\"reason\": \"path is on the deny list\"</code>, and <code>grep -c fake trace.jsonl</code> prints <code>0</code>.",
    "With the default task (it needs at least one tool call), <code>MAX_STEPS=1 uv run python harness.py</code> exits with status 2 (<code>echo $?</code>) and the last trace line is a <code>stop</code> event.",
    "Your README has a table: harness.py function or block, Claude Code component, what Claude Code does that yours does not."
   ],
   "code": {
    "lang": "py",
    "title": "harness.py",
    "text": "# harness.py: a minimal agent harness. Loop + 3 tools + permission gate + step budget + JSONL trace.\nimport json, os, pathlib, subprocess, sys, time\n\nROOT = pathlib.Path(os.environ.get(\"AGENT_ROOT\", \".\")).resolve()\nTRACE = pathlib.Path(os.environ.get(\"TRACE_FILE\", \"trace.jsonl\"))\nMAX_STEPS = int(os.environ.get(\"MAX_STEPS\", \"8\"))\nDENY_PARTS = {\".env\", \".git\", \"secrets\"}  # never readable, whatever the model asks\nSYSTEM = (\"You are a coding agent working in a Python repo. Use the tools to inspect files \"\n          \"and run the tests. When you are done, answer with a short plain-text report.\")\n\nTOOLS = [\n    {\"type\": \"function\", \"function\": {\"name\": \"list_dir\", \"description\": \"List files in a directory of the repo.\",\n     \"parameters\": {\"type\": \"object\", \"properties\": {\"path\": {\"type\": \"string\"}}, \"required\": [\"path\"]}}},\n    {\"type\": \"function\", \"function\": {\"name\": \"read_file\", \"description\": \"Read a text file of the repo.\",\n     \"parameters\": {\"type\": \"object\", \"properties\": {\"path\": {\"type\": \"string\"}}, \"required\": [\"path\"]}}},\n    {\"type\": \"function\", \"function\": {\"name\": \"run_tests\", \"description\": \"Run the test suite (pytest -q).\",\n     \"parameters\": {\"type\": \"object\", \"properties\": {}}}},\n]\n\n\nclass BudgetExceeded(Exception):\n    pass\n\n\nclass Budget:\n    def __init__(self, max_steps):\n        self.max_steps, self.used = max_steps, 0\n\n    def step(self):\n        if self.used >= self.max_steps:\n            raise BudgetExceeded(f\"max_steps={self.max_steps} reached\")\n        self.used += 1\n\n\ndef check_permission(name, args, root=None):\n    \"\"\"The gate. Returns (allowed, reason). Runs before every tool call, outside the model.\"\"\"\n    root = root or ROOT\n    if name not in {\"list_dir\", \"read_file\", \"run_tests\"}:\n        return False, f\"unknown tool '{name}'\"\n    if name == \"run_tests\":\n        return True, \"fixed command, no arguments\"\n    raw = args.get(\"path\")\n    if not isinstance(raw, str):\n        return False, \"missing 'path'\"\n    target = (root / raw).resolve()\n    if target != root and root not in target.parents:\n        return False, \"path escapes the project root\"\n    if DENY_PARTS & set(target.relative_to(root).parts):\n        return False, \"path is on the deny list\"\n    return True, \"inside project root\"\n\n\ndef execute(name, args, root=None):\n    root = root or ROOT\n    if name == \"list_dir\":\n        p = (root / args[\"path\"]).resolve()\n        return \"\\n\".join(sorted(x.name + (\"/\" if x.is_dir() else \"\") for x in p.iterdir()))\n    if name == \"read_file\":\n        return (root / args[\"path\"]).resolve().read_text(errors=\"replace\")[:8000]\n    proc = subprocess.run([sys.executable, \"-m\", \"pytest\", \"-q\"], cwd=root,\n                          capture_output=True, text=True, timeout=120)\n    return f\"exit={proc.returncode}\\n{(proc.stdout + proc.stderr)[-4000:]}\"\n\n\ndef trace(event, **data):\n    with TRACE.open(\"a\") as f:\n        f.write(json.dumps({\"ts\": time.time(), \"event\": event, **data}, default=str) + \"\\n\")\n\n\ndef run(task, client, model, max_steps=MAX_STEPS):\n    messages = [{\"role\": \"system\", \"content\": SYSTEM}, {\"role\": \"user\", \"content\": task}]\n    budget = Budget(max_steps)\n    trace(\"start\", task=task, model=model, max_steps=max_steps)\n    while True:\n        budget.step()  # raises BudgetExceeded: the loop can never run forever\n        resp = client.chat.completions.create(model=model, messages=messages, tools=TOOLS)\n        msg = resp.choices[0].message\n        calls = msg.tool_calls or []\n        usage = getattr(resp, \"usage\", None)\n        trace(\"model\", step=budget.used, text=msg.content, tool_calls=[c.function.name for c in calls],\n              prompt_tokens=getattr(usage, \"prompt_tokens\", None),\n              completion_tokens=getattr(usage, \"completion_tokens\", None))\n        if not calls:\n            trace(\"final\", step=budget.used, answer=msg.content)\n            return msg.content\n        messages.append({\"role\": \"assistant\", \"content\": msg.content or \"\", \"tool_calls\": [\n            {\"id\": c.id, \"type\": \"function\",\n             \"function\": {\"name\": c.function.name, \"arguments\": c.function.arguments}} for c in calls]})\n        for c in calls:\n            try:\n                args = json.loads(c.function.arguments or \"{}\")\n                allowed, reason = check_permission(c.function.name, args)\n            except (json.JSONDecodeError, AttributeError):\n                args, allowed, reason = None, False, \"arguments are not a JSON object\"\n            try:\n                result = execute(c.function.name, args) if allowed else f\"DENIED: {reason}\"\n            except Exception as e:  # tool errors go back to the model, they do not crash the loop\n                result = f\"ERROR: {type(e).__name__}: {e}\"\n            trace(\"tool\", step=budget.used, name=c.function.name, args=args,\n                  allowed=allowed, reason=reason, result=result[:300])\n            messages.append({\"role\": \"tool\", \"tool_call_id\": c.id, \"content\": result})\n\n\ndef main():\n    from openai import OpenAI  # any OpenAI-compatible endpoint: Gemini, OpenRouter, Groq, Ollama\n    client = OpenAI(base_url=os.environ[\"BASE_URL\"], api_key=os.environ[\"API_KEY\"])\n    task = \" \".join(sys.argv[1:]) or \"Run the tests. If any fail, read the failing code and explain why.\"\n    try:\n        print(run(task, client, os.environ[\"MODEL\"]))\n    except BudgetExceeded as e:\n        trace(\"stop\", reason=str(e))\n        print(f\"Stopped: {e}\", file=sys.stderr)\n        sys.exit(2)\n\n\nif __name__ == \"__main__\":\n    main()"
   },
   "stretch": [
    "Add a <a data-cc='hooks'>PreToolUse-style hook</a> list: functions that receive <code>(name, args)</code> and can veto a call; move the <code>.env</code> check into one.",
    "Run <code>run_tests</code> inside a container (<code>docker run --rm --network none -v \"$PWD\":/w -w /w python:3.12 ...</code>) and show a test that fails when the code tries to open a socket. That is your <a data-cc='sandboxing'>sandbox</a>.",
    "Add <a data-cc='context'>compaction</a>: when <code>prompt_tokens</code> passes a threshold, replace old tool results with a one-line summary and log a <code>compact</code> event.",
    "Swap the provider (Gemini to OpenRouter or Ollama) by changing only environment variables, and compare step counts on the same task."
   ],
   "links": [
    {
     "t": "How the agent loop works (Agent SDK docs)",
     "url": "https://code.claude.com/docs/en/agent-sdk/agent-loop"
    },
    {
     "t": "Building effective agents (Anthropic)",
     "url": "https://www.anthropic.com/engineering/building-effective-agents"
    },
    {
     "t": "Writing effective tools for agents (Anthropic)",
     "url": "https://www.anthropic.com/engineering/writing-tools-for-agents"
    }
   ],
   "cc": [
    "agent-loop",
    "tools",
    "permissions",
    "cost-tracking",
    "context",
    "headless"
   ]
  },
  {
   "type": "code",
   "lang": "py",
   "title": "test_harness.py (Lab B, runs offline)",
   "text": "# test_harness.py: tests the harness without calling any model.\nimport json\nfrom types import SimpleNamespace as NS\nimport pytest\nimport harness\n\n\ndef test_gate_allows_file_inside_root(tmp_path):\n    assert harness.check_permission(\"read_file\", {\"path\": \"src/app.py\"}, root=tmp_path)[0]\n\n\n@pytest.mark.parametrize(\"path\", [\"../outside.txt\", \"/etc/passwd\", \".env\", \"config/.env\", \".git/config\"])\ndef test_gate_denies_escapes_and_secrets(tmp_path, path):\n    allowed, reason = harness.check_permission(\"read_file\", {\"path\": path}, root=tmp_path)\n    assert not allowed and reason\n\n\ndef test_gate_denies_unknown_tool(tmp_path):\n    assert not harness.check_permission(\"delete_file\", {\"path\": \"a.py\"}, root=tmp_path)[0]\n\n\ndef test_budget_stops_after_max_steps():\n    b = harness.Budget(3)\n    for _ in range(3):\n        b.step()\n    with pytest.raises(harness.BudgetExceeded):\n        b.step()\n\n\ndef call(i, name, args):\n    return NS(id=f\"c{i}\", function=NS(name=name, arguments=json.dumps(args)))\n\n\nclass FakeClient:\n    \"\"\"Scripted model: asks for tools a few times, then answers.\"\"\"\n    def __init__(self, script):\n        self.script, self.chat = list(script), NS(completions=self)\n\n    def create(self, **kw):\n        msg = self.script.pop(0)\n        return NS(choices=[NS(message=msg)], usage=NS(prompt_tokens=10, completion_tokens=5))\n\n\ndef test_loop_writes_trace_and_denies_secret(tmp_path, monkeypatch):\n    (tmp_path / \"a.txt\").write_text(\"hello\")\n    (tmp_path / \".env\").write_text(\"KEY=secret\")\n    monkeypatch.setattr(harness, \"ROOT\", tmp_path)\n    monkeypatch.setattr(harness, \"TRACE\", tmp_path / \"trace.jsonl\")\n    script = [NS(content=None, tool_calls=[call(1, \"list_dir\", {\"path\": \".\"})]),\n              NS(content=None, tool_calls=[call(2, \"read_file\", {\"path\": \".env\"})]),\n              NS(content=\"done\", tool_calls=None)]\n    assert harness.run(\"task\", FakeClient(script), \"fake\", max_steps=5) == \"done\"\n    events = [json.loads(l) for l in (tmp_path / \"trace.jsonl\").read_text().splitlines()]\n    assert [e[\"event\"] for e in events].count(\"model\") == 3\n    denied = [e for e in events if e[\"event\"] == \"tool\" and not e[\"allowed\"]]\n    assert denied and denied[0][\"args\"] == {\"path\": \".env\"}\n    assert \"secret\" not in (tmp_path / \"trace.jsonl\").read_text()\n\n\ndef test_loop_stops_at_budget(tmp_path, monkeypatch):\n    monkeypatch.setattr(harness, \"TRACE\", tmp_path / \"trace.jsonl\")\n    looping = [NS(content=None, tool_calls=[call(i, \"run_tests\", {})]) for i in range(10)]\n    monkeypatch.setattr(harness, \"execute\", lambda n, a, root=None: \"exit=0\")\n    with pytest.raises(harness.BudgetExceeded):\n        harness.run(\"task\", FakeClient(looping), \"fake\", max_steps=3)"
  },
  {
   "type": "checklist",
   "id": "harness-ready",
   "title": "You understand the harness when",
   "items": [
    "You can draw the loop from memory and mark where hooks, permission rules and the sandbox act.",
    "You can explain why a CLAUDE.md rule can be ignored but a PreToolUse hook or deny rule cannot.",
    "Lab A: your guard hook blocked <code>rm -rf</code> and a <code>.env</code> edit, and you have the output to show it.",
    "Lab A: a skill and a subagent each ran, and <code>run.json</code> from a headless run shows turns, cost and session ID.",
    "Lab B: <code>pytest</code> passes on the gate and budget tests, and <code>trace.jsonl</code> has one line per step.",
    "Your capstone README lists which harness components your agent implements (loop, tools, gate, sandbox, budget, trace, memory) and where each lives in the code."
   ]
  }
 ]
};
