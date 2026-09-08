"use client";
import { createClient } from "@/lib/supabase/client";
import { useMemo, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  Camera,
  ImagePlus,
  MapPin,
  UserRound,
} from "lucide-react";

export type ProfileForm = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  socialLink: string;
  avatarUrl: string;
  coverUrl: string;
};

type ProfileSectionProps = {
  profile: ProfileForm;
  isFrench: boolean;
  updateField: (
    field: keyof ProfileForm,
    value: string,
  ) => void;
};

export default function ProfileSection({
  profile,
  isFrench,
  updateField,
}: ProfileSectionProps) {

  const supabase = useMemo(() => createClient(), []);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

  const [isUploadingCover, setIsUploadingCover] = useState(false);

  const [uploadError, setUploadError] = useState("");

    async function handleAvatarUpload(file: File) {
  setUploadError("");

  if (!file.type.startsWith("image/")) {
    setUploadError(
      isFrench
        ? "Veuillez sélectionner une image."
        : "Please select an image.",
    );
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setUploadError(
      isFrench
        ? "L’image doit faire moins de 5 Mo."
        : "The image must be smaller than 5 MB.",
    );
    return;
  }

  setIsUploadingAvatar(true);

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setUploadError(
        isFrench
          ? "Session utilisateur introuvable."
          : "User session not found.",
      );
      return;
    }

    const extension =
      file.name.split(".").pop() || "jpg";

    const filePath =
      `${user.id}/avatar.${extension}`;

    const { error: storageError } =
      await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

    if (storageError) {
      setUploadError(storageError.message);
      return;
    }

    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath);

    const avatarUrl =
      `${data.publicUrl}?v=${Date.now()}`;

    updateField("avatarUrl", avatarUrl);

    const { error: profileError } =
      await supabase
        .from("profiles")
        .update({
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
      setUploadError(profileError.message);
    }
  } finally {
    setIsUploadingAvatar(false);
  }
}
  async function handleCoverUpload(file: File) {
  setUploadError("");

  if (!file.type.startsWith("image/")) {
    setUploadError(
      isFrench
        ? "Veuillez sélectionner une image."
        : "Please select an image.",
    );
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setUploadError(
      isFrench
        ? "L’image doit faire moins de 5 Mo."
        : "The image must be smaller than 5 MB.",
    );
    return;
  }

  setIsUploadingCover(true);

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setUploadError(
        isFrench
          ? "Session utilisateur introuvable."
          : "User session not found.",
      );
      return;
    }

    const extension =
      file.name.split(".").pop() || "jpg";

    const filePath =
      `${user.id}/cover.${extension}`;

    const { error: storageError } =
      await supabase.storage
        .from("profile-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
          contentType: file.type,
        });

    if (storageError) {
      setUploadError(storageError.message);
      return;
    }

    const { data } = supabase.storage
      .from("profile-images")
      .getPublicUrl(filePath);

    const coverUrl =
      `${data.publicUrl}?v=${Date.now()}`;

    updateField("coverUrl", coverUrl);

    const { error: profileError } =
      await supabase
        .from("profiles")
        .update({
          cover_url: coverUrl,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

    if (profileError) {
      setUploadError(profileError.message);
    }
  } finally {
    setIsUploadingCover(false);
  }
}

  const initials =
    `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
      .toUpperCase() || "LC";
    `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`
      .toUpperCase() || "LC";

  return (
    <div className="space-y-6">
      {/* PHOTO / COVER */}
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
      <div className="relative h-44 overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500">
  {profile.coverUrl && (
    <img
      src={profile.coverUrl}
      alt={
        isFrench
          ? "Image de couverture"
          : "Cover image"
      }
      className="absolute inset-0 h-full w-full object-cover"
    />
  )}

  <button
    type="button"
    onClick={() => coverInputRef.current?.click()}
    disabled={isUploadingCover}
    className="absolute right-5 top-5 inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-sm font-black text-slate-800 shadow-sm transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
  >
    <ImagePlus size={18} />

    {isUploadingCover
      ? isFrench
        ? "Chargement..."
        : "Uploading..."
      : isFrench
        ? "Changer la couverture"
        : "Change cover"}
  </button>

  <input
    ref={coverInputRef}
    type="file"
    accept="image/*"
    className="hidden"
    onChange={(event) => {
      const file = event.target.files?.[0];

      if (file) {
        handleCoverUpload(file);
      }

      event.target.value = "";
    }}
  />
</div>

        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-14 flex flex-col gap-5 sm:flex-row sm:items-end">
            <div className="relative">
              <div className="flex h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-violet-500 to-fuchsia-500 shadow-xl">
  {profile.avatarUrl ? (
    <img
      src={profile.avatarUrl}
      alt={
        isFrench
          ? "Photo de profil"
          : "Profile photo"
      }
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-3xl font-black text-white">
      {initials}
    </div>
  )}
</div>

<button
  type="button"
  onClick={() => avatarInputRef.current?.click()}
  disabled={isUploadingAvatar}
  className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-violet-600 text-white shadow-md disabled:cursor-not-allowed disabled:opacity-60"
  aria-label={
    isFrench
      ? "Changer la photo de profil"
      : "Change profile photo"
  }
>
  <Camera size={17} />
</button>

<input
  ref={avatarInputRef}
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(event) => {
    const file = event.target.files?.[0];

    if (file) {
      handleAvatarUpload(file);
    }

    event.target.value = "";
  }}
/>
{uploadError && (
  <p className="mt-3 text-sm font-semibold text-red-600">
    {uploadError}
  </p>
)}
            </div>

            <div className="pb-1">
              <h2 className="text-xl font-black text-slate-950">
                {profile.firstName || profile.lastName
                  ? `${profile.firstName} ${profile.lastName}`.trim()
                  : isFrench
                    ? "Votre nom"
                    : "Your name"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {isFrench
                  ? "Photo et couverture du profil"
                  : "Profile photo and cover"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN INFORMATION */}
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
          {isFrench
            ? "Informations principales"
            : "Main information"}
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-950">
          {isFrench
            ? "Construisez votre profil"
            : "Build your profile"}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isFrench
            ? "Les modifications apparaissent immédiatement dans l’aperçu."
            : "Your changes appear immediately in the preview."}
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2">
          <ProfileInput
            label={isFrench ? "Prénom" : "First name"}
            value={profile.firstName}
            onChange={(value) =>
              updateField("firstName", value)
            }
            icon={<UserRound size={18} />}
          />

          <ProfileInput
            label={isFrench ? "Nom" : "Last name"}
            value={profile.lastName}
            onChange={(value) =>
              updateField("lastName", value)
            }
            icon={<UserRound size={18} />}
          />

          <ProfileInput
            label={isFrench ? "Poste" : "Job title"}
            value={profile.jobTitle}
            onChange={(value) =>
              updateField("jobTitle", value)
            }
            icon={<BriefcaseBusiness size={18} />}
          />

          <ProfileInput
            label={isFrench ? "Entreprise" : "Company"}
            value={profile.company}
            onChange={(value) =>
              updateField("company", value)
            }
            icon={<BriefcaseBusiness size={18} />}
          />

          <div className="sm:col-span-2">
            <ProfileInput
              label={
                isFrench ? "Localisation" : "Location"
              }
              value={profile.location}
              onChange={(value) =>
                updateField("location", value)
              }
              icon={<MapPin size={18} />}
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {isFrench
                ? "À propos de moi"
                : "About me"}
            </label>

            <textarea
              value={profile.bio}
              onChange={(event) =>
                updateField(
                  "bio",
                  event.target.value,
                )
              }
              rows={6}
              placeholder={
                isFrench
                  ? "Présentez-vous en quelques lignes..."
                  : "Tell visitors a little about yourself..."
              }
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-950 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

type ProfileInputProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
};

function ProfileInput({
  label,
  value,
  icon,
  onChange,
}: ProfileInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-950 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
        />
      </div>
    </div>
  );
}