"use client";

import { Check, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type SettingsSectionProps = {
  isFrench: boolean;
  userId: string;
  locale: string;
  profileSlug: string;
  onSlugUpdated: (slug: string) => void;
};

export default function SettingsSection({
  isFrench,
  userId,
  locale,
  profileSlug,
  onSlugUpdated,
}: SettingsSectionProps) {
  const supabase = createClient();

  const [slug, setSlug] = useState(profileSlug);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setSlug(profileSlug);
  }, [profileSlug]);

  function cleanSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function saveSlug() {
    const cleanedSlug = cleanSlug(slug);

    setSlug(cleanedSlug);
    setMessage("");
    setIsError(false);

    if (cleanedSlug.length < 3) {
      setIsError(true);
      setMessage(
        isFrench
          ? "Le lien doit contenir au moins 3 caractères."
          : "The public link must contain at least 3 characters."
      );
      return;
    }

    setSaving(true);

    const { data: existing } = await supabase
      .from("profiles")
      .select("id")
      .eq("slug", cleanedSlug)
      .neq("id", userId)
      .maybeSingle();

    if (existing) {
      setSaving(false);
      setIsError(true);
      setMessage(
        isFrench
          ? "Ce lien est déjà utilisé."
          : "This public link is already taken."
      );
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update({
        slug: cleanedSlug,
      })
      .eq("id", userId);

    setSaving(false);

    if (error) {
      setIsError(true);
      setMessage(
        isFrench
          ? "Impossible de mettre à jour le lien."
          : "Unable to update the public link."
      );
      return;
    }

    onSlugUpdated(cleanedSlug);

    setMessage(
      isFrench
        ? "Lien public mis à jour."
        : "Public link updated."
    );
  }

  const profileUrl =
    typeof window !== "undefined" && slug
      ? `${window.location.origin}/${locale}/${slug}`
      : "";

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

      <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
        {isFrench ? "Paramètres" : "Settings"}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {isFrench
          ? "Lien public LinkCard"
          : "Your public LinkCard link"}
      </h2>

      <p className="mt-3 text-slate-600">
        {isFrench
          ? "Choisissez l’adresse que vous souhaitez partager avec vos contacts."
          : "Choose the public address you want to share with your contacts."}
      </p>

      <div className="mt-8">

        <label className="text-sm font-bold text-slate-950">
          {isFrench
            ? "Adresse publique"
            : "Public profile address"}
        </label>

        <div className="mt-3 flex overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

          <div className="flex items-center border-r border-slate-200 px-4 text-sm text-slate-500">
            /
          </div>

          <input
            value={slug}
            onChange={(event) =>
              setSlug(cleanSlug(event.target.value))
            }
            placeholder="your-name"
            className="min-w-0 flex-1 bg-transparent px-4 py-4 outline-none"
          />

        </div>

        <p className="mt-2 text-xs text-slate-500">
          {isFrench
            ? "Utilisez des lettres, chiffres et tirets uniquement."
            : "Use letters, numbers and hyphens only."}
        </p>

        {profileUrl && (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4">

            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              {isFrench
                ? "Votre profil"
                : "Your profile"}
            </p>

            <p className="mt-2 break-all text-sm font-semibold text-violet-600">
              {profileUrl}
            </p>

          </div>
        )}

        {message && (
          <div
            className={`mt-4 flex items-center gap-2 text-sm font-semibold ${
              isError
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {!isError && <Check size={17} />}

            {message}
          </div>
        )}

        <div className="mt-6 flex flex-wrap gap-3">

          <button
            type="button"
            onClick={saveSlug}
            disabled={saving || !userId}
            className="rounded-xl bg-violet-600 px-5 py-3 font-bold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? isFrench
                ? "Enregistrement..."
                : "Saving..."
              : isFrench
                ? "Enregistrer le lien"
                : "Save public link"}
          </button>

          {profileUrl && (
            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-200 px-5 py-3 font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink size={18} />

              {isFrench
                ? "Voir le profil"
                : "View profile"}
            </a>
          )}

        </div>

      </div>
    </div>
  );
}