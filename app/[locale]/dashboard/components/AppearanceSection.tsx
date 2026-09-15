"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Theme = "violet" | "ocean" | "midnight";

type AppearanceSectionProps = {
  isFrench: boolean;
  userId: string;
  currentTheme: Theme;
  onThemeUpdated: (theme: Theme) => void;
};

const themes: {
  id: Theme;
  name: string;
  background: string;
  accent: string;
}[] = [
  {
    id: "violet",
    name: "Violet",
    background: "bg-white",
    accent: "bg-violet-600",
  },
  {
    id: "ocean",
    name: "Ocean",
    background: "bg-sky-50",
    accent: "bg-blue-600",
  },
  {
    id: "midnight",
    name: "Midnight",
    background: "bg-slate-950",
    accent: "bg-slate-700",
  },
];

export default function AppearanceSection({
  isFrench,
  userId,
  currentTheme,
  onThemeUpdated,
}: AppearanceSectionProps) {
  const supabase = createClient();

  const [selectedTheme, setSelectedTheme] =
    useState<Theme>(currentTheme);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSelectedTheme(currentTheme);
  }, [currentTheme]);

  async function saveTheme() {
    if (!userId) return;

    setSaving(true);
    setSaved(false);

    const { error } = await supabase
      .from("profiles")
      .update({
        theme: selectedTheme,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      console.error(error);
      return;
    }

    onThemeUpdated(selectedTheme);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
        {isFrench ? "Apparence" : "Appearance"}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {isFrench
          ? "Choisissez votre style"
          : "Choose your LinkCard style"}
      </h2>

      <p className="mt-3 text-slate-600">
        {isFrench
          ? "Choisissez le thème de votre profil public."
          : "Choose how your public profile looks to visitors."}
      </p>

      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {themes.map((theme) => {
          const selected =
            selectedTheme === theme.id;

          return (
            <button
              key={theme.id}
              type="button"
              onClick={() =>
                setSelectedTheme(theme.id)
              }
              className={`relative rounded-3xl border-2 p-4 text-left transition ${
                selected
                  ? "border-violet-600"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              {selected && (
                <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-violet-600 text-white">
                  <Check size={16} />
                </div>
              )}

              <div
                className={`h-44 rounded-2xl ${theme.background} border border-slate-200 p-4`}
              >
                <div className="mx-auto h-12 w-12 rounded-full bg-slate-300" />

                <div className="mx-auto mt-4 h-3 w-24 rounded-full bg-slate-300" />

                <div className="mx-auto mt-2 h-2 w-16 rounded-full bg-slate-200" />

                <div className="mt-6 flex justify-center gap-2">
                  <div
                    className={`h-8 w-8 rounded-full ${theme.accent}`}
                  />
                  <div
                    className={`h-8 w-8 rounded-full ${theme.accent}`}
                  />
                  <div
                    className={`h-8 w-8 rounded-full ${theme.accent}`}
                  />
                </div>
              </div>

              <p className="mt-4 font-black text-slate-950">
                {theme.name}
              </p>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex items-center gap-4">
        <button
          type="button"
          onClick={saveTheme}
          disabled={saving || !userId}
          className="rounded-xl bg-violet-600 px-6 py-3 font-bold text-white transition hover:bg-violet-700 disabled:opacity-50"
        >
          {saving
            ? isFrench
              ? "Enregistrement..."
              : "Saving..."
            : isFrench
              ? "Enregistrer"
              : "Save appearance"}
        </button>

        {saved && (
          <span className="flex items-center gap-2 text-sm font-bold text-green-600">
            <Check size={17} />
            {isFrench ? "Enregistré" : "Saved"}
          </span>
        )}
      </div>
    </div>
  );
}