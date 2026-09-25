/* Free AI toolkit: edit content here; app.js renders it. Limits checked Sep 2026. */
(window.GUIDE_PARTS = window.GUIDE_PARTS || {}).tools = {
  "id": "tools",
  "num": "02",
  "title": "Free AI toolkit",
  "kicker": "Setup · 2 h",
  "summary": "The free harnesses, model APIs, tracing, eval and hosting options a zero-budget pair can use, checked in September 2026.",
  "blocks": [
    {
      "type": "lead",
      "html": "You need two different things. A <strong>coding harness</strong> is an agent that helps <em>you</em> build. A <strong>model API</strong> is the LLM <em>your product</em> calls. Add tracing and evals so you can measure the product, and a free host so you can demo it. Every limit below was checked in September 2026. Free tiers change every month: confirm in the provider's console before you depend on one."
    },
    {
      "type": "callout",
      "tone": "warn",
      "title": "What changed in 2026",
      "html": "Tutorials from 2025 point to offers that no longer exist.<ul><li><strong>Gemini CLI</strong> stopped serving free and personal Google accounts on 18 June 2026. Google moved them to Antigravity CLI. <a href=\"https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/\" target=\"_blank\" rel=\"noopener\">Google, May 2026</a></li><li><strong>Copilot for students</strong> became the Copilot Student plan (12 March), switched to 200 AI Credits a month (1 June) and to Auto model selection only (24 June). <a href=\"https://github.com/orgs/community/discussions/189268\" target=\"_blank\" rel=\"noopener\">GitHub</a></li><li><strong>GitHub Models</strong> was retired on 30 July 2026. Tutorials that call <code>models.github.ai</code> no longer work. <a href=\"https://github.blog/changelog/2026-07-30-github-models-is-now-retired/\" target=\"_blank\" rel=\"noopener\">GitHub changelog</a></li><li><strong>Groq</strong> removed Llama 3.3 70B and Llama 3.1 8B from the free and developer tiers and points users to <code>openai/gpt-oss-120b</code>. <a href=\"https://console.groq.com/docs/deprecations\" target=\"_blank\" rel=\"noopener\">Groq deprecations</a></li><li><strong>Cerebras</strong> replaced its free tier with a $5 trial credit that expires after 30 days and needs a payment method. We left it out. <a href=\"https://inference-docs.cerebras.ai/support/rate-limits\" target=\"_blank\" rel=\"noopener\">Cerebras rate limits</a></li><li><strong>Cloudflare Workers AI</strong> moved its largest models to the paid plan on 28 July 2026. <a href=\"https://developers.cloudflare.com/changelog/post/2026-07-28-models-require-workers-paid/\" target=\"_blank\" rel=\"noopener\">Cloudflare changelog</a></li><li><strong>Cursor</strong> closed new sign-ups for its free student year on 25 June 2026. <a href=\"https://cursor.com/help/account-and-billing/student-discount\" target=\"_blank\" rel=\"noopener\">Cursor</a></li><li><strong>Codex</strong> is included in ChatGPT Free and Go for a limited time. <a href=\"https://developers.openai.com/codex/pricing\" target=\"_blank\" rel=\"noopener\">OpenAI</a></li></ul>"
    },
    {
      "type": "h",
      "text": "Recommended default stack",
      "id": "default-stack"
    },
    {
      "type": "p",
      "html": "For a pair with no budget. Take the primary column unless you have a reason not to, and set up the fallback model on day 1 so a quota cut does not stop you."
    },
    {
      "type": "table",
      "head": [
        "",
        "Coding harness",
        "Model API (product)",
        "Local model",
        "Tracing",
        "Evals",
        "Hosting",
        "Data"
      ],
      "rows": [
        [
          "<strong>Primary</strong>",
          "Copilot Student (VS Code agent mode + CLI)",
          "Gemini API, <code>gemini-3.1-flash-lite</code>",
          "Ollama, <code>qwen3.5:4b</code>",
          "Langfuse Cloud Hobby (2 users)",
          "promptfoo in GitHub Actions",
          "Render free (Python) or Cloudflare Workers (TS)",
          "Supabase Postgres + pgvector"
        ],
        [
          "<strong>Fallback</strong>",
          "Codex via ChatGPT Free, or OpenCode with a Zen free model",
          "Groq, <code>openai/gpt-oss-120b</code>",
          "<code>gemma4:e4b</code>, or <code>gpt-oss:20b</code> with 16 GB+",
          "Phoenix on localhost",
          "DeepEval, Inspect (agents), Ragas (RAG)",
          "GitHub Actions for batch jobs",
          "Neon, or Qdrant Cloud for vectors"
        ],
        [
          "<strong>Why</strong>",
          "No cost after verification; unlimited completions",
          "Free, OpenAI-compatible, large context",
          "No quota for tests and CI loops",
          "Free, open source, fits a pair",
          "YAML tests, caching, CI friendly",
          "Free tiers with the fewest surprises",
          "One database for rows and vectors"
        ]
      ]
    },
    {
      "type": "h",
      "text": "Tools by need",
      "id": "tool-groups"
    },
    {
      "type": "tools",
      "groups": [
        {
          "title": "A. Coding harnesses: agents that help you build",
          "intro": "Use one as your main tool and keep a second for when credits run out. The ideas carry over between them: each reads a rules file (AGENTS.md or <a data-cc=\"claude-md\">CLAUDE.md</a>) and can call <a data-cc=\"mcp\">MCP servers</a>.",
          "items": [
            {
              "name": "GitHub Copilot Student",
              "tag": "Start here",
              "cost": "Free for verified students (GitHub Education).",
              "bestFor": "Everyday coding in VS Code: completions, chat, agent mode, plus the Copilot CLI and the cloud agent that opens PRs from issues.",
              "limits": "Unlimited code completions. 200 GitHub AI Credits per month (1 credit = $0.01) since 1 June 2026, shared by chat, agent mode, code review, cloud agent and CLI. Model choice is Auto only since 24 June 2026; you cannot pick Claude or GPT models by hand. Agent tasks make many model calls, so credits can go in a day.",
              "how": "Get verified in the GitHub Student Developer Pack with your university email, then sign in to Copilot in VS Code. Install the CLI from the Copilot CLI docs. Save credits: use completions and plain chat for small things, agent mode for multi-file work.",
              "links": [
                {
                  "t": "Student Developer Pack",
                  "url": "https://education.github.com/pack"
                },
                {
                  "t": "Copilot plans (docs)",
                  "url": "https://docs.github.com/en/copilot/get-started/plans"
                },
                {
                  "t": "Student plan changes (GitHub, 2026)",
                  "url": "https://github.com/orgs/community/discussions/189268"
                },
                {
                  "t": "About Copilot CLI",
                  "url": "https://docs.github.com/copilot/concepts/agents/about-copilot-cli"
                }
              ],
              "verified": "Sep 2026",
              "cc": "claude-md"
            },
            {
              "name": "OpenAI Codex (CLI, IDE extension, cloud)",
              "tag": "Free for now",
              "cost": "Included in ChatGPT Free and Go. OpenAI labels this a limited-time offer.",
              "bestFor": "A second agent when Copilot credits run out. Good at longer refactors and at reviewing a diff. Reads AGENTS.md and supports MCP servers.",
              "limits": "Local and cloud tasks share one plan allowance. OpenAI does not publish a fixed number for Free and Go; they are meant for light use. No end date announced. The US-only ChatGPT student offer (4 months of Plus) does not apply in Tunisia.",
              "how": "<code>npm install -g @openai/codex</code>, run <code>codex</code>, choose <em>Sign in with ChatGPT</em>. Put your rules in <code>AGENTS.md</code> at the repo root.",
              "links": [
                {
                  "t": "Codex pricing and plan limits",
                  "url": "https://developers.openai.com/codex/pricing"
                },
                {
                  "t": "Using Codex with your ChatGPT plan",
                  "url": "https://help.openai.com/en/articles/11369540-using-codex-with-your-chatgpt-plan"
                },
                {
                  "t": "openai/codex on GitHub",
                  "url": "https://github.com/openai/codex"
                }
              ],
              "verified": "Sep 2026",
              "cc": "claude-md"
            },
            {
              "name": "OpenCode + Zen free models",
              "tag": "Open source",
              "cost": "Free CLI. The Zen gateway lists several models at $0 for a limited time.",
              "bestFor": "A terminal agent that works with any provider: a Zen free model, one of the free APIs in section B, or a local Ollama model. Reads AGENTS.md, supports MCP, skills and per-tool permissions.",
              "limits": "Free Zen models rotate (in Sep 2026: Big Pickle, MiMo, Nemotron, Ling and others). Some free models collect your data to improve the model; Zen docs say which. Never point them at private code or secrets.",
              "how": "<code>curl -fsSL https://opencode.ai/install | bash</code> (or <code>npm i -g opencode-ai</code>), run <code>opencode</code>, then pick a model tagged Free, or add your Groq or Gemini key.",
              "links": [
                {
                  "t": "Zen: current free models",
                  "url": "https://opencode.ai/docs/zen/"
                },
                {
                  "t": "Rules (AGENTS.md)",
                  "url": "https://opencode.ai/docs/rules/"
                },
                {
                  "t": "MCP servers",
                  "url": "https://opencode.ai/docs/mcp-servers/"
                }
              ],
              "verified": "Sep 2026",
              "cc": "mcp"
            },
            {
              "name": "Google Antigravity (IDE + CLI)",
              "tag": "Replaces Gemini CLI",
              "cost": "Individual plan: $0 with a Google account.",
              "bestFor": "An agent-first IDE and a Go-based CLI. The CLI keeps Gemini CLI features: skills, hooks, subagents, plugins (formerly extensions).",
              "limits": "Unlimited tab completions. Agent work is capped by a weekly quota that refreshes once a week; Google does not publish the number. Users report it runs out fast. Gemini CLI stopped serving free and personal accounts on 18 June 2026.",
              "how": "Install from the Antigravity docs and sign in with Google. Treat it as a bonus harness, not your only one.",
              "links": [
                {
                  "t": "Antigravity CLI install and auth",
                  "url": "https://antigravity.google/docs/cli/install/"
                },
                {
                  "t": "Gemini CLI to Antigravity CLI (Google, May 2026)",
                  "url": "https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/"
                },
                {
                  "t": "Gemini CLI shutdown notice",
                  "url": "https://github.com/google-gemini/gemini-cli/discussions/28017"
                }
              ],
              "verified": "Sep 2026",
              "cc": "skills"
            },
            {
              "name": "Claude Code",
              "tag": "Reference harness",
              "cost": "Not free. Needs a Claude Pro plan ($20/month in the US) or Max, or pay-as-you-go API credits. The Free plan does not include it.",
              "bestFor": "The harness this guide uses to explain every concept: the agent loop, CLAUDE.md, skills, hooks, subagents, MCP. Read about it even if you build with Copilot or Codex.",
              "limits": "Web, desktop and Claude Code draw from one usage pool on Pro. Claude for Education is sold to universities, not individuals. The Claude Campus Program (Builder Clubs share API credits) accepts students worldwide; the 2026 application window was 1-12 September.",
              "how": "If your pair has one Pro seat, install Claude Code and sign in. Otherwise study the <a data-cc=\"agent-loop\">harness section</a> and apply the same ideas in Copilot or OpenCode.",
              "links": [
                {
                  "t": "Claude Code overview",
                  "url": "https://code.claude.com/docs/en/overview"
                },
                {
                  "t": "Use Claude Code with Pro or Max",
                  "url": "https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan"
                },
                {
                  "t": "Claude Campus Program",
                  "url": "https://claude.com/programs/campus"
                }
              ],
              "verified": "Sep 2026",
              "cc": "agent-loop"
            },
            {
              "name": "Cline, Kilo Code, Aider (bring your own key)",
              "tag": "Open source",
              "cost": "The tools are free. You pay the model provider, which can be $0 with a free API or Ollama.",
              "bestFor": "Cline and Kilo Code are VS Code agents; Aider is a git-aware terminal agent that commits each change. Use them with the free keys from section B.",
              "limits": "Only as good and as fast as the model behind them. Kilo has its own gateway with a rotating list of free models (\"Auto Free\").",
              "how": "Install the VS Code extension (Cline, Kilo) or <code>python -m pip install aider-install && aider-install</code> for Aider, then paste a Groq, Gemini or OpenRouter key, or point it at <code>http://localhost:11434</code>.",
              "links": [
                {
                  "t": "Cline on GitHub",
                  "url": "https://github.com/cline/cline"
                },
                {
                  "t": "Using Kilo for free",
                  "url": "https://kilo.ai/docs/getting-started/using-kilo-for-free"
                },
                {
                  "t": "Aider: connecting to LLMs",
                  "url": "https://aider.chat/docs/llms.html"
                }
              ],
              "verified": "Sep 2026",
              "cc": "mcp"
            }
          ]
        },
        {
          "title": "B. Model APIs: what your product calls",
          "intro": "Code against the OpenAI-compatible chat API so a provider is a base URL and a key. Most providers below offer that endpoint.",
          "items": [
            {
              "name": "Google Gemini API (AI Studio)",
              "tag": "Primary pick",
              "cost": "Free tier, no card. Flash-Lite models are free for input and output.",
              "bestFor": "Your product's main model during development. Start with <code>gemini-3.1-flash-lite</code>. OpenAI-compatible endpoint, so the same client code works.",
              "limits": "Limits are per project and per model, reset at midnight Pacific. Google cut several free quotas in 2026 (developers report 20 requests/day on Gemini 3.8 Flash). Free-tier data may be used to improve Google products. Read your real numbers on the AI Studio rate-limit page.",
              "how": "Create a key at aistudio.google.com. Base URL <code>https://generativelanguage.googleapis.com/v1beta/openai/</code>.",
              "links": [
                {
                  "t": "Rate limits",
                  "url": "https://ai.google.dev/gemini-api/docs/rate-limits"
                },
                {
                  "t": "Pricing (free tier column)",
                  "url": "https://ai.google.dev/gemini-api/docs/pricing"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Groq",
              "tag": "Fast fallback",
              "cost": "Free plan, no card.",
              "bestFor": "Low-latency open models. <code>openai/gpt-oss-120b</code> is the free model Groq recommends after it dropped Llama for free users.",
              "limits": "Per-model limits on requests and tokens per minute and per day, set per organisation (one key shared by the pair shares one quota). Llama 3.3 70B and Llama 3.1 8B were deprecated for free and developer tiers in 2026. Your exact limits are on the console limits page.",
              "how": "Key at console.groq.com. Base URL <code>https://api.groq.com/openai/v1</code>.",
              "links": [
                {
                  "t": "Rate limits",
                  "url": "https://console.groq.com/docs/rate-limits"
                },
                {
                  "t": "Model deprecations",
                  "url": "https://console.groq.com/docs/deprecations"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "OpenRouter free models",
              "tag": "Many models, one key",
              "cost": "Models with a <code>:free</code> suffix cost $0.",
              "bestFor": "Trying several open models behind one API, and the <code>openrouter/free</code> router that picks an available free model.",
              "limits": "20 requests/minute. 50 requests/day, or 1,000/day once the account has bought at least $10 of credit (one-time). Free models appear and disappear; pin a model ID and keep a fallback.",
              "how": "Key at openrouter.ai. Base URL <code>https://openrouter.ai/api/v1</code>.",
              "links": [
                {
                  "t": "Credit and rate limits",
                  "url": "https://openrouter.ai/docs/api_reference/limits"
                },
                {
                  "t": "Free models router",
                  "url": "https://openrouter.ai/openrouter/free"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Cloudflare Workers AI",
              "tag": "If you deploy on Workers",
              "cost": "10,000 Neurons per day free on the Workers Free plan.",
              "bestFor": "Calling a model from a Cloudflare Worker with no extra key. Small and mid-size open models.",
              "limits": "Resets daily at 00:00 UTC. Since 28 July 2026 the largest models (Kimi K2.x, GLM-5.2, DeepSeek V4) need Workers Paid and return HTTP 403 on the free plan.",
              "how": "Use the <code>AI</code> binding in a Worker, or the REST API with an account token.",
              "links": [
                {
                  "t": "Workers AI pricing",
                  "url": "https://developers.cloudflare.com/workers-ai/platform/pricing/"
                },
                {
                  "t": "Models that now need Workers Paid",
                  "url": "https://developers.cloudflare.com/changelog/post/2026-07-28-models-require-workers-paid/"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Mistral La Plateforme",
              "tag": "Backup",
              "cost": "Free Experiment plan, no card (phone verification).",
              "bestFor": "A European provider for comparison runs.",
              "limits": "Rate-limited and meant for evaluation, not production. Mistral does not publish the free numbers; check Admin Console, Limits.",
              "how": "Sign up at console.mistral.ai and choose the Experiment plan.",
              "links": [
                {
                  "t": "Mistral free tier announcement (Sep 2024)",
                  "url": "https://mistral.ai/fr/news/september-24-release"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Hugging Face Inference Providers",
              "tag": "Tiny credit",
              "cost": "$0.10 of credit per month on a free account ($2 on PRO).",
              "bestFor": "Trying a specific open model once. Too small for eval runs.",
              "limits": "After the credit, usage is billed at provider rates.",
              "how": "Create a token at huggingface.co and call a provider through the HF router.",
              "links": [
                {
                  "t": "Pricing and billing",
                  "url": "https://huggingface.co/docs/inference-providers/pricing"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "NVIDIA API catalog (NIM)",
              "tag": "Prototyping only",
              "cost": "Free trial access for NVIDIA Developer Program members.",
              "bestFor": "Testing large open models (Nemotron, Qwen, DeepSeek) that you cannot run locally.",
              "limits": "Rate-limited; NVIDIA does not publish one quota for all models. Terms allow prototyping, not production.",
              "how": "Join the NVIDIA Developer Program, then generate a key at build.nvidia.com.",
              "links": [
                {
                  "t": "build.nvidia.com",
                  "url": "https://build.nvidia.com/"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Ollama (local models)",
              "tag": "Offline, unlimited",
              "cost": "Free. Runs on your laptop.",
              "bestFor": "Unit tests, CI-style loops and offline work. No quota, nothing leaves your machine. LM Studio is a GUI alternative with the same idea.",
              "limits": "Speed and quality depend on your RAM. Models with tool calling that fit a student laptop: <code>qwen3.5:4b</code> or <code>qwen3.5:9b</code>, <code>gemma4:e4b</code> (9.6 GB download), <code>gpt-oss:20b</code> (needs about 16 GB of memory). Do not tune prompts only on a local model.",
              "how": "Install Ollama, <code>ollama pull qwen3.5:4b</code>, then call <code>http://localhost:11434/v1</code> with any OpenAI client.",
              "links": [
                {
                  "t": "Tool calling in Ollama",
                  "url": "https://docs.ollama.com/capabilities/tool-calling"
                },
                {
                  "t": "qwen3.5 sizes",
                  "url": "https://ollama.com/library/qwen3.5"
                },
                {
                  "t": "gemma4",
                  "url": "https://ollama.com/library/gemma4"
                },
                {
                  "t": "gpt-oss (OpenAI)",
                  "url": "https://openai.com/index/introducing-gpt-oss/"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Anthropic and OpenAI APIs",
              "tag": "No free tier",
              "cost": "Pay as you go. Neither has a standing free API tier for new accounts.",
              "bestFor": "Only if your pair gets credits (Claude Campus Builder Club, a hackathon, your university).",
              "limits": "OpenAI offers complimentary daily tokens only if your organisation opts in to share API data for training; do not do that with anything private.",
              "how": "Keep the code provider-neutral (OpenAI-compatible client) so you can switch if credits appear.",
              "links": [
                {
                  "t": "Claude pricing",
                  "url": "https://claude.com/pricing"
                },
                {
                  "t": "OpenAI data sharing and free tokens",
                  "url": "https://help.openai.com/en/articles/10306912-sharing-feedback-evals-and-api-data-with-openai"
                }
              ],
              "verified": "Sep 2026"
            }
          ]
        },
        {
          "title": "C. Observability and evals",
          "intro": "Default: <strong>Langfuse</strong> for traces, <strong>promptfoo</strong> for eval assertions in CI. Add Ragas if you build RAG, Inspect if your agent runs code.",
          "items": [
            {
              "name": "Langfuse",
              "tag": "Default for tracing",
              "cost": "Cloud Hobby plan free: 50,000 units/month, 30 days of data, 2 users. Self-hosting is free (MIT).",
              "bestFor": "Traces of every model call, tool call and retrieval, with tokens, cost and latency. Prompt versions and datasets. Two users fits a pair exactly.",
              "limits": "Units = traces + observations + scores, so an agent run with 20 steps uses about 20 units. Self-host runs several containers with Docker Compose.",
              "how": "Sign up on Langfuse Cloud, or <code>git clone https://github.com/langfuse/langfuse && cd langfuse && docker compose up</code>.",
              "links": [
                {
                  "t": "Pricing",
                  "url": "https://langfuse.com/pricing"
                },
                {
                  "t": "langfuse/langfuse",
                  "url": "https://github.com/langfuse/langfuse"
                }
              ],
              "verified": "Sep 2026",
              "cc": "cost-tracking"
            },
            {
              "name": "Arize Phoenix",
              "tag": "Local, no account",
              "cost": "Free to self-host with no feature gates (Elastic License 2.0). Phoenix Cloud: 2 free instances.",
              "bestFor": "Tracing on your laptop in two commands. Built on OpenTelemetry and OpenInference, so traces are portable. Used in the lab below.",
              "limits": "Self-hosted means you keep it running. ELv2 forbids offering Phoenix itself as a hosted service, which does not affect you.",
              "how": "<code>pip install arize-phoenix && phoenix serve</code>, then open <code>http://localhost:6006</code>.",
              "links": [
                {
                  "t": "Arize-ai/phoenix",
                  "url": "https://github.com/Arize-ai/phoenix"
                },
                {
                  "t": "Self-hosting",
                  "url": "https://arize.com/docs/phoenix/self-hosting"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "OpenTelemetry GenAI semantic conventions",
              "tag": "Standard",
              "cost": "Open standard.",
              "bestFor": "Naming your span attributes (<code>gen_ai.request.model</code>, <code>gen_ai.usage.input_tokens</code>, <code>gen_ai.usage.output_tokens</code>) so any backend can read them.",
              "limits": "Status is still Development; names can change. The spec moved to its own repository in 2026.",
              "how": "Use an instrumentation library that emits these attributes, or set them yourself on custom spans.",
              "links": [
                {
                  "t": "GenAI observability with OTel (2026)",
                  "url": "https://opentelemetry.io/blog/2026/genai-observability/"
                },
                {
                  "t": "semantic-conventions-genai",
                  "url": "https://github.com/open-telemetry/semantic-conventions-genai"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "promptfoo",
              "tag": "Default for evals",
              "cost": "Free, open source (MIT). Acquired by OpenAI in March 2026; the CLI stays open source.",
              "bestFor": "YAML test cases with assertions, run against several providers side by side, in CI. Also red-teaming. Caches responses on disk by default.",
              "limits": "LLM-graded assertions call a model and use your quota.",
              "how": "<code>npx promptfoo@latest init</code>, edit <code>promptfooconfig.yaml</code>, <code>npx promptfoo@latest eval</code>.",
              "links": [
                {
                  "t": "promptfoo/promptfoo",
                  "url": "https://github.com/promptfoo/promptfoo"
                },
                {
                  "t": "Promptfoo is joining OpenAI",
                  "url": "https://www.promptfoo.dev/blog/promptfoo-joining-openai/"
                }
              ],
              "verified": "Sep 2026",
              "cc": "headless"
            },
            {
              "name": "DeepEval",
              "tag": "Python tests",
              "cost": "Free, open source. Runs locally.",
              "bestFor": "Pytest-style LLM tests with ready metrics for agents, tool use and RAG.",
              "limits": "Most metrics are LLM-as-judge, so each test costs model calls. The hosted Confident AI dashboard is optional.",
              "how": "<code>pip install deepeval</code> and follow the quickstart.",
              "links": [
                {
                  "t": "Quickstart",
                  "url": "https://deepeval.com/docs/getting-started"
                },
                {
                  "t": "confident-ai/deepeval",
                  "url": "https://github.com/confident-ai/deepeval"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Inspect AI (UK AI Security Institute)",
              "tag": "Agent evals",
              "cost": "Free, open source.",
              "bestFor": "Multi-step agent evals with tools in a Docker sandbox, and a log viewer. Over 200 ready evals in Inspect Evals.",
              "limits": "More setup than promptfoo. Worth it if your project is an agent that runs code.",
              "how": "<code>pip install inspect-ai</code>, then write a Task (dataset, solver, scorer).",
              "links": [
                {
                  "t": "inspect.aisi.org.uk",
                  "url": "https://inspect.aisi.org.uk/"
                },
                {
                  "t": "UKGovernmentBEIS/inspect_ai",
                  "url": "https://github.com/UKGovernmentBEIS/inspect_ai"
                }
              ],
              "verified": "Sep 2026",
              "cc": "sandboxing"
            },
            {
              "name": "Ragas",
              "tag": "RAG only",
              "cost": "Free, open source (Apache-2.0).",
              "bestFor": "RAG metrics: faithfulness, context precision, context recall, answer relevance. Can generate a starter test set from your documents.",
              "limits": "Judge-based metrics need a model. The repo moved to <code>vibrantlabsai/ragas</code>.",
              "how": "<code>pip install ragas</code>.",
              "links": [
                {
                  "t": "Available metrics",
                  "url": "https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/"
                },
                {
                  "t": "vibrantlabsai/ragas",
                  "url": "https://github.com/vibrantlabsai/ragas"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Braintrust / LangSmith",
              "tag": "Hosted alternatives",
              "cost": "Braintrust Starter: $0, 1 GB processed data, 10k scores, 14-day retention. LangSmith Developer: free up to 5,000 traces/month.",
              "bestFor": "If a mentor or employer already uses one. Both have good experiment comparison views.",
              "limits": "Short retention on free plans; your data lives on their servers.",
              "how": "Sign up and use their SDK or OpenTelemetry export.",
              "links": [
                {
                  "t": "Braintrust pricing",
                  "url": "https://www.braintrust.dev/pricing"
                },
                {
                  "t": "LangSmith pricing",
                  "url": "https://www.langchain.com/pricing"
                }
              ],
              "verified": "Sep 2026"
            }
          ]
        },
        {
          "title": "D. Hosting, databases and sandboxes",
          "intro": "Pick hosts whose free tier survives two months of light use. Sleeping services are fine for a demo if you wake them first.",
          "items": [
            {
              "name": "Cloudflare Workers",
              "tag": "TypeScript APIs",
              "cost": "Free plan: 100,000 requests/day.",
              "bestFor": "A TypeScript API or webhook receiver that calls a model. Pairs with Workers AI.",
              "limits": "10 ms of CPU time per request on the free plan. Time spent waiting on <code>fetch()</code> to a model API does not count.",
              "how": "<code>npm create cloudflare@latest</code>, then <code>npx wrangler deploy</code>.",
              "links": [
                {
                  "t": "Workers limits",
                  "url": "https://developers.cloudflare.com/workers/platform/limits/"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Vercel Hobby",
              "tag": "Front ends",
              "cost": "Free, personal and non-commercial use only.",
              "bestFor": "A Next.js or static demo UI.",
              "limits": "If you pass a usage limit you wait 30 days for it to reset. Function duration limits apply; check before running an agent inside a function.",
              "how": "Import your GitHub repo in the Vercel dashboard.",
              "links": [
                {
                  "t": "Hobby plan",
                  "url": "https://vercel.com/docs/plans/hobby"
                },
                {
                  "t": "Function limits",
                  "url": "https://vercel.com/docs/functions/limitations"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Render",
              "tag": "Python services",
              "cost": "Free web services: 750 instance hours per workspace per month.",
              "bestFor": "A FastAPI or Flask backend or GitHub App webhook.",
              "limits": "Free services sleep after 15 minutes idle and take about a minute to wake: warm it before a demo. Free Postgres is 1 GB and expires 30 days after creation.",
              "how": "New Web Service from your repo, instance type Free.",
              "links": [
                {
                  "t": "Deploy for free",
                  "url": "https://render.com/docs/free"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Railway",
              "tag": "Short trial",
              "cost": "$5 one-time trial credit (30 days), then the Free plan with $1 of credit per month.",
              "bestFor": "Quick experiments with a database attached.",
              "limits": "$1/month runs very little. Free plan: 0.5 GB RAM, 0.5 GB volume per service.",
              "how": "Sign in with GitHub and deploy a repo.",
              "links": [
                {
                  "t": "Free trial",
                  "url": "https://docs.railway.com/pricing/free-trial"
                },
                {
                  "t": "Plans",
                  "url": "https://docs.railway.com/pricing/plans"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Supabase",
              "tag": "Postgres + pgvector",
              "cost": "Free plan: 2 active projects, 500 MB database, 1 GB file storage.",
              "bestFor": "One Postgres for app data and embeddings (pgvector), plus auth.",
              "limits": "Free projects pause after 1 week without activity. The database goes read-only at 500 MB.",
              "how": "Create a project, enable the <code>vector</code> extension.",
              "links": [
                {
                  "t": "Pricing",
                  "url": "https://supabase.com/pricing"
                },
                {
                  "t": "Supabase AI and vectors",
                  "url": "https://supabase.com/docs/guides/ai"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Neon",
              "tag": "Serverless Postgres",
              "cost": "Free plan: 0.5 GB storage and 100 compute-hours per project per month.",
              "bestFor": "Postgres with pgvector and cheap branches (one per eval run or per PR).",
              "limits": "Compute scales to zero after 5 minutes idle, so the first query after a pause is slower.",
              "how": "Create a project, <code>CREATE EXTENSION vector;</code>.",
              "links": [
                {
                  "t": "Neon plans",
                  "url": "https://neon.com/docs/introduction/plans"
                },
                {
                  "t": "pgvector on Neon",
                  "url": "https://neon.com/docs/extensions/pgvector"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "Qdrant Cloud",
              "tag": "Vector DB",
              "cost": "Free cluster: 1 GB RAM, 4 GB disk, no card.",
              "bestFor": "A dedicated vector database if pgvector is not enough.",
              "limits": "Suspended after 1 week of inactivity, deleted after 4 weeks if you do not reactivate it.",
              "how": "Create a free cluster in the Qdrant Cloud console.",
              "links": [
                {
                  "t": "Pricing",
                  "url": "https://qdrant.tech/pricing/"
                },
                {
                  "t": "Create a cluster",
                  "url": "https://qdrant.tech/documentation/cloud/create-cluster/"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": "GitHub Actions and Codespaces",
              "tag": "CI and cloud dev",
              "cost": "Actions: standard runners free and unlimited on public repos. Codespaces: 180 core-hours/month for verified students (90 hours on a 2-core machine).",
              "bestFor": "Running evals and gitleaks on every PR. A cloud dev box when a laptop is too weak.",
              "limits": "Private repos have monthly Actions minutes. Stop Codespaces when idle; storage also counts.",
              "how": "Add a workflow under <code>.github/workflows/</code>. Codespaces from the Code button of your repo.",
              "links": [
                {
                  "t": "Actions billing",
                  "url": "https://docs.github.com/en/actions/concepts/billing-and-usage"
                },
                {
                  "t": "GitHub Education for students",
                  "url": "https://docs.github.com/en/education/about-github-education/github-education-for-students/about-github-education-for-students"
                }
              ],
              "verified": "Sep 2026",
              "cc": "github-actions"
            },
            {
              "name": "E2B and Daytona sandboxes",
              "tag": "Run agent code safely",
              "cost": "E2B Hobby: $100 one-time credit. Daytona: $200 of free compute.",
              "bestFor": "Executing model-written code in an isolated VM instead of on your machine.",
              "limits": "E2B Hobby: sessions up to 1 hour, 20 concurrent sandboxes. Both bill per second after the credit, so add a timeout to every sandbox.",
              "how": "Sign up, get an API key, use the Python or TypeScript SDK. Locally, a Docker container with no network is the zero-cost option.",
              "links": [
                {
                  "t": "E2B pricing",
                  "url": "https://e2b.dev/pricing"
                },
                {
                  "t": "Daytona pricing",
                  "url": "https://www.daytona.io/pricing"
                }
              ],
              "verified": "Sep 2026",
              "cc": "sandboxing"
            }
          ]
        },
        {
          "title": "E. Security hygiene",
          "intro": "Scan before you push. Revoking a leaked key is quicker than cleaning git history.",
          "items": [
            {
              "name": "gitleaks",
              "tag": "Pre-commit",
              "cost": "Free, open source.",
              "bestFor": "Scanning your git history and working tree for API keys before they reach GitHub.",
              "limits": "Maintainers say it is feature complete and will get security fixes only. Rules match known key formats; a key with an unusual format can slip through.",
              "how": "<code>brew install gitleaks</code> or the Docker image <code>ghcr.io/gitleaks/gitleaks</code>. Run <code>gitleaks git -v .</code>. Add it as a pre-commit hook.",
              "links": [
                {
                  "t": "gitleaks/gitleaks",
                  "url": "https://github.com/gitleaks/gitleaks"
                }
              ],
              "verified": "Sep 2026",
              "cc": "hooks"
            },
            {
              "name": "GitHub secret scanning and push protection",
              "tag": "On by default",
              "cost": "Free on public repositories.",
              "bestFor": "A second net: GitHub blocks a push that contains a known key format and alerts on keys already in history.",
              "limits": "Private repos on free accounts do not get the full feature set. It knows many providers, not all.",
              "how": "Repo Settings, Code security: check that secret scanning and push protection are enabled.",
              "links": [
                {
                  "t": "Push protection",
                  "url": "https://docs.github.com/en/code-security/concepts/secret-security/push-protection"
                },
                {
                  "t": "About secret scanning",
                  "url": "https://docs.github.com/code-security/secret-scanning/about-secret-scanning"
                }
              ],
              "verified": "Sep 2026"
            },
            {
              "name": ".env hygiene",
              "tag": "Day 1",
              "cost": "Free.",
              "bestFor": "Keeping keys out of code, logs and agent context.",
              "limits": "A coding agent can read <code>.env</code> and paste it into a prompt or a log. Deny it in the agent's <a data-cc=\"permissions\">permissions</a>.",
              "how": "Commit <code>.env.example</code> with key names only. Add <code>.env</code> to <code>.gitignore</code> before the first commit. One key per person per provider. If a key leaks, revoke it first, then clean history.",
              "links": [
                {
                  "t": "gitleaks: pre-commit setup",
                  "url": "https://github.com/gitleaks/gitleaks"
                }
              ],
              "verified": "Sep 2026",
              "cc": "permissions"
            }
          ]
        }
      ]
    },
    {
      "type": "p",
      "html": "<strong>Checked and left out:</strong> Cursor (student year closed to new sign-ups, Hobby plan very limited), Windsurf and Kiro (small free quotas), Cerebras (trial needs a card), GitHub Models (retired), Fly.io (new accounts get a short trial only, no free allowance). <a href=\"https://fly.io/docs/about/free-trial/\" target=\"_blank\" rel=\"noopener\">Fly.io free trial</a>"
    },
    {
      "type": "lab",
      "id": "toolchain-smoke-test",
      "title": "Toolchain smoke test",
      "time": "75 min",
      "level": "Warm-up",
      "goal": "Prove your whole toolchain works before week 1: two model providers behind one client, a trace for every call, a secret scan and one automated eval assertion.",
      "build": [
        "Get two free keys: Gemini (aistudio.google.com) and Groq (console.groq.com). Put them in <code>.env</code> as <code>GEMINI_API_KEY=...</code> and <code>GROQ_API_KEY=...</code>. Add <code>.env</code> to <code>.gitignore</code> and commit a <code>.env.example</code> with the names only.",
        "Create a virtualenv and install: <code>pip install openai arize-phoenix arize-phoenix-otel openinference-instrumentation-openai</code>.",
        "In a second terminal, start Phoenix: <code>phoenix serve</code>. Leave it running.",
        "Save <code>smoke.py</code> (below). It reads <code>LLM_PROVIDER</code> to choose the base URL, key and model, so switching provider is an env var, not a code change.",
        "Load the keys and call both providers: <code>set -a; source .env; set +a</code>, then <code>LLM_PROVIDER=gemini python smoke.py</code> and <code>LLM_PROVIDER=groq python smoke.py</code>. If a model ID is rejected, run <code>python smoke.py --list</code> and set <code>LLM_MODEL</code>.",
        "Install gitleaks and scan: <code>gitleaks git -v .</code> for history, then <code>gitleaks dir -v .</code> for the working tree.",
        "Save <code>promptfooconfig.yaml</code>:<pre><code># promptfooconfig.yaml\nprompts:\n  - \"Reply with the single word: pong\"\nproviders:\n  - google:gemini-3.1-flash-lite   # reads GEMINI_API_KEY\n  - groq:openai/gpt-oss-120b       # reads GROQ_API_KEY\ntests:\n  - assert:\n      - type: icontains\n        value: pong\n</code></pre>Run <code>npx promptfoo@latest eval</code>, then run it a second time."
      ],
      "verify": [
        "Each <code>smoke.py</code> run prints one line like <code>groq openai/gpt-oss-120b 412 ms in=.. out=.. -&gt; 'pong'</code> with non-zero token counts. Write both latencies in your README.",
        "<code>http://localhost:6006</code> shows project <code>smoke-test</code> with 2 traces. Each LLM span shows the model name and prompt/completion token counts.",
        "Without Phoenix running, the script still answers but logs <code>Failed to export traces</code>. That tells you tracing is wired and only the collector is missing.",
        "<code>gitleaks git -v .</code> ends with <code>no leaks found</code> and <code>echo $?</code> prints <code>0</code>. <code>gitleaks dir -v .</code> may flag the Gemini key in your <code>.env</code> (rule <code>gcp-api-key</code>). That is expected: the file holds real secrets, which is why it must stay out of git.",
        "Negative test: outside the repo, write a fake token (<code>ghp_</code> followed by 36 random letters and digits) to <code>leak.txt</code> and run <code>gitleaks dir -v leak.txt</code>. Expect RuleID <code>github-pat</code>, <code>leaks found: 1</code>, exit code 1.",
        "promptfoo reports 2 passed and 0 failed (1 test x 2 providers). The second run is faster and uses no quota because answers come from <code>~/.promptfoo/cache</code>. <code>--no-cache</code> forces fresh calls."
      ],
      "code": {
        "lang": "py",
        "title": "smoke.py",
        "text": "# smoke.py: one OpenAI-compatible client, provider picked by LLM_PROVIDER\nimport os, sys, time\nfrom openai import OpenAI\nfrom phoenix.otel import register\n\nPROVIDERS = {  # name: (base_url, env var holding the key, default model)\n    \"gemini\": (\"https://generativelanguage.googleapis.com/v1beta/openai/\", \"GEMINI_API_KEY\", \"gemini-3.1-flash-lite\"),\n    \"groq\":   (\"https://api.groq.com/openai/v1\", \"GROQ_API_KEY\", \"openai/gpt-oss-120b\"),\n    \"ollama\": (\"http://localhost:11434/v1\", None, \"qwen3.5:4b\"),\n}\n\nregister(project_name=\"smoke-test\", auto_instrument=True, batch=True)  # spans go to Phoenix\n\nname = os.getenv(\"LLM_PROVIDER\", \"gemini\")\nbase_url, key_var, default_model = PROVIDERS[name]\nclient = OpenAI(base_url=base_url, api_key=os.environ[key_var] if key_var else \"ollama\")\nmodel = os.getenv(\"LLM_MODEL\", default_model)\n\nif \"--list\" in sys.argv:  # print the model IDs this key can use\n    for m in client.models.list():\n        print(m.id)\n    sys.exit(0)\n\nt0 = time.perf_counter()\nresp = client.chat.completions.create(\n    model=model,\n    messages=[{\"role\": \"user\", \"content\": \"Reply with the single word: pong\"}],\n)\nms = (time.perf_counter() - t0) * 1000\nu = resp.usage\nprint(f\"{name} {model} {ms:.0f} ms in={u.prompt_tokens} out={u.completion_tokens} \"\n      f\"-> {resp.choices[0].message.content.strip()!r}\")\n"
      },
      "stretch": [
        "Add <code>LLM_PROVIDER=ollama</code> with <code>qwen3.5:4b</code> and compare latency and answer quality on 5 prompts from your project.",
        "Add a fallback: on HTTP 429 from the primary provider, retry once on the other one and record which provider answered as a span attribute.",
        "Run gitleaks and the promptfoo eval in a GitHub Actions workflow on every pull request."
      ],
      "links": [
        {
          "t": "phoenix.otel register()",
          "url": "https://github.com/Arize-ai/phoenix"
        },
        {
          "t": "promptfoo",
          "url": "https://github.com/promptfoo/promptfoo"
        },
        {
          "t": "gitleaks",
          "url": "https://github.com/gitleaks/gitleaks"
        }
      ],
      "cc": [
        "hooks",
        "cost-tracking",
        "headless"
      ]
    },
    {
      "type": "callout",
      "tone": "tip",
      "title": "Make free quotas last, within the rules",
      "html": "<ul><li>Use one account per person per provider. Creating extra accounts to multiply a free quota breaks most terms of service and can get all your keys banned.</li><li>Spread load across <em>different</em> providers instead: primary for normal runs, fallback on HTTP 429.</li><li>Cache every model response during eval runs, keyed on a hash of (model, prompt, parameters). promptfoo does this by default; do the same in your own runner. Re-running an unchanged eval should cost zero requests.</li><li>Develop against Ollama or the smallest free model. Save the stronger model for the eval runs you report.</li><li>Put a hard cap in code: max requests and tokens per run. A loop bug can empty a daily quota in minutes. See <a data-cc=\"cost-tracking\">cost tracking</a>.</li><li>Never send private data or secrets to a free tier that may train on it (Gemini free tier, some Zen and OpenRouter free models).</li></ul>"
    },
    {
      "type": "checklist",
      "id": "tools-ready",
      "title": "You are ready when",
      "items": [
        "Each teammate has a working coding harness and a second one installed as backup.",
        "A rules file (AGENTS.md) exists at the repo root and your harness reads it.",
        "<code>smoke.py</code> gets an answer from two providers, switched only by <code>LLM_PROVIDER</code>.",
        "Both calls appear as traces with token counts in Phoenix or Langfuse.",
        "<code>gitleaks git -v .</code> reports no leaks, <code>.env</code> is in <code>.gitignore</code>, and push protection is on.",
        "One promptfoo assertion passes on both providers, and a second run hits the cache.",
        "Your README lists the models you use, their free-tier limits, and the date you checked them."
      ]
    }
  ]
};
