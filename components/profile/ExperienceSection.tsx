import { BriefcaseBusiness } from "lucide-react";

import type { Experience } from "@/types/experience";

type ExperienceSectionProps = {
  experiences: Experience[];
};

export default function ExperienceSection({
  experiences,
}: ExperienceSectionProps) {
  if (!experiences.length) {
    return null;
  }

  return (
    <section className="px-5 pb-6">
      <h2 className="mb-4 text-lg font-bold text-violet-700">
        Experience
      </h2>

      <div className="space-y-5">
        {experiences.map((experience) => (
          <div
            key={experience.id}
            className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="absolute left-5 top-5 flex h-11 w-11 items-center justify-center rounded-full bg-violet-100">
              <BriefcaseBusiness
                size={20}
                className="text-violet-700"
              />
            </div>

            <div className="ml-16">
              <h3 className="text-lg font-semibold text-slate-900">
                {experience.jobTitle}
              </h3>

              <p className="mt-1 text-sm text-slate-600">
                {experience.companyName}
              </p>

              <p className="mt-1 text-sm text-violet-600">
                {experience.startDate}
                {" - "}
                {experience.isCurrent
                  ? "Present"
                  : experience.endDate}
              </p>

              {experience.description && (
                <p className="mt-3 text-sm leading-6 text-slate-700">
                  {experience.description}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}