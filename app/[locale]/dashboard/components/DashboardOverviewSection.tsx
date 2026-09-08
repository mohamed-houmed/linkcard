"use client";

import {
  Eye,
  Pencil,
  QrCode,
  Share2,
  UserRoundCheck,
} from "lucide-react";

type DashboardSection =
  | "dashboard"
  | "profile"
  | "contacts"
  | "social"
  | "appearance"
  | "qr"
  | "settings";

type DashboardProfile = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
};

type DashboardOverviewSectionProps = {
  profile: DashboardProfile;
  isFrench: boolean;
  onSectionChange: (
    section: DashboardSection,
  ) => void;
};

export default function DashboardOverviewSection({
  profile,
  isFrench,
  onSectionChange,
}: DashboardOverviewSectionProps) {
  const completedFields = [
    profile.firstName,
    profile.lastName,
    profile.jobTitle,
    profile.company,
    profile.location,
    profile.bio,
    profile.phone,
    profile.whatsapp,
    profile.email,
  ].filter((value) => value.trim().length > 0).length;

  const profileCompletion = Math.round(
    (completedFields / 9) * 100,
  );

  const displayName =
    `${profile.firstName} ${profile.lastName}`.trim();

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
          {isFrench
            ? "Tableau de bord"
            : "Dashboard"}
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-950">
          {isFrench
            ? `Bienvenue${displayName ? `, ${displayName}` : ""}`
            : `Welcome${displayName ? `, ${displayName}` : ""}`}
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-600">
          {isFrench
            ? "Gérez votre profil LinkCard et suivez sa progression."
            : "Manage your LinkCard profile and track its progress."}
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardStat
          icon={<UserRoundCheck size={22} />}
          label={
            isFrench
              ? "Profil complété"
              : "Profile completion"
          }
          value={`${profileCompletion}%`}
        />

        <DashboardStat
          icon={<Eye size={22} />}
          label={
            isFrench
              ? "Vues du profil"
              : "Profile views"
          }
          value="0"
        />

        <DashboardStat
          icon={<QrCode size={22} />}
          label={
            isFrench
              ? "Scans du QR Code"
              : "QR code scans"
          }
          value="0"
        />

        <DashboardStat
          icon={<Share2 size={22} />}
          label={
            isFrench
              ? "Partages"
              : "Shares"
          }
          value="0"
        />
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
              {isFrench
                ? "Progression"
                : "Progress"}
            </p>

            <h3 className="mt-2 text-xl font-black text-slate-950">
              {isFrench
                ? "Complétez votre profil"
                : "Complete your profile"}
            </h3>
          </div>

          <span className="text-lg font-black text-violet-700">
            {profileCompletion}%
          </span>
        </div>

        <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-500 transition-all duration-500"
            style={{
              width: `${profileCompletion}%`,
            }}
          />
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-600">
          {profileCompletion === 100
            ? isFrench
              ? "Votre profil principal est complet."
              : "Your main profile is complete."
            : isFrench
              ? "Ajoutez les informations manquantes pour renforcer votre profil."
              : "Add the missing information to strengthen your profile."}
        </p>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
          {isFrench
            ? "Actions rapides"
            : "Quick actions"}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <QuickAction
            icon={<Pencil size={20} />}
            title={
              isFrench
                ? "Modifier mon profil"
                : "Edit my profile"
            }
            description={
              isFrench
                ? "Nom, poste, entreprise et présentation."
                : "Name, job title, company, and introduction."
            }
            onClick={() =>
              onSectionChange("profile")
            }
          />

          <QuickAction
            icon={<Share2 size={20} />}
            title={
              isFrench
                ? "Gérer mes réseaux"
                : "Manage social links"
            }
            description={
              isFrench
                ? "Ajoutez LinkedIn, Facebook et les autres plateformes."
                : "Add LinkedIn, Facebook, and other platforms."
            }
            onClick={() =>
              onSectionChange("social")
            }
          />

          <QuickAction
            icon={<QrCode size={20} />}
            title={
              isFrench
                ? "Voir mon QR Code"
                : "View my QR code"
            }
            description={
              isFrench
                ? "Préparez le QR Code de votre profil public."
                : "Prepare the QR code for your public profile."
            }
            onClick={() =>
              onSectionChange("qr")
            }
          />

          <QuickAction
            icon={<Eye size={20} />}
            title={
              isFrench
                ? "Personnaliser l’apparence"
                : "Customize appearance"
            }
            description={
              isFrench
                ? "Choisissez les couleurs et le style du profil."
                : "Choose the profile colors and style."
            }
            onClick={() =>
              onSectionChange("appearance")
            }
          />
        </div>
      </div>
    </div>
  );
}

type DashboardStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
};

function DashboardStat({
  icon,
  label,
  value,
}: DashboardStatProps) {
  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
        {icon}
      </div>

      <p className="mt-5 text-sm font-semibold text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-3xl font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

type QuickActionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
};

function QuickAction({
  icon,
  title,
  description,
  onClick,
}: QuickActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-violet-300 hover:bg-violet-50"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
        {icon}
      </span>

      <span>
        <span className="block font-black text-slate-950">
          {title}
        </span>

        <span className="mt-1 block text-sm leading-6 text-slate-600">
          {description}
        </span>
      </span>
    </button>
  );
}