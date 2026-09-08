"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

import type { Expertise } from "@/types/expertise";

type ExpertiseSectionProps = {
  expertise: Expertise[];
};

export default function ExpertiseSection({
  expertise,
}: ExpertiseSectionProps) {
  const visibleExpertise = (expertise ?? [])
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);

  if (visibleExpertise.length === 0) {
    return null;
  }

  return (
    <section className="px-5 pb-8 pt-2">
      <h2 className="text-lg font-bold text-violet-700">
        Areas of Expertise
      </h2>

      <div className="mt-4 space-y-3">
        {visibleExpertise.map((item) => (
          <ExpertiseCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}

type ExpertiseCardProps = {
  item: Expertise;
};

function ExpertiseCard({
  item,
}: ExpertiseCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md">
      <button
        type="button"
        onClick={() => setExpanded((current) => !current)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left"
        aria-expanded={expanded}
      >
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-slate-900">
            {item.title}
          </h3>

          {!expanded && item.description && (
            <p className="mt-1 line-clamp-1 text-sm text-slate-500">
              {item.description}
            </p>
          )}
        </div>

        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <ChevronDown
            size={18}
            className={`transition-transform duration-300 ${
              expanded ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          expanded
            ? "grid-rows-[1fr]"
            : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          {item.description && (
            <p className="border-t border-slate-100 px-4 pb-4 pt-3 text-sm leading-6 text-slate-600">
              {item.description}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}