import { Sparkles } from "lucide-react";

import type { Expertise } from "@/types/expertise";

type Props = {
  expertise: Expertise[];
};

export default function ExpertiseSection({ expertise }: Props) {
  const visibleExpertise = (expertise ?? [])
    .filter((item) => item.isVisible)
    .sort((a, b) => a.order - b.order);

  if (visibleExpertise.length === 0) {
    return null;
  }

  return (
    <section className="px-5 pb-7 pt-2">
      <div className="mb-4 flex items-center gap-2.5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50">
          <Sparkles className="h-4.5 w-4.5 text-violet-600" />
        </div>

        <div>
          <h2 className="text-base font-bold tracking-tight text-slate-900">
            Areas of Expertise
          </h2>

          <p className="mt-0.5 text-xs text-slate-500">
            Core professional strengths
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {visibleExpertise.map((item) => (
          <span
            key={item.id}
            title={item.description ?? item.title}
            className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-semibold leading-5 text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700 hover:shadow-sm"
          >
            {item.title}
          </span>
        ))}
      </div>
    </section>
  );
}