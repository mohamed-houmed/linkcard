"use client";

import { useState } from "react";

type AboutSectionProps = {
  bio: string | null;
};

export default function AboutSection({
  bio,
}: AboutSectionProps) {
  const [expanded, setExpanded] = useState(false);

  if (!bio) {
    return null;
  }

  const shouldShowButton = bio.length > 150;

  return (
    <section
      id="about"
      className="px-5 pb-5 pt-2"
    >
      <h2 className="text-lg font-bold text-violet-700">
        About Me
      </h2>

      <p
        className={`mt-3 text-[14px] leading-6 text-slate-700 ${
          expanded ? "" : "line-clamp-3"
        }`}
      >
        {bio}
      </p>

      {shouldShowButton && (
        <button
          type="button"
          onClick={() => setExpanded((current) => !current)}
          className="mt-1 text-sm font-semibold text-violet-600 transition hover:text-violet-800"
        >
          {expanded ? "See less" : "See more"}
        </button>
      )}
    </section>
  );
}