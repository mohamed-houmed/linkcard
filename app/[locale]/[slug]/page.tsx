"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Globe,
  Mail,
  MapPin,
  Phone,
  Share2
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import QRCode from "qrcode";


type PublicProfile = {
  first_name: string | null;
  last_name: string | null;
  job_title: string | null;
  company: string | null;
  location: string | null;
  bio: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;
  address: string | null;
  maps_link: string | null;
  booking_link: string | null;
  avatar_url: string | null;
  cover_url: string | null;
  id: string;
  theme: "violet" | "ocean" | "midnight" | null;
};

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  is_visible: boolean;
  sort_order: number;
};

export default function PublicProfilePage() {
  const params = useParams<{
  locale: string;
  slug: string;
}>();

  const supabase = useMemo(() => createClient(), []);

  const [profile, setProfile] =
    useState<PublicProfile | null>(null);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState("");

  const isFrench = params.locale === "fr";

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          id,
          first_name,
          last_name,
          theme,
          job_title,
          company,
          location,
          bio,
          phone,
          whatsapp,
          email,
          website,
          address,
          maps_link,
          booking_link,
          avatar_url,
          cover_url
        `)
        .eq("slug", params.slug)
        .maybeSingle();
        console.log("PUBLIC PROFILE DEBUG", {
        slug: params.slug,
        data,
        error,
  });

      if (error) {
  setErrorMessage(error.message);
} else {
  setProfile(data);

  if (data?.id) {
    const { data: links } = await supabase
      .from("social_links")
      .select("id, platform, url, is_visible, sort_order")
      .eq("user_id", data.id)
      .eq("is_visible", true)
      .order("sort_order", { ascending: true });

    setSocialLinks((links ?? []) as SocialLink[]);
  }
}

      setLoading(false);
    }

    loadProfile();
  }, [params.slug, supabase]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="font-semibold text-slate-600">
          {isFrench
            ? "Chargement du profil..."
            : "Loading profile..."}
        </p>
      </main>
    );
  }

  if (errorMessage || !profile) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6">
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            {isFrench
              ? "Profil introuvable"
              : "Profile not found"}
          </h1>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-600">
              {errorMessage}
            </p>
          )}
        </div>
      </main>
    );
  }

  const fullName =
    `${profile.first_name ?? ""} ${profile.last_name ?? ""}`.trim();

  const initials =
    `${profile.first_name?.[0] ?? ""}${profile.last_name?.[0] ?? ""}`
      .toUpperCase() || "LC";

    function saveContact() {
  if (!profile) return;

  const vcard = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${profile.last_name ?? ""};${profile.first_name ?? ""};;;`,
    `FN:${fullName}`,
    profile.company ? `ORG:${profile.company}` : "",
    profile.job_title ? `TITLE:${profile.job_title}` : "",
    profile.phone ? `TEL;TYPE=CELL:${profile.phone}` : "",
    profile.email ? `EMAIL:${profile.email}` : "",
    profile.website ? `URL:${normalizeUrl(profile.website)}` : "",
    profile.address ? `ADR:;;${profile.address};;;;` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
 async function shareProfile() {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: profile
          ? `${profile.first_name} ${profile.last_name}`
          : "LinkCard",
        text: "View my professional LinkCard profile",
        url,
      });
    } catch {
      // User cancelled sharing
    }
  } else {
    await navigator.clipboard.writeText(url);
    alert("Profile link copied!");
  }
}
  const blob = new Blob([vcard], {
    type: "text/vcard;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");

  link.href = url;
  link.download = `${fullName || "linkcard"}.vcf`;

  link.click();

  URL.revokeObjectURL(url);
}

const theme = profile?.theme ?? "violet";

const themeStyles = {
  violet: {
    page: "bg-violet-50",
    card: "bg-white text-slate-950",
    header:
      "bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500",
    accent: "text-violet-600",
    button: "bg-violet-50 text-violet-700 hover:bg-violet-100",
    section: "bg-violet-50",
    title: "text-slate-950",
    muted: "text-slate-600",
    border: "border-violet-200",
  },

  ocean: {
    page: "bg-blue-50",
    card: "bg-white text-slate-950",
    header:
      "bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600",
    accent: "text-blue-600",
    button: "bg-blue-50 text-blue-700 hover:bg-blue-100",
    section: "bg-blue-50",
    title: "text-slate-950",
    muted: "text-slate-600",
    border: "border-blue-200",
  },

  midnight: {
    page: "bg-slate-950",
    card: "bg-slate-900 text-white",
    header:
      "bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950",
    accent: "text-sky-400",
    button: "bg-slate-800 text-sky-400 hover:bg-slate-700",
    section: "bg-slate-800",
    title: "text-white",
    muted: "text-slate-300",
    border: "border-slate-600",
  },
}[theme];

async function shareProfile() {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: fullName || "LinkCard",
        text: isFrench
          ? "Découvrez mon profil professionnel LinkCard"
          : "View my professional LinkCard profile",
        url,
      });
    } catch {
      // User cancelled sharing
    }
  } else {
    await navigator.clipboard.writeText(url);

    alert(
      isFrench
        ? "Lien du profil copié !"
        : "Profile link copied!"
    );
  }
}
async function toggleQrCode() {
  if (!showQrCode && !qrDataUrl) {
    try {
      const url = window.location.href;

      const dataUrl = await QRCode.toDataURL(url, {
        width: 320,
        margin: 2,
        errorCorrectionLevel: "M",
      });

      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error("QR code generation error:", error);
      return;
    }
  }

  setShowQrCode((current) => !current);
}
return (
    <main className={`min-h-screen ${themeStyles.page} px-4 py-10`}>
      <div
  className={`mx-auto w-full max-w-[420px] overflow-hidden rounded-[32px] shadow-xl ${themeStyles.card}`}
>

        <div className={`relative h-40 ${themeStyles.header}`}>
          {profile.cover_url && (
            <img
              src={profile.cover_url}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="relative px-7 pb-9">
          <div className="-mt-14 flex justify-center">
            <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-white bg-violet-600 text-3xl font-black text-white shadow-lg">
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={fullName}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>
          </div>

          <div className="mt-4 text-center">
            <h1
  className={`text-2xl font-black ${
    theme === "midnight" ? "text-white" : "text-slate-950"
  }`}
>
              {fullName || "LinkCard User"}
            </h1>

            {profile.job_title && (
              <p
  className={`mt-1 text-sm font-semibold ${
    theme === "midnight" ? "text-slate-300" : "text-slate-600"
  }`}
>
                {profile.job_title}
              </p>
            )}

            {profile.company && (
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {profile.company}
              </p>
            )}

            {profile.location && (
              <div
  className={`mt-3 flex items-center justify-center gap-1 text-sm ${
    theme === "midnight" ? "text-slate-400" : "text-slate-500"
  }`}
>
                <MapPin size={15} />
                {profile.location}
              </div>
            )}
          </div>

          <div className="mt-7 flex items-start justify-evenly gap-4">

            {profile.phone && (
              <ContactButton
                href={`tel:${profile.phone}`}
                label={isFrench ? "Appeler" : "Call"}
                icon={<Phone size={20} />}
                theme={theme}
              />
            )}

            {profile.whatsapp && (
              <ContactButton
                href={`https://wa.me/${cleanPhone(
                  profile.whatsapp,
                )}`}
                label="WhatsApp"
                icon={<FaWhatsapp size={20} />}
                theme={theme}
              />
            )}

            {profile.email && (
              <ContactButton
                href={`mailto:${profile.email}`}
                label="Email"
                icon={<Mail size={20} />}
                theme={theme}
              />
            )}

            {profile.website && (
              <ContactButton
                href={normalizeUrl(profile.website)}
                label={isFrench ? "Site" : "Website"}
                icon={<Globe size={20} />}
                theme={theme}
              />
            )}
          </div>

          <button
  type="button"
  onClick={saveContact}
  className="mt-4 w-full rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
>
  {isFrench
    ? "Enregistrer le contact"
    : "Save contact"}
</button>
<button
  type="button"
  onClick={shareProfile}
  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
>
  <Share2 size={18} />
  {isFrench ? "Partager mon profil" : "Share profile"}
</button>

<button
  type="button"
  onClick={toggleQrCode}
  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-xs font-bold text-violet-700 transition hover:bg-violet-100"
>
  {showQrCode
    ? isFrench
      ? "Masquer le QR code"
      : "Hide QR code"
    : isFrench
      ? "Afficher le QR code"
      : "Show QR code"}
</button>

{showQrCode && qrDataUrl && (
  <div className="mt-4 rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-sm">
    <p className="mb-4 font-bold text-slate-900">
      {isFrench
        ? "Scannez pour ouvrir mon profil"
        : "Scan to open my profile"}
    </p>

    <img
      src={qrDataUrl}
      alt="LinkCard profile QR code"
      className="mx-auto h-52 w-52"
    />

    <p className="mt-3 text-xs text-slate-500">
      {isFrench
        ? "Scannez avec l'appareil photo de votre téléphone"
        : "Scan with your phone camera"}
    </p>
  </div>
)}

          {profile.bio && (
            <div className="mt-7 rounded-3xl bg-slate-50 p-5">
              <h2 className="font-black text-slate-950">
                {isFrench ? "À propos" : "About me"}
              </h2>

              <p className="mt-3 whitespace-pre-line leading-7 text-slate-600">
                {profile.bio}
              </p>
            </div>
          )}

          {profile.address && (
  <a
    href={
      profile.maps_link
        ? normalizeUrl(profile.maps_link)
        : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            profile.address,
          )}`
    }
    target="_blank"
    rel="noreferrer"
    className={`mt-5 flex gap-3 rounded-2xl border p-4 transition ${themeStyles.border} ${themeStyles.muted}`}
  >
    <MapPin
  size={20}
  className={`mt-0.5 ${themeStyles.accent}`}
/>

    <div>
      <p className={`text-sm font-bold ${themeStyles.title}`}>
        {isFrench ? "Adresse" : "Address"}
      </p>

      <p className={`mt-1 text-sm ${themeStyles.muted}`}>
        {profile.address}
      </p>
    </div>
  </a>
)}

          {(profile.booking_link || profile.id) && (
            <a
              href={
  profile.booking_link
    ? normalizeUrl(profile.booking_link)
    : `/${params.locale}/book/${profile.id}`
}
              target="_blank"
              rel="noreferrer"
              className="mt-6 block rounded-2xl bg-violet-600 px-5 py-4 text-center font-black text-white transition hover:bg-violet-700"
            >
              {isFrench
                ? "Prendre rendez-vous"
                : "Book an appointment"}
            </a>
          )}

          <div className="mt-8 text-center text-xs font-semibold text-slate-400">
            {socialLinks.length > 0 && (
  <div className="mt-7">
    <h2 className={`text-center font-black ${themeStyles.title}`}>
      {isFrench
        ? "Réseaux sociaux"
        : "Connect with me"}
    </h2>

    <div className="mt-4 flex flex-wrap justify-center gap-3">
      {socialLinks.map((link) => (
        <a
          key={link.id}
          href={normalizeUrl(link.url)}
          target="_blank"
          rel="noreferrer"
          className={`rounded-full border px-4 py-2 text-sm font-bold transition ${themeStyles.border} ${themeStyles.button}`}
        >
          {link.platform}
        </a>
      ))}
    </div>
  </div>
)}
           <div className="mt-7 border-t border-slate-100 pt-6 text-center">
  <p className="text-xs font-semibold text-slate-400">
    Powered by <span className="font-bold text-violet-600">LinkCard</span>
  </p>

  <p className="mt-2 text-sm text-slate-500">
    {isFrench
      ? "Votre identité professionnelle, en un seul lien."
      : "Your professional identity, in one link."}
  </p>

  <a
    href={`/${params.locale}/signup`}
    className="mt-3 inline-flex items-center justify-center font-bold text-violet-600 transition hover:text-violet-700 hover:underline"
  >
    {isFrench
      ? "Créer ma LinkCard →"
      : "Create your LinkCard →"}
  </a>
</div>
          </div>
        </div>
      </div>
    </main>
  );
}

function ContactButton({
  href,
  label,
  icon,
  theme,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
  theme: "violet" | "ocean" | "midnight";
}) {
  return (
    <a
      href={href}
      target={
        href.startsWith("http") ? "_blank" : undefined
      }
      rel={
        href.startsWith("http") ? "noreferrer" : undefined
      }
      className="flex flex-col items-center gap-2"
    >
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-600">
        {icon}
      </span>

      <span
  className={`text-[11px] font-bold ${
    theme === "midnight" ? "text-slate-200" : "text-slate-600"
  }`}
>
  {label}
</span>
        
 </a>
);
}

function cleanPhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function normalizeUrl(url: string) {
  if (
    url.startsWith("http://") ||
    url.startsWith("https://")
  ) {
    return url;
  }

  return `https://${url}`;
}