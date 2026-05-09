"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import {
  CopilotChatConfigurationProvider,
  CopilotSidebar,
  useConfigureSuggestions,
  useDefaultRenderTool,
  useFrontendTool,
} from "@copilotkit/react-core/v2";
import { ThreadsDrawer } from "@/components/threads-drawer";
import drawerStyles from "@/components/threads-drawer/threads-drawer.module.css";
import { ToolFallbackCard } from "@/components/copilot/ToolFallbackCard";

import { PlanPicker } from "@/components/demo/PlanPicker";
import { PricingCalculator } from "@/components/demo/PricingCalculator";
import { BookingSlots } from "@/components/demo/BookingSlots";
import type { Plan } from "@/lib/demo/data";

function ClientOnly({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return <>{children}</>;
}

// ── Demo scenarios shown on the left canvas ──────────────────────────────────

const DEMO_PROMPTS = [
  {
    icon: "📋",
    title: "Plan recommendation",
    prompt: "Which AskVio plan is right for a 15-person SaaS team?",
  },
  {
    icon: "💰",
    title: "Pricing estimate",
    prompt:
      "How much would I pay for roughly 8,000 conversations per month with 3 widgets?",
  },
  {
    icon: "📅",
    title: "Book a demo",
    prompt: "Can I book a product demo for this week?",
  },
];

function ProductPanel() {
  return (
    <main className="flex h-screen flex-col overflow-y-auto bg-background px-6 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600 text-white text-sm font-bold">
            A
          </div>
          <span className="text-sm font-bold tracking-tight text-foreground">
            AskVio
          </span>
          <span className="ml-1 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
            Generative UI Demo
          </span>
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          The widget that answers in{" "}
          <span className="text-violet-600">interfaces</span>, not paragraphs.
        </h1>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          AskVio is an embeddable AI assistant. Instead of writing a wall of
          text, it generates bespoke interactive UI — plan pickers, cost
          calculators, booking calendars — tailored to each visitor's question.
        </p>
      </div>

      {/* Feature highlights */}
      <div className="grid gap-3 sm:grid-cols-3 mb-6">
        {[
          {
            icon: "⚡",
            title: "Instant UI generation",
            body: "The agent picks the right component for every question — no pre-built templates needed.",
          },
          {
            icon: "🎨",
            title: "Fully branded",
            body: "Match your design system with custom CSS. Your widget, your look.",
          },
          {
            icon: "📊",
            title: "Analytics built-in",
            body: "See which questions drive conversions and where visitors drop off.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-border bg-card p-4"
          >
            <div className="mb-2 text-lg">{f.icon}</div>
            <div className="text-sm font-semibold text-foreground">
              {f.title}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{f.body}</div>
          </div>
        ))}
      </div>

      {/* Try it */}
      <div className="rounded-xl border border-dashed border-border bg-card/50 p-5">
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Try the assistant →
        </p>
        <div className="flex flex-col gap-2">
          {DEMO_PROMPTS.map((d) => (
            <div
              key={d.title}
              className="flex items-start gap-3 rounded-lg border border-border bg-background px-3 py-2.5"
            >
              <span className="text-base">{d.icon}</span>
              <div>
                <div className="text-xs font-semibold text-foreground">
                  {d.title}
                </div>
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                  "{d.prompt}"
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-muted-foreground">
          Type any of these into the chat on the right — or ask your own
          question. Each generates a completely different interactive UI.
        </p>
      </div>
    </main>
  );
}

function WidgetCanvas() {
  useConfigureSuggestions({
    available: "before-first-message",
    suggestions: DEMO_PROMPTS.map((d) => ({
      title: d.title,
      message: d.prompt,
    })),
  });

  // ── Frontend tool: renderPlanPicker ────────────────────────────────────────
  useFrontendTool({
    name: "renderPlanPicker",
    description:
      "Render an interactive plan-comparison UI inline in the chat. Call this whenever the user asks which plan fits them, wants to compare plans, or asks about features. NEVER answer plan questions in text — always call this tool.",
    parameters: z.object({
      recommended: z.enum(["starter", "growth", "scale"]).optional().describe(
        "Pre-highlight the best-fit plan based on the user's context."
      ),
      teamSize: z.number().optional().describe(
        "Number of people on the team, shown in the card subtitle."
      ),
      highlightFeatures: z.array(z.string()).optional().describe(
        "Feature keywords to bold inside the plan cards (e.g. ['SLA', 'custom branding'])."
      ),
    }),
    render: ({ args }) => (
      <PlanPicker
        recommended={args.recommended as Plan["id"] | undefined}
        teamSize={args.teamSize}
        highlightFeatures={args.highlightFeatures}
      />
    ),
  });

  // ── Frontend tool: renderPricingCalculator ─────────────────────────────────
  useFrontendTool({
    name: "renderPricingCalculator",
    description:
      "Render an interactive pricing calculator inline in the chat. Call this whenever the user asks about cost, pricing, budget, or how much AskVio would cost for their situation. Pre-fill the sliders with any numbers the user mentioned. NEVER answer pricing questions in text — always call this tool.",
    parameters: z.object({
      conversations: z.number().optional().describe(
        "Expected conversations/month — pre-fills the slider."
      ),
      widgets: z.number().optional().describe(
        "Number of widget installations — pre-fills the selector."
      ),
      billing: z
        .enum(["monthly", "annual"])
        .optional()
        .describe("Billing preference — pre-sets the toggle."),
    }),
    render: ({ args }) => (
      <PricingCalculator
        conversations={args.conversations}
        widgets={args.widgets}
        billing={args.billing as "monthly" | "annual" | undefined}
      />
    ),
  });

  // ── Frontend tool: renderBookingSlots ──────────────────────────────────────
  useFrontendTool({
    name: "renderBookingSlots",
    description:
      "Render an interactive booking calendar inline in the chat. Call this whenever the user wants to book a demo, schedule a call, or speak to someone. NEVER answer booking requests in text — always call this tool.",
    parameters: z.object({
      preferredDate: z.string().optional().describe(
        "Date hint from the user, e.g. 'next Tuesday' — shown in the subtitle."
      ),
      preferredTime: z.string().optional().describe(
        "Time-of-day preference, e.g. 'afternoon' — shown in the subtitle."
      ),
    }),
    render: ({ args }) => (
      <BookingSlots
        preferredDate={args.preferredDate}
        preferredTime={args.preferredTime}
      />
    ),
  });

  // Catch-all fallback for any other tool calls
  useDefaultRenderTool({
    render: ({ name, status, result, parameters }) => (
      <ToolFallbackCard
        name={name}
        status={status}
        result={result}
        parameters={parameters}
      />
    ),
  });

  return (
    <>
      <ProductPanel />

      <CopilotSidebar
        defaultOpen
        width={420}
        input={{ disclaimer: () => null, className: "pb-6" }}
      />
    </>
  );
}

function DemoPage() {
  const [threadId, setThreadId] = useState<string | undefined>(undefined);
  return (
    <div className={drawerStyles.layout}>
      <ThreadsDrawer
        agentId="default"
        threadId={threadId}
        onThreadChange={setThreadId}
      />
      <div className={drawerStyles.mainPanel}>
        <CopilotChatConfigurationProvider agentId="default" threadId={threadId}>
          <WidgetCanvas />
        </CopilotChatConfigurationProvider>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <ClientOnly>
      <DemoPage />
    </ClientOnly>
  );
}
