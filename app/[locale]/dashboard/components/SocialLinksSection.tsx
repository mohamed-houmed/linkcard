"use client";

import { createClient } from "@/lib/supabase/client";
import { Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaFacebook,
  FaGithub,
  FaGlobe,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from "react-icons/fa6";

type SocialPlatform =
  | "LinkedIn"
  | "Facebook"
  | "Instagram"
  | "X"
  | "YouTube"
  | "GitHub"
  | "Website";

type SocialLinkItem = {
  databaseId?: string;
  localId: string;
  platform: SocialPlatform;
  url: string;
  isVisible: boolean;
};

type SocialLinksSectionProps = {
  isFrench: boolean;
};

type SocialLinkDatabaseRow = {
  id: string;
  platform: string;
  url: string | null;
  is_visible: boolean | null;
  sort_order: number | null;
};

const platforms: SocialPlatform[] = [
  "LinkedIn",
  "Facebook",
  "Instagram",
  "X",
  "YouTube",
  "GitHub",
  "Website",
];

export default function SocialLinksSection({
  isFrench,
}: SocialLinksSectionProps) {
  const supabase = useMemo(() => createClient(), []);

  const [links, setLinks] = useState<SocialLinkItem[]>([]);
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadLinks = useCallback(
    async (authenticatedUserId: string) => {
      const { data, error } = await supabase
        .from("social_links")
        .select("id, platform, url, is_visible, sort_order")
        .eq("user_id", authenticatedUserId)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true });

      if (error) {
        throw error;
      }

      const databaseLinks = (data ?? []) as SocialLinkDatabaseRow[];

      setLinks(
        databaseLinks.map((link) => ({
          databaseId: link.id,
          localId: link.id,
          platform: link.platform as SocialPlatform,
          url: link.url ?? "",
          isVisible: link.is_visible ?? true,
        })),
      );
    },
    [supabase],
  );

  useEffect(() => {
    let cancelled = false;

    async function initializeLinks() {
      setIsLoading(true);
      setErrorMessage("");

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (cancelled) {
        return;
      }

      if (userError || !user) {
        setErrorMessage(
          isFrench
            ? "Votre session est introuvable."
            : "Your session could not be found.",
        );
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      try {
        await loadLinks(user.id);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Unknown error";

        setErrorMessage(
          isFrench
            ? `Impossible de charger les réseaux : ${message}`
            : `Unable to load social links: ${message}`,
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    initializeLinks();

    return () => {
      cancelled = true;
    };
  }, [isFrench, loadLinks, supabase]);

  function addLink() {
    setLinks((current) => [
      ...current,
      {
        localId: crypto.randomUUID(),
        platform: "LinkedIn",
        url: "",
        isVisible: true,
      },
    ]);

    setMessage("");
    setErrorMessage("");
  }

  function updateLink(
    localId: string,
    changes: Partial<SocialLinkItem>,
  ) {
    setLinks((current) =>
      current.map((link) =>
        link.localId === localId
          ? {
              ...link,
              ...changes,
            }
          : link,
      ),
    );

    setMessage("");
    setErrorMessage("");
  }

  async function removeLink(link: SocialLinkItem) {
    setErrorMessage("");
    setMessage("");

    if (link.databaseId) {
      const { error } = await supabase
        .from("social_links")
        .delete()
        .eq("id", link.databaseId)
        .eq("user_id", userId);

      if (error) {
        setErrorMessage(
          isFrench
            ? `Suppression impossible : ${error.message}`
            : `Unable to delete: ${error.message}`,
        );
        return;
      }
    }

    setLinks((current) =>
      current.filter(
        (currentLink) => currentLink.localId !== link.localId,
      ),
    );
  }

  async function saveLinks() {
    if (!userId) {
      setErrorMessage(
        isFrench ? "Utilisateur introuvable." : "User not found.",
      );
      return;
    }

    const normalizedLinks = links.map((link) => {
      const trimmedUrl = link.url.trim();
      const normalizedUrl = /^https?:\/\//i.test(trimmedUrl)
        ? trimmedUrl
        : `https://${trimmedUrl}`;

      return {
        ...link,
        url: normalizedUrl,
      };
    });

    const invalidLink = normalizedLinks.find((link) => {
      if (!link.url || link.url === "https://") {
        return true;
      }

      try {
        const parsedUrl = new URL(link.url);
        return !parsedUrl.hostname.includes(".");
      } catch {
        return true;
      }
    });

    if (invalidLink) {
      setErrorMessage(
        isFrench
          ? "Veuillez saisir une adresse valide pour chaque réseau social."
          : "Please enter a valid address for every social link.",
      );
      return;
    }

    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      const existingLinks = normalizedLinks.filter(
        (link) => Boolean(link.databaseId),
      );
      const newLinks = normalizedLinks.filter(
        (link) => !link.databaseId,
      );

      for (const [index, link] of normalizedLinks.entries()) {
        if (!link.databaseId) {
          continue;
        }

        const { error } = await supabase
          .from("social_links")
          .update({
            platform: link.platform,
            label: link.platform,
            url: link.url,
            is_visible: link.isVisible,
            sort_order: index,
          })
          .eq("id", link.databaseId)
          .eq("user_id", userId);

        if (error) {
          throw error;
        }
      }

      if (newLinks.length > 0) {
        const rowsToInsert = newLinks.map((link) => ({
          user_id: userId,
          platform: link.platform,
          label: link.platform,
          url: link.url,
          is_visible: link.isVisible,
          sort_order: normalizedLinks.findIndex(
            (currentLink) => currentLink.localId === link.localId,
          ),
        }));

        const { error } = await supabase
          .from("social_links")
          .insert(rowsToInsert);

        if (error) {
          throw error;
        }
      }

      // Silence an unused-variable warning while keeping the split explicit.
      void existingLinks;

      await loadLinks(userId);

      setMessage(
        isFrench
          ? "Réseaux sociaux enregistrés."
          : "Social links saved.",
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unknown error";

      setErrorMessage(
        isFrench
          ? `Échec de l’enregistrement : ${message}`
          : `Failed to save: ${message}`,
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold text-slate-600">
          {isFrench
            ? "Chargement des réseaux sociaux..."
            : "Loading social links..."}
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
            {isFrench ? "Réseaux sociaux" : "Social links"}
          </p>

          <h2 className="mt-2 text-2xl font-black text-slate-950">
            {isFrench ? "Ajoutez vos réseaux" : "Add your social links"}
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-600">
            {isFrench
              ? "Ajoutez une ligne différente pour chaque plateforme."
              : "Add a separate row for each platform."}
          </p>
        </div>

        <button
          type="button"
          onClick={addLink}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700"
        >
          <Plus size={18} />
          {isFrench ? "Ajouter" : "Add"}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm font-semibold text-red-700">
            {errorMessage}
          </p>
        </div>
      )}

      {message && (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <p className="text-sm font-semibold text-emerald-700">
            {message}
          </p>
        </div>
      )}

      <div className="mt-8 space-y-4">
        {links.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
            <p className="font-bold text-slate-700">
              {isFrench
                ? "Aucun réseau social ajouté."
                : "No social links added yet."}
            </p>
          </div>
        )}

        {links.map((link) => (
          <div
            key={link.localId}
            className="grid gap-4 rounded-2xl border border-slate-200 p-4 md:grid-cols-[180px_minmax(0,1fr)_110px_auto]"
          >
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {isFrench ? "Plateforme" : "Platform"}
              </label>

              <select
                value={link.platform}
                onChange={(event) => {
                  const platform = event.target.value as SocialPlatform;

                  updateLink(link.localId, {
                    platform,
                    url: "",
                  });
                }}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              >
                {platforms.map((platform) => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                URL
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <PlatformIcon platform={link.platform} />
                </span>

                <input
                  type="url"
                  value={link.url}
                  onChange={(event) =>
                    updateLink(link.localId, {
                      url: event.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-12 pr-4 text-slate-950 outline-none focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {isFrench ? "Visible" : "Visible"}
              </label>

              <button
                type="button"
                onClick={() =>
                  updateLink(link.localId, {
                    isVisible: !link.isVisible,
                  })
                }
                className={`w-full rounded-xl px-4 py-3 text-sm font-black transition ${
                  link.isVisible
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {link.isVisible
                  ? isFrench
                    ? "Oui"
                    : "Yes"
                  : isFrench
                    ? "Non"
                    : "No"}
              </button>
            </div>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeLink(link)}
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                aria-label={isFrench ? "Supprimer" : "Delete"}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={saveLinks}
        disabled={isSaving}
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-violet-600 px-6 py-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSaving
          ? isFrench
            ? "Enregistrement..."
            : "Saving..."
          : isFrench
            ? "Enregistrer les réseaux"
            : "Save social links"}
      </button>
    </div>
  );
}

function PlatformIcon({
  platform,
}: {
  platform: SocialPlatform;
}) {
  switch (platform) {
    case "LinkedIn":
      return <FaLinkedin size={18} />;
    case "Facebook":
      return <FaFacebook size={18} />;
    case "Instagram":
      return <FaInstagram size={18} />;
    case "YouTube":
      return <FaYoutube size={18} />;
    case "GitHub":
      return <FaGithub size={18} />;
    case "Website":
      return <FaGlobe size={18} />;
    default:
      return <FaGlobe size={18} />;
  }
}