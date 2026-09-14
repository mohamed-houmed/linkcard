"use client";

import { createClient } from "@/lib/supabase/client";
import {
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";

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
};

export default function PublicProfilePage() {
  const params = useParams<{
    locale: string;
    userId: string;
  }>();

  const supabase = useMemo(() => createClient(), []);

  const [profile, setProfile] =
    useState<PublicProfile | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const isFrench = params.locale === "fr";

  useEffect(() => {
    async function loadProfile() {
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          first_name,
          last_name,
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
        .eq("id", params.userId)
        .maybeSingle();

      if (error) {
        setErrorMessage(error.message);
      } else {
        setProfile(data);
      }

      setLoading(false);
    }

    loadProfile();
  }, [params.userId, supabase]);

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

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-10">
      <div className="mx-auto max-w-md overflow-hidden rounded-[32px] bg-white shadow-xl">

        <div className="relative h-44 bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500">
          {profile.cover_url && (
            <img
              src={profile.cover_url}
              alt="Cover"
              className="h-full w-full object-cover"
            />
          )}
        </div>

        <div className="relative px-6 pb-8">
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
            <h1 className="text-2xl font-black text-slate-950">
              {fullName || "LinkCard User"}
            </h1>

            {profile.job_title && (
              <p className="mt-1 font-bold text-violet-600">
                {profile.job_title}
              </p>
            )}

            {profile.company && (
              <p className="mt-1 text-sm font-semibold text-slate-600">
                {profile.company}
              </p>
            )}

            {profile.location && (
              <div className="mt-3 flex items-center justify-center gap-1 text-sm text-slate-500">
                <MapPin size={15} />
                {profile.location}
              </div>
            )}
          </div>

          <div className="mt-7 grid grid-cols-4 gap-3">

            {profile.phone && (
              <ContactButton
                href={`tel:${profile.phone}`}
                label={isFrench ? "Appeler" : "Call"}
                icon={<Phone size={20} />}
              />
            )}

            {profile.whatsapp && (
              <ContactButton
                href={`https://wa.me/${cleanPhone(
                  profile.whatsapp,
                )}`}
                label="WhatsApp"
                icon={<FaWhatsapp size={20} />}
              />
            )}

            {profile.email && (
              <ContactButton
                href={`mailto:${profile.email}`}
                label="Email"
                icon={<Mail size={20} />}
              />
            )}

            {profile.website && (
              <ContactButton
                href={normalizeUrl(profile.website)}
                label={isFrench ? "Site" : "Website"}
                icon={<Globe size={20} />}
              />
            )}
          </div>

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
            <div className="mt-5 flex gap-3 rounded-2xl border border-slate-200 p-4">
              <MapPin
                size={20}
                className="mt-0.5 text-violet-600"
              />

              <div>
                <p className="text-sm font-bold text-slate-950">
                  {isFrench ? "Adresse" : "Address"}
                </p>

                <p className="mt-1 text-sm text-slate-600">
                  {profile.address}
                </p>
              </div>
            </div>
          )}

          {profile.booking_link && (
            <a
              href={normalizeUrl(profile.booking_link)}
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
            Powered by LinkCard
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
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
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

      <span className="text-[11px] font-bold text-slate-600">
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