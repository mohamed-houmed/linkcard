"use client";
import {
  BriefcaseBusiness,
  CalendarDays,
  Check,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Menu,
  Palette,
  Phone,
  QrCode,
  Save,
  Settings,
  Share2,
  UserRound,
  X,
} from "lucide-react";
import DashboardOverviewSection from "./components/DashboardOverviewSection";
import AppointmentsSection from "./components/AppointmentsSection";
import ProfileSection from "./components/ProfileSection";
import Link from "next/link";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaLinkedin,
  FaWhatsapp,
} from "react-icons/fa6";

import { createClient } from "@/lib/supabase/client";
import ContactsSection from "./components/ContactsSection";
import AppearanceSection from "./components/AppearanceSection";
import QRCodeSection from "./components/QRCodeSection";
import SettingsSection from "./components/SettingsSection";
import SocialLinksSection from "./components/SocialLinksSection";

type ProfileForm = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  website: string;
  address: string;
  mapsLink: string;
  bookingLink: string;
  socialLink: string;
  avatarUrl: string;
  coverUrl: string;
};

type DashboardSection =
  | "dashboard"
  | "profile"
  | "contacts"
  | "social"
  | "appointments"
  | "appearance"
  | "qr"
  | "settings";

export default function DashboardPage() {
  const params = useParams<{ locale: string }>();
  const router = useRouter();
const supabase = useMemo(
  () => createClient(),
  [],
);

  const locale = params.locale ?? "en";
  const isFrench = locale === "fr";

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

const [activeSection, setActiveSection] =
  useState<DashboardSection>("dashboard");

  const [saved, setSaved] = useState(false);
  const [bookingEnabled, setBookingEnabled] = useState(false);

  const [profile, setProfile] = useState<ProfileForm>({
  firstName: "",
  lastName: "",
  jobTitle: "",
  company: "",
  location: "",
  bio: "",
  phone: "",
  whatsapp: "",
  email: "",
  socialLink: "",
  avatarUrl: "",
  coverUrl: "",
  website: "",
  address: "",
  mapsLink: "",
  bookingLink: "",
});
const [userId, setUserId] = useState("");
const [profileSlug, setProfileSlug] = useState("");
const [isLoadingProfile, setIsLoadingProfile] =
  useState(true);
const [isSavingProfile, setIsSavingProfile] =
  useState(false);
const [saveError, setSaveError] = useState("");
useEffect(() => {
  let isMounted = true;

  async function loadProfile() {
    setIsLoadingProfile(true);
    setSaveError("");

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      router.replace(`/${locale}/login`);
      return;
    }

    if (!isMounted) {
      return;
    }

    setUserId(user.id);
    const { data: bookingSettingsData } =
  await supabase
    .from("booking_settings")
    .select("is_enabled")
    .eq("user_id", user.id)
    .maybeSingle();

if (isMounted) {
  setBookingEnabled(
    bookingSettingsData?.is_enabled ?? false,
  );
}

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        first_name,
        last_name,
        slug,
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
      .eq("id", user.id)
      .maybeSingle();

      console.log("Loaded profile from Supabase:", data);
      console.log("Profile load error:", error);

    if (error) {
      setSaveError(
        isFrench
          ? `Impossible de charger le profil : ${error.message}`
          : `Unable to load profile: ${error.message}`,
      );

      setIsLoadingProfile(false);
      return;
    }

    if (data) {
  setProfileSlug(data.slug ?? "");

  setProfile({
        firstName: data.first_name ?? "",
        lastName: data.last_name ?? "",
        jobTitle: data.job_title ?? "",
        company: data.company ?? "",
        location: data.location ?? "",
        bio: data.bio ?? "",
        phone: data.phone ?? "",
        whatsapp: data.whatsapp ?? "",
        email: data.email ?? user.email ?? "",
        website: data.website ?? "",
        address: data.address ?? "",
        mapsLink: data.maps_link ?? "",
        bookingLink: data.booking_link ?? "",
        socialLink: "",
        avatarUrl: data.avatar_url ?? "",
        coverUrl: data.cover_url ?? "",
      });
    } else {
      const metadata = user.user_metadata ?? {};

      const newProfile = {
        id: user.id,
        first_name: metadata.first_name ?? "",
        last_name: metadata.last_name ?? "",
        job_title: "",
        company: "",
        location: "",
        bio: "",
        phone: "",
        whatsapp: "",
        email: user.email ?? "",
        plan: metadata.plan ?? "free",
      };

      const { error: createError } = await supabase
        .from("profiles")
        .upsert(newProfile, {
          onConflict: "id",
        });

      if (createError) {
        setSaveError(
          isFrench
            ? `Impossible de créer le profil : ${createError.message}`
            : `Unable to create profile: ${createError.message}`,
        );
      } else {
        setProfile({
  firstName: newProfile.first_name,
  lastName: newProfile.last_name,
  jobTitle: "",
  company: "",
  location: "",
  bio: "",
  phone: "",
  whatsapp: "",
  email: newProfile.email,
  website: "",
  address: "",
  mapsLink: "",
  bookingLink: "",
  socialLink: "",
  avatarUrl: "",
  coverUrl: "",
});
      }
    }

    setIsLoadingProfile(false);
  }

  loadProfile();

  return () => {
    isMounted = false;
  };
}, [
  isFrench,
  locale,
  router,
  supabase,
]);

  function updateField(
    field: keyof ProfileForm,
    value: string,
  ) {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

 async function saveProfile() {
  setIsSavingProfile(true);
  setSaveError("");
  setSaved(false);

  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    console.log("Authenticated user:", user);
    console.log("User error:", userError);

    if (userError || !user) {
      setSaveError(
        isFrench
          ? "Aucune session Supabase active. Veuillez vous reconnecter."
          : "No active Supabase session. Please sign in again.",
      );
      return;
    }

    const profileToSave = {
      id: user.id,
      first_name: profile.firstName.trim(),
      last_name: profile.lastName.trim(),
      job_title: profile.jobTitle.trim(),
      company: profile.company.trim(),
      location: profile.location.trim(),
      bio: profile.bio.trim(),
      phone: profile.phone.trim(),
      whatsapp: profile.whatsapp.trim(),
      email: profile.email.trim(),
      website: profile.website.trim(),
      address: profile.address.trim(),
      maps_link: profile.mapsLink.trim(),
      booking_link: profile.bookingLink.trim(),

      avatar_url: profile.avatarUrl,
      cover_url: profile.coverUrl,

      updated_at: new Date().toISOString(),
    };

    console.log("Profile being saved:", profileToSave);

    const { data, error } = await supabase
      .from("profiles")
      .upsert(profileToSave, {
        onConflict: "id",
      })
      .select("*")
      .single();

    console.log("Saved profile:", data);
    console.log("Supabase save error:", error);

    if (error) {
      setSaveError(
        isFrench
          ? `Erreur Supabase : ${error.message}`
          : `Supabase error: ${error.message}`,
      );
      return;
    }

    if (!data) {
      setSaveError(
        isFrench
          ? "Supabase n’a retourné aucune donnée enregistrée."
          : "Supabase returned no saved data.",
      );
      return;
    }

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2500);
  } catch (error) {
    console.error("Unexpected save error:", error);

    setSaveError(
      isFrench
        ? "Erreur inattendue pendant l’enregistrement."
        : "Unexpected error while saving.",
    );
  } finally {
    setIsSavingProfile(false);
  }
}

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim();
    async function handleSignOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Sign-out error:", error.message);
    return;
  }

  router.replace(`/${locale}/login`);
  router.refresh();
}

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen">
    <DashboardSidebar
  locale={locale}
  isFrench={isFrench}
  mobileMenuOpen={mobileMenuOpen}
  closeMobileMenu={() =>
    setMobileMenuOpen(false)
  }
  activeSection={activeSection}
  onSectionChange={(section) => {
    setActiveSection(section);
    setMobileMenuOpen(false);
  }}
/>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden"
                aria-label="Open menu"
              >
                <Menu size={21} />
              </button>

              <div>
                <p className="text-sm font-semibold text-slate-500">
                  LinkCard
                </p>

                <h1 className="text-xl font-black text-slate-950">
                  {isFrench
                    ? "Mon profil"
                    : "My profile"}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-3">
  <button
  type="button"
  onClick={saveProfile}
  disabled={isSavingProfile}
  className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60 sm:px-5"
>
  {isSavingProfile ? (
    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
  ) : saved ? (
    <Check size={18} />
  ) : (
    <Save size={18} />
  )}

  <span className="hidden sm:inline">
    {isSavingProfile
      ? isFrench
        ? "Enregistrement..."
        : "Saving..."
      : saved
        ? isFrench
          ? "Enregistré"
          : "Saved"
        : isFrench
          ? "Enregistrer"
          : "Save"}
  </span>
</button>

  <button
    type="button"
    onClick={handleSignOut}
    className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-black text-red-600 transition hover:border-red-300 hover:bg-red-100 sm:px-5"
  >
    <LogOut size={18} />

    <span className="hidden sm:inline">
      {isFrench ? "Déconnexion" : "Sign out"}
    </span>
  </button>
</div>
          </header>

          <div className="mx-auto grid max-w-[1500px] gap-8 p-5 lg:grid-cols-[minmax(0,1fr)_410px] lg:p-8">
            <section className="space-y-6">
                {activeSection === "dashboard" && (
                    <>
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div>
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
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <InputField
                    label={
                      isFrench ? "Prénom" : "First name"
                    }
                    value={profile.firstName}
                    onChange={(value) =>
                      updateField("firstName", value)
                    }
                    icon={<UserRound size={18} />}
                  />

                  <InputField
                    label={
                      isFrench ? "Nom" : "Last name"
                    }
                    value={profile.lastName}
                    onChange={(value) =>
                      updateField("lastName", value)
                    }
                    icon={<UserRound size={18} />}
                  />

                  <InputField
                    label={
                      isFrench
                        ? "Poste"
                        : "Job title"
                    }
                    value={profile.jobTitle}
                    onChange={(value) =>
                      updateField("jobTitle", value)
                    }
                    icon={
                      <BriefcaseBusiness size={18} />
                    }
                  />

                  <InputField
                    label={
                      isFrench
                        ? "Entreprise"
                        : "Company"
                    }
                    value={profile.company}
                    onChange={(value) =>
                      updateField("company", value)
                    }
                    icon={
                      <BriefcaseBusiness size={18} />
                    }
                  />

                  <div className="sm:col-span-2">
                    <InputField
                      label={
                        isFrench
                          ? "Localisation"
                          : "Location"
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
                    {profile.mapsLink && (
  <a
    href={
      /^https?:\/\//i.test(profile.mapsLink)
        ? profile.mapsLink
        : `https://${profile.mapsLink}`
    }
    target="_blank"
    rel="noreferrer"
    className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-5 py-4 text-sm font-black text-violet-700 transition hover:bg-violet-100"
  >
    <MapPin size={18} />
    {isFrench
      ? "Voir sur Google Maps"
      : "View on Google Maps"}
  </a>
)}

{userId && bookingEnabled && (
  <a
    href={`/${locale}/book/${userId}`}
    
    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-4 text-sm font-black text-white shadow-sm transition hover:opacity-95"
  >
    <CalendarDays size={18} />
    {isFrench
  ? "Prendre rendez-vous"
  : "Book an appointment"}
  </a>
)}

                    <textarea
                      value={profile.bio}
                      onChange={(event) =>
                        updateField(
                          "bio",
                          event.target.value,
                        )
                      }
                      rows={5}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-slate-950 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
                  {isFrench
                    ? "Coordonnées"
                    : "Contact details"}
                </p>

                <h2 className="mt-2 text-2xl font-black text-slate-950">
                  {isFrench
                    ? "Comment peut-on vous contacter ?"
                    : "How can people contact you?"}
                </h2>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <InputField
                    label={
                      isFrench
                        ? "Téléphone"
                        : "Phone"
                    }
                    value={profile.phone}
                    onChange={(value) =>
                      updateField("phone", value)
                    }
                    icon={<Phone size={18} />}
                  />

                  <InputField
                    label="WhatsApp"
                    value={profile.whatsapp}
                    onChange={(value) =>
                      updateField("whatsapp", value)
                    }
                    icon={<FaWhatsapp size={18} />}
                  />

                  <InputField
                    label="E-mail"
                    value={profile.email}
                    onChange={(value) =>
                      updateField("email", value)
                    }
                    icon={<Mail size={18} />}
                  />

                  <InputField
                    label={
                      isFrench
                        ? "Réseau social"
                        : "Social link"
                    }
                    value={profile.socialLink}
                    onChange={(value) =>
                      updateField("socialLink", value)
                    }
                    icon={<Share2 size={18} />}
                  />
               </div>
</div>

    </>
  )}
{activeSection === "profile" && (
  <ProfileSection
    profile={profile}
    isFrench={isFrench}
    updateField={updateField}
  />
)}

{activeSection === "contacts" && (
  <ContactsSection
    profile={profile}
    isFrench={isFrench}
    updateField={updateField}
  />
)}

{activeSection === "social" && (
  <SocialLinksSection
    isFrench={isFrench}
  />
)}
{activeSection === "appointments" && (
  <AppointmentsSection
    isFrench={isFrench}
  />
)}
{activeSection === "appearance" && (
  <AppearanceSection
    isFrench={isFrench}
  />
)}

{activeSection === "qr" && (
<QRCodeSection
  isFrench={isFrench}
  userId={userId}
  profileSlug={profileSlug}
  locale={locale}
/>
)}

{activeSection === "settings" && (
  <SettingsSection
    isFrench={isFrench}
  />
)}
</section>
            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.15em] text-violet-600">
                    {isFrench
                      ? "Aperçu en direct"
                      : "Live preview"}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    {isFrench
                      ? "Voici ce que vos visiteurs verront."
                      : "This is what visitors will see."}
                  </p>
                </div>

                <Link
                  href={`/${locale}`}
                  className="text-sm font-bold text-violet-700 hover:underline"
                >
                  {isFrench ? "Accueil" : "Home"}
                </Link>
              </div>

              <PhonePreview
                fullName={fullName}
                profile={profile}
                isFrench={isFrench}
              />
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}

type DashboardSidebarProps = {
  locale: string;
  isFrench: boolean;
  mobileMenuOpen: boolean;
  closeMobileMenu: () => void;
  activeSection: DashboardSection;
  onSectionChange: (
    section: DashboardSection,
  ) => void;
};

function DashboardSidebar({
  locale,
  isFrench,
  mobileMenuOpen,
  closeMobileMenu,
  activeSection,
  onSectionChange,
}: DashboardSidebarProps) {
  const menuItems: {
  id: DashboardSection;
  label: string;
  icon: React.ElementType;
}[] = [
  {
    id: "dashboard",
    label: isFrench
      ? "Tableau de bord"
      : "Dashboard",
    icon: LayoutDashboard,
  },
  {
    id: "profile",
    label: isFrench
      ? "Mon profil"
      : "My profile",
    icon: UserRound,
  },
  {
    id: "contacts",
    label: "Contacts",
    icon: Phone,
  },
  {
    id: "social",
    label: isFrench
      ? "Réseaux sociaux"
      : "Social links",
    icon: Share2,
  },
  {
  id: "appointments",
  label: isFrench
    ? "Rendez-vous"
    : "Appointments",
  icon: CalendarDays,
},
  {
    id: "appearance",
    label: isFrench
      ? "Apparence"
      : "Appearance",
    icon: Palette,
  },
  {
    id: "qr",
    label: "QR Code",
    icon: QrCode,
  },
  {
    id: "settings",
    label: isFrench
      ? "Paramètres"
      : "Settings",
    icon: Settings,
  },
];

  return (
    <>
      {mobileMenuOpen && (
        <button
          type="button"
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/60 lg:hidden"
          aria-label="Close menu"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#090914] text-white transition-transform duration-300 lg:static lg:translate-x-0 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link
            href={`/${locale}`}
            className="text-2xl font-black"
          >
            Link<span className="text-violet-400">Card</span>
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            className="text-slate-400 lg:hidden"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-4 py-6">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
  key={item.id}
  type="button"
  onClick={() =>
    onSectionChange(item.id)
  }
  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-bold transition ${
    activeSection === item.id
      ? "bg-violet-600 text-white"
      : "text-slate-400 hover:bg-white/5 hover:text-white"
  }`}
>
  <Icon size={19} />
  {item.label}
</button>
            );
          })}
        </nav>

        
      </aside>
    </>
  );
}

type InputFieldProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  onChange: (value: string) => void;
};

function InputField({
  label,
  value,
  icon,
  onChange,
}: InputFieldProps) {
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

type PhonePreviewProps = {
  fullName: string;
  profile: ProfileForm;
  isFrench: boolean;
};
type SectionPlaceholderProps = {
  title: string;
  description: string;
};

function SectionPlaceholder({
  title,
  description,
}: SectionPlaceholderProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
        LinkCard
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {title}
      </h2>

      <p className="mt-3 leading-7 text-slate-600">
        {description}
      </p>
    </div>
  );
}
function PhonePreview({
  fullName,
  profile,
  isFrench,
}: PhonePreviewProps) {
  const initials = `${profile.firstName.charAt(0)}${profile.lastName.charAt(0)}`.toUpperCase();

  return (
    <div className="mx-auto max-w-[390px] rounded-[42px] border-[10px] border-slate-950 bg-slate-950 p-2 shadow-2xl">
      <div className="max-h-[720px] overflow-y-auto rounded-[30px] bg-white">
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-950">
  {profile.coverUrl && (
    <img
      src={profile.coverUrl}
      alt="Cover"
      className="absolute inset-0 h-full w-full object-cover"
    />
  )}
</div>

        <div className="px-5 pb-7">
          <div className="-mt-14 flex justify-center">
            <div className="flex h-28 w-28 overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl font-black text-white shadow-xl">
  {profile.avatarUrl ? (
    <img
      src={profile.avatarUrl}
      alt="Profile"
      className="h-full w-full object-cover"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center">
      {initials || "LC"}
    </div>
  )}
</div>
          </div>

          <div className="mt-4 text-center">
            <h2 className="text-2xl font-black text-slate-950">
              {fullName || "Your Name"}
            </h2>

            <p className="mt-1 font-bold text-violet-700">
              {profile.jobTitle ||
                (isFrench ? "Votre poste" : "Your job title")}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {profile.company}
            </p>

            <p className="mt-3 flex items-center justify-center gap-1 text-xs text-slate-500">
              <MapPin size={14} />
              {profile.location}
            </p>
          </div>

         <div className="mt-6 grid grid-cols-4 gap-2">
  <PreviewAction
    icon={<Phone size={20} />}
    label={isFrench ? "Appeler" : "Call"}
    href={
      profile.phone
        ? `tel:${profile.phone}`
        : undefined
    }
  />

  <PreviewAction
    icon={<FaWhatsapp size={21} />}
    label="WhatsApp"
    href={
      profile.whatsapp
        ? `https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`
        : undefined
    }
  />

  <PreviewAction
    icon={<Mail size={20} />}
    label="Email"
    href={
      profile.email
        ? `mailto:${profile.email}`
        : undefined
    }
  />

  <PreviewAction
    icon={<Globe size={20} />}
    label={isFrench ? "Site" : "Website"}
    href={
      profile.website
        ? /^https?:\/\//i.test(profile.website)
          ? profile.website
          : `https://${profile.website}`
        : undefined
    }
  />
</div>

          <div className="mt-7 rounded-2xl bg-slate-50 p-5">
            <h3 className="font-black text-slate-950">
              {isFrench
                ? "À propos de moi"
                : "About me"}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {profile.bio}
            </p>
          </div>

          <button
            type="button"
            className="mt-6 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-4 text-sm font-black text-white"
          >
            {isFrench
              ? "Enregistrer le contact"
              : "Save Contact"}
          </button>

          <p className="mt-6 text-center text-xs text-slate-400">
            Powered by{" "}
            <span className="font-bold text-violet-600">
              LinkCard
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

type PreviewActionProps = {
  icon: React.ReactNode;
  label: string;
  href?: string;
};

function PreviewAction({
  icon,
  label,
  href,
}: PreviewActionProps) {
  const content = (
    <>
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-50 text-violet-700">
        {icon}
      </div>

      <span className="mt-2 text-center text-[10px] font-bold text-slate-600">
        {label}
      </span>
    </>
  );

  if (!href) {
    return (
      <div className="flex flex-col items-center opacity-40">
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={
        href.startsWith("http")
          ? "_blank"
          : undefined
      }
      rel={
        href.startsWith("http")
          ? "noreferrer"
          : undefined
      }
      className="flex flex-col items-center"
    >
      {content}
    </a>
  );
}