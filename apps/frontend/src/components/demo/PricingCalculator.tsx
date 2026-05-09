"use client";

import { useState } from "react";
import { PLANS, recommendPlan } from "@/lib/demo/data";

type Billing = "monthly" | "annual";

type Props = {
  conversations?: number;
  widgets?: number;
  billing?: Billing;
};

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

const CONV_MIN = 500;
const CONV_MAX = 50000;
const WIDGET_OPTIONS = [1, 2, 3, 5, 10];

export function PricingCalculator({
  conversations: initConversations = 2000,
  widgets: initWidgets = 2,
  billing: initBilling = "monthly",
}: Props) {
  const [conversations, setConversations] = useState(
    clamp(initConversations, CONV_MIN, CONV_MAX)
  );
  const [widgets, setWidgets] = useState(clamp(initWidgets, 1, 10));
  const [billing, setBilling] = useState<Billing>(initBilling);

  const planId = recommendPlan(conversations, widgets);
  const plan = PLANS.find((p) => p.id === planId)!;
  const price = billing === "annual" ? plan.priceAnnual : plan.priceMonthly;
  const annualSavings =
    billing === "annual"
      ? (plan.priceMonthly - plan.priceAnnual) * 12
      : 0;

  // Slider percentage for display
  const pct = ((conversations - CONV_MIN) / (CONV_MAX - CONV_MIN)) * 100;

  function formatConv(n: number) {
    return n >= 1000 ? `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `${n}`;
  }

  return (
    <div className="my-3 w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Pricing Calculator
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">
          Drag to estimate your monthly cost
        </p>
      </div>

      <div className="flex flex-col gap-5 p-4">
        {/* Conversations slider */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">
              AI conversations / month
            </label>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-bold text-foreground">
              {formatConv(conversations)}
            </span>
          </div>
          <input
            type="range"
            min={CONV_MIN}
            max={CONV_MAX}
            step={500}
            value={conversations}
            onChange={(e) => setConversations(Number(e.target.value))}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-violet-600"
            style={{
              background: `linear-gradient(to right, #7c3aed ${pct}%, var(--border) ${pct}%)`,
            }}
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>{formatConv(CONV_MIN)}</span>
            <span>{formatConv(CONV_MAX)}</span>
          </div>
        </div>

        {/* Widgets picker */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-foreground">
            Widget installations
          </label>
          <div className="flex gap-2">
            {WIDGET_OPTIONS.map((w) => (
              <button
                key={w}
                onClick={() => setWidgets(w)}
                className={[
                  "flex-1 rounded-lg border py-2 text-xs font-semibold transition-colors",
                  widgets === w
                    ? "border-violet-500 bg-violet-50 text-violet-700 dark:bg-violet-950/20 dark:text-violet-300"
                    : "border-border text-muted-foreground hover:bg-muted",
                ].join(" ")}
              >
                {w === 10 ? "10+" : w}
              </button>
            ))}
          </div>
        </div>

        {/* Billing toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Monthly</span>
          <button
            onClick={() =>
              setBilling((b) => (b === "monthly" ? "annual" : "monthly"))
            }
            className={[
              "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors",
              billing === "annual" ? "bg-violet-600" : "bg-muted",
            ].join(" ")}
          >
            <span
              className={[
                "pointer-events-none block h-4 w-4 rounded-full bg-white shadow-sm transition-transform",
                billing === "annual" ? "translate-x-4" : "translate-x-0",
              ].join(" ")}
            />
          </button>
          <span className="text-xs text-muted-foreground">
            Annual{" "}
            <span className="font-semibold text-emerald-600">save 20%</span>
          </span>
        </div>

        {/* Result */}
        <div className="rounded-xl border border-violet-200 bg-violet-50 p-4 dark:border-violet-800 dark:bg-violet-950/20">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                {plan.name} plan
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">
                  ${price}
                </span>
                <span className="text-xs text-muted-foreground">/mo</span>
              </div>
              {billing === "annual" && annualSavings > 0 && (
                <div className="mt-0.5 text-[11px] font-medium text-emerald-600">
                  You save ${annualSavings}/year vs monthly
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-[10px] text-muted-foreground">Includes</div>
              <div className="mt-0.5 text-xs font-medium text-foreground">
                {plan.conversationsPerMonth
                  ? `${formatConv(plan.conversationsPerMonth)} convos`
                  : "Unlimited convos"}
              </div>
              <div className="text-xs text-muted-foreground">
                {plan.widgets ? `${plan.widgets} widget${plan.widgets > 1 ? "s" : ""}` : "Unlimited widgets"}
              </div>
            </div>
          </div>

          <button className="mt-4 w-full rounded-lg bg-violet-600 py-2 text-xs font-semibold text-white hover:bg-violet-700 transition-colors">
            {plan.id === "scale" ? "Contact sales" : "Start free trial"}
          </button>
        </div>
      </div>
    </div>
  );
}
