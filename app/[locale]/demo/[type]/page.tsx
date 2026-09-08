import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  BriefcaseBusiness,
  Building2,
  Mail,
  MapPin,
  Phone,
  Settings,
  UsersRound,
} from "lucide-react";
import { notFound } from "next/navigation";
import { FaLinkedin, FaWhatsapp } from "react-icons/fa6";

type DemoType = "ceo" | "manager" | "engineer";

type PageProps = {
  params: Promise<{
    type: string;
    locale: string;
  }>;
};

const demoProfiles = {
  ceo: {
    name: "Ahmed Hassan",
    initials: "AH",
    role: "CEO & Founder",
    company: "Horizon Group",
    location: "Djibouti City, Djibouti",
    icon: BriefcaseBusiness,
    bio: "Entrepreneur and business leader focused on building innovative companies, developing strategic partnerships, and creating sustainable growth.",
    expertise: [
      "Business Strategy",
      "Leadership",
      "Investment",
      "Partnerships",
    ],
    phone: "+25377123456",
    whatsapp: "25377123456",
    email: "ahmed@horizongroup.com",
    linkedin: "https://www.linkedin.com",
  },

  manager: {
    name: "Sarah Ali",
    initials: "SA",
    role: "Operations Director",
    company: "Global Services",
    location: "Djibouti City, Djibouti",
    icon: UsersRound,
    bio: "Operations manager experienced in team leadership, process improvement, service delivery, and organizational performance.",
    expertise: [
      "Operations Management",
      "Team Leadership",
      "Process Improvement",
      "Project Management",
    ],
    phone: "+25377234567",
    whatsapp: "25377234567",
    email: "sarah@globalservices.com",
    linkedin: "https://www.linkedin.com",
  },

  engineer: {
    name: "Mohamed Houmed Mohamed",
    initials: "MH",
    role: "Operations Engineer",
    company: "Telecommunications",
    location: "Djibouti City, Djibouti",
    icon: Settings,
    bio: "Telecommunications operations engineer with experience in submarine cable systems, infrastructure operations, testing, maintenance, and digital innovation.",
    expertise: [
      "Telecommunications",
      "Submarine Cables",
      "Network Operations",
      "Digital Innovation",
    ],
    phone: "+25377345678",
    whatsapp: "25377345678",
    email: "mohamed@example.com",
    linkedin: "https://www.linkedin.com",
  },
} satisfies Record<DemoType, unknown>;

export default async function DemoProfilePage({
  params,
}: PageProps) {
  const { type, locale } = await params;

  if (!(type in demoProfiles)) {
    notFound();
  }

  const profile =
    demoProfiles[type as DemoType] as (typeof demoProfiles)[DemoType];

  const Icon = profile.icon;

  return (
    <main className="min-h-screen bg-[#070711] px-5 py-12">
        <div className="mx-auto mb-5 w-full max-w-md">
  <Link
    href={`/${locale}`}
    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white"
  >
    <ArrowLeft size={18} />
    {locale === "fr"
      ? "Retour à l’accueil"
      : "Back to homepage"}
  </Link>
</div>
      <div className="mx-auto w-full max-w-md">
        <article className="overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-black/40">
          <div className="relative h-44 bg-gradient-to-br from-violet-700 via-purple-700 to-indigo-950">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%)]" />
          </div>

          <div className="relative px-6 pb-8">
            <div className="-mt-16 flex justify-center">
              <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-violet-500 to-fuchsia-500 text-4xl font-black text-white shadow-xl">
                {profile.initials}
              </div>
            </div>

            <div className="mt-5 text-center">
              <div className="flex items-center justify-center gap-2">
                <h1 className="text-2xl font-black text-slate-950">
                  {profile.name}
                </h1>
              </div>

              <p className="mt-1 font-bold text-violet-700">
                {profile.role}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {profile.company}
              </p>

              <div className="mt-3 flex items-center justify-center gap-1.5 text-sm text-slate-500">
                <MapPin size={15} />
                {profile.location}
              </div>
            </div>

            <div className="mt-7 grid grid-cols-4 gap-3">
              <ActionButton
                href={`tel:${profile.phone}`}
                label="Call"
                icon={<Phone size={22} />}
              />

              <ActionButton
                href={`https://wa.me/${profile.whatsapp}`}
                label="WhatsApp"
                icon={<FaWhatsapp size={23} />}
                external
              />

              <ActionButton
                href={`mailto:${profile.email}`}
                label="Email"
                icon={<Mail size={22} />}
              />

              <ActionButton
                href={profile.linkedin}
                label="LinkedIn"
                icon={<FaLinkedin size={22} />}
                external
              />
            </div>

            <section className="mt-8 rounded-2xl bg-slate-50 p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-700">
                  <Icon size={21} />
                </div>

                <h2 className="text-lg font-black text-slate-950">
                  About
                </h2>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {profile.bio}
              </p>
            </section>

            <section className="mt-6">
              <h2 className="text-lg font-black text-slate-950">
                Expertise
              </h2>

              <div className="mt-4 flex flex-wrap gap-2">
                {profile.expertise.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-violet-50 px-4 py-2 text-sm font-semibold text-violet-700 ring-1 ring-violet-100"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </section>

            <button className="mt-8 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5">
              Save Contact
            </button>
          </div>
        </article>

        <p className="py-6 text-center text-xs text-slate-500">
          Powered by{" "}
          <span className="font-bold text-violet-400">
            LinkCard
          </span>
        </p>
      </div>
    </main>
  );
}

type ActionButtonProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  external?: boolean;
};

function ActionButton({
  href,
  label,
  icon,
  external = false,
}: ActionButtonProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="group flex flex-col items-center"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-100 transition group-hover:-translate-y-1 group-hover:bg-violet-600 group-hover:text-white">
        {icon}
      </div>

      <span className="mt-2 text-center text-[11px] font-semibold text-slate-600">
        {label}
      </span>
    </a>
  );
}