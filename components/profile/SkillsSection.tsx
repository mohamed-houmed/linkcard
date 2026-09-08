import { Sparkles } from "lucide-react";

import type { Skill } from "@/types/skill";

type SkillsSectionProps = {
  skills: Skill[];
};

export default function SkillsSection({
  skills,
}: SkillsSectionProps) {
  const visibleSkills = skills
    .filter((skill) => skill.isVisible)
    .sort((a, b) => a.order - b.order);

  if (visibleSkills.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300">
          <Sparkles size={22} />
        </div>

        <div>
          <h2 className="text-xl font-bold text-white">
            Skills
          </h2>

          <p className="text-sm text-slate-400">
            Areas of expertise
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {visibleSkills.map((skill) => (
          <span
            key={skill.id}
            className="rounded-full border border-violet-400/20 bg-violet-500/10 px-4 py-2 text-sm font-medium text-violet-200 transition duration-300 hover:-translate-y-0.5 hover:border-violet-400/50 hover:bg-violet-500/20"
          >
            {skill.name}
          </span>
        ))}
      </div>
    </section>
  );
}