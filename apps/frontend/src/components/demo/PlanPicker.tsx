"use client";

import { useState } from "react";
import { PLANS } from "@/lib/demo/data";
import type { Plan } from "@/lib/demo/data";

type Props = {
  recommended?: Plan["id"];
  teamSize?: number;
  highlightFeatures?: string[];
};

export function PlanPicker({
  recommended,
  teamSize,
  highlightFeatures = [],
}: Props) {
  const [selected, setSelected] = useState<Plan["id"] | null>(
    recommended ?? null
  );

  return (
    <div className="my-3 w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          AskVio Plans
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">
          {teamSize
            ? `Best options for a ${teamSize}-person team`
            : "Choose the plan that fits your needs"}
        </p>
      </div>

      <div className="grid gap-0 md:grid-cols-3">
        {PLANS.map((plan, idx) => {
          const isRecommended = plan.id === recommended;
          const isSelected = plan.id === selected;

          return (
            <div
              key={plan.id}
              onClick={() => setSelected(plan.id)}
              className={[
                "relative flex cursor-pointer flex-col gap-3 p-4 transition-colors",
                idx < PLANS.length - 1
                  ? "border-b border-border md:border-b-0 md:border-r"
                  : "",
                isSelected
                  ? "bg-violet-50 dark:bg-violet-950/20"
                  : "hover:bg-muted/40",
              ].join(" ")}
            >
              {isRecommended && (
                <span className="absolute right-3 top-3 rounded-full bg-violet-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-violet-700 dark:bg-violet-900/40 dark:text-violet-300">
                  Recommended
                </span>
              )}

              <div>
                <div className="text-sm font-semibold text-foreground">
                  {plan.name}
                </div>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-foreground">
                    ${plan.priceMonthly}
                  </span>
                  <span className="text-xs text-muted-foreground">/mo</span>
                </div>
                <div className="text-[10px] text-muted-foreground">
                  or ${plan.priceAnnual}/mo billed annually
                </div>
              </div>

              <div className="h-px bg-border" />

              <ul className="flex flex-col gap-1.5">
                {plan.features.map((f) => {
                  const isHighlighted = highlightFeatures.some((h) =>
                    f.toLowerCase().includes(h.toLowerCase())
                  );
                  return (
                    <li
                      key={f}
                      className={[
                        "flex items-start gap-1.5 text-xs",
                        isHighlighted
                          ? "font-semibold text-violet-700 dark:text-violet-300"
                          : "text-muted-foreground",
                      ].join(" ")}
                    >
                      <span className="mt-px text-[10px] text-emerald-500">✓</span>
                      {f}
                    </li>
                  );
                })}
              </ul>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(plan.id);
                }}
                className={[
                  "mt-auto w-full rounded-lg py-2 text-xs font-semibold transition-colors",
                  isRecommended || isSelected
                    ? "bg-violet-600 text-white hover:bg-violet-700"
                    : "border border-border text-foreground hover:bg-muted",
                ].join(" ")}
              >
                {plan.cta}
              </button>
            </div>
          );
        })}
      </div>

      {selected && (
        <div className="border-t border-border bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
          You selected{" "}
          <span className="font-semibold text-foreground">
            {PLANS.find((p) => p.id === selected)?.name}
          </span>
          . Questions? Just ask.
        </div>
      )}
    </div>
  );
}
