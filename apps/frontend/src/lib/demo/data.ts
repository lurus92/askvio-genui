export type Plan = {
  id: "starter" | "growth" | "scale";
  name: string;
  priceMonthly: number;
  priceAnnual: number;
  conversationsPerMonth: number | null; // null = unlimited
  widgets: number | null; // null = unlimited
  features: string[];
  cta: string;
};

export const PLANS: Plan[] = [
  {
    id: "starter",
    name: "Starter",
    priceMonthly: 49,
    priceAnnual: 39,
    conversationsPerMonth: 1000,
    widgets: 1,
    features: [
      "1,000 AI conversations / month",
      "1 widget installation",
      "Generative UI components",
      "Basic analytics dashboard",
      "Email support",
    ],
    cta: "Start free trial",
  },
  {
    id: "growth",
    name: "Growth",
    priceMonthly: 149,
    priceAnnual: 119,
    conversationsPerMonth: 10000,
    widgets: 5,
    features: [
      "10,000 AI conversations / month",
      "Up to 5 widget installations",
      "Generative UI components",
      "Advanced analytics & funnels",
      "Custom branding & CSS",
      "A/B testing",
      "Priority email support",
    ],
    cta: "Start free trial",
  },
  {
    id: "scale",
    name: "Scale",
    priceMonthly: 399,
    priceAnnual: 319,
    conversationsPerMonth: null,
    widgets: null,
    features: [
      "Unlimited AI conversations",
      "Unlimited widget installations",
      "Generative UI components",
      "Full analytics suite",
      "Custom branding & CSS",
      "A/B testing",
      "Dedicated CSM",
      "99.9% uptime SLA",
      "Priority phone support",
    ],
    cta: "Contact sales",
  },
];

export function recommendPlan(
  conversations: number,
  widgets: number
): Plan["id"] {
  if (conversations <= 1000 && widgets <= 1) return "starter";
  if (conversations <= 10000 && widgets <= 5) return "growth";
  return "scale";
}

// Booking slot generation — produces the next N business days with fixed time slots.
// Some slots are pseudo-randomly marked as unavailable to look realistic.
export type TimeSlot = {
  date: Date;
  time: string; // e.g. "9:00 AM"
  available: boolean;
};

const SLOT_TIMES = ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"];

// Deterministic "booked" check: avoids hydration mismatches by using
// day-of-week + slot-index, not Math.random().
function isBooked(dayOfWeek: number, slotIndex: number): boolean {
  return (dayOfWeek * 7 + slotIndex) % 5 === 0;
}

export function getAvailableSlots(businessDays = 5): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const d = new Date();
  let daysAdded = 0;

  while (daysAdded < businessDays) {
    d.setDate(d.getDate() + 1);
    const dow = d.getDay();
    if (dow === 0 || dow === 6) continue; // skip weekends

    SLOT_TIMES.forEach((time, i) => {
      slots.push({ date: new Date(d), time, available: !isBooked(dow, i) });
    });
    daysAdded++;
  }
  return slots;
}
