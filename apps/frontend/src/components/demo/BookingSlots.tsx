"use client";

import { useState } from "react";
import { getAvailableSlots } from "@/lib/demo/data";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

type Props = {
  preferredDate?: string;
  preferredTime?: string;
};

type SelectedSlot = { date: Date; time: string };

export function BookingSlots({ preferredDate, preferredTime }: Props) {
  const slots = getAvailableSlots(5);
  const [selected, setSelected] = useState<SelectedSlot | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  // Group by date
  const byDay = slots.reduce<Record<string, typeof slots>>((acc, s) => {
    const key = s.date.toDateString();
    (acc[key] ??= []).push(s);
    return acc;
  }, {});

  const days = Object.entries(byDay);

  if (confirmed && selected) {
    return (
      <div className="my-3 w-full overflow-hidden rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-800 dark:bg-emerald-950/20">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40">
            ✓
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
              Demo booked!
            </p>
            <p className="mt-0.5 text-xs text-emerald-700 dark:text-emerald-400">
              {DAYS[selected.date.getDay() - 1]},{" "}
              {MONTHS[selected.date.getMonth()]} {selected.date.getDate()} ·{" "}
              {selected.time} PST
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              The AskVio team will send a calendar invite to confirm shortly.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-3 w-full overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Book a Demo
        </p>
        <p className="mt-0.5 text-sm font-medium text-foreground">
          {preferredDate
            ? `Available slots around ${preferredDate}`
            : "Pick a time that works for you"}
          {preferredTime ? ` in the ${preferredTime}` : ""}
        </p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex min-w-max gap-0">
          {days.map(([dayKey, daySlots], idx) => {
            const d = daySlots[0].date;
            const dayLabel = DAYS[d.getDay() - 1];
            const dateLabel = `${MONTHS[d.getMonth()]} ${d.getDate()}`;

            return (
              <div
                key={dayKey}
                className={[
                  "flex w-28 flex-col gap-0",
                  idx < days.length - 1 ? "border-r border-border" : "",
                ].join(" ")}
              >
                <div className="border-b border-border px-3 py-2 text-center">
                  <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {dayLabel}
                  </div>
                  <div className="text-xs font-medium text-foreground">
                    {dateLabel}
                  </div>
                </div>

                <div className="flex flex-col gap-1 p-2">
                  {daySlots.map((slot) => {
                    const isSelected =
                      selected?.date.toDateString() === dayKey &&
                      selected?.time === slot.time;

                    return slot.available ? (
                      <button
                        key={slot.time}
                        onClick={() => setSelected({ date: slot.date, time: slot.time })}
                        className={[
                          "rounded-lg py-1.5 text-[11px] font-medium transition-colors",
                          isSelected
                            ? "bg-violet-600 text-white"
                            : "bg-muted text-foreground hover:bg-violet-100 hover:text-violet-700 dark:hover:bg-violet-900/30 dark:hover:text-violet-300",
                        ].join(" ")}
                      >
                        {slot.time}
                      </button>
                    ) : (
                      <div
                        key={slot.time}
                        className="rounded-lg py-1.5 text-center text-[11px] text-muted-foreground/40 line-through"
                      >
                        {slot.time}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {selected
              ? `Selected: ${DAYS[selected.date.getDay() - 1]} ${MONTHS[selected.date.getMonth()]} ${selected.date.getDate()}, ${selected.time} PST`
              : "All times in PST"}
          </span>
          <button
            disabled={!selected}
            onClick={() => setConfirmed(true)}
            className={[
              "rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors",
              selected
                ? "bg-violet-600 text-white hover:bg-violet-700"
                : "cursor-not-allowed bg-muted text-muted-foreground",
            ].join(" ")}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
