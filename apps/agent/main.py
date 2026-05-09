"""LangGraph entry point for `langgraph dev --port 8133`.

Wires:
- A switchable runtime (Gemini Flash-Lite + deepagents | Gemini Flash-Lite + react |
  Claude Sonnet 4.6 + react) selected by `AGENT_RUNTIME`. See
  `src/runtime.py` and the README's "Switching to a different model".
- TimingMiddleware (per-turn wall-time logging — see `src/timing.py`)
- CopilotKitMiddleware for AG-UI interop

Frontend tools (renderPlanPicker, renderPricingCalculator, renderBookingSlots)
are declared on the React side via `useFrontendTool({ name, parameters, render })`
in `src/app/demo/page.tsx`. The runtime forwards those declarations into the
agent's tool list at run time; we deliberately do NOT list them here.
"""

from __future__ import annotations

import os

from dotenv import load_dotenv

from src.intelligence_cleanup import wipe_orphan_threads
from src.prompts import SYSTEM_PROMPT
from src.runtime import build_graph


# Load .env early so GEMINI_API_KEY / ANTHROPIC_API_KEY are visible.
load_dotenv()


# Wipe orphan threads left from previous runs so the Intelligence Postgres
# stays consistent with LangGraph's in-memory checkpoint store.
wipe_orphan_threads()


_AGENT_RUNTIME = os.getenv("AGENT_RUNTIME", "gemini-flash-deep")
print(f"[runtime] AGENT_RUNTIME={_AGENT_RUNTIME}", flush=True)

_gemini_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or ""
if _AGENT_RUNTIME.startswith("gemini-") and (
    not _gemini_key or _gemini_key.startswith("stub")
):
    print(
        "\n  GEMINI_API_KEY is unset or a stub.\n"
        "   The agent will boot but chat will fail on the first turn.\n"
        "   Get a key at https://aistudio.google.com → Get API key,\n"
        "   then set GEMINI_API_KEY in both .env and apps/agent/.env.\n",
        flush=True,
    )


_use_noop = (
    _AGENT_RUNTIME.startswith("gemini-")
    and (not _gemini_key or _gemini_key.startswith("stub"))
)
if _use_noop:
    print(
        "\n[runtime] GEMINI_API_KEY missing or stub — using noop fallback graph.\n"
        "          Chat will reply with a setup pointer instead of hanging.\n",
        flush=True,
    )

# No backend tools needed for this demo — the three generative-UI tools
# (renderPlanPicker, renderPricingCalculator, renderBookingSlots) are
# registered as frontend tools in the React page and forwarded at run time.
graph = build_graph(
    "noop" if _use_noop else _AGENT_RUNTIME,
    tools=[],
    system_prompt=SYSTEM_PROMPT,
)


def main() -> None:
    """Entry point for `uv run dev` / `python -m agent`."""
    import subprocess

    subprocess.run(
        ["langgraph", "dev", "--port", "8133"],
        check=True,
    )


if __name__ == "__main__":
    main()
