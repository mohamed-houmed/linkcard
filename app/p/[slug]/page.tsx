type ProfilePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProfilePage({
  params,
}: ProfilePageProps) {
  const { slug } = await params;

  const profile = {
    fullName: "Mohamed Houmed",
    initials: "MH",
    jobTitle: "Operations Engineer",
    company: "Djibouti Telecom",
    location: "Djibouti",
    bio: "Telecommunications engineer and entrepreneur specializing in submarine cable operations, digital infrastructure and business innovation.",
    phone: "+25377000000",
    whatsapp: "25377000000",
    email: "mohamed@example.com",
    website: "https://example.com",
    linkedin: "https://www.linkedin.com",
  };

  return (
    <main className="min-h-screen bg-[#071A2B] px-4 py-10 text-white">
      <section className="mx-auto max-w-md overflow-hidden rounded-[32px] bg-white shadow-2xl">
        {/* Cover */}
        <div className="relative h-40 bg-gradient-to-r from-[#071A2B] via-[#0B4B62] to-[#16C7D9]">
          <div className="absolute right-5 top-5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs text-white">
            LinkCard
          </div>
        </div>

        {/* Profile information */}
        <div className="relative z-10 -mt-16 px-6 pb-8 text-center text-slate-900">
          <div className="relative z-20 mx-auto flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-[#E8FAFC] text-4xl font-bold text-[#071A2B] shadow-lg">
            {profile.initials}
          </div>

          <h1 className="mt-5 text-3xl font-bold">
            {profile.fullName}
          </h1>

          <p className="mt-1 font-semibold text-[#078A98]">
            {profile.jobTitle}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {profile.company}
          </p>

          <p className="mt-1 text-sm text-slate-400">
            {profile.location}
          </p>

          <p className="mt-5 text-sm leading-6 text-slate-600">
            {profile.bio}
          </p>

          {/* Save contact */}
          <a
            href={`/api/vcard/${slug}`}
            className="mt-7 block rounded-xl bg-[#071A2B] px-5 py-3.5 font-semibold text-white transition hover:bg-[#102E45]"
          >
            Enregistrer le contact
          </a>

          {/* Main contact buttons */}
          <div className="mt-4 grid grid-cols-2 gap-3">
            <a
              href={`tel:${profile.phone}`}
              className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Appeler
            </a>

            <a
              href={`https://wa.me/${profile.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              WhatsApp
            </a>

            <a
              href={`mailto:${profile.email}`}
              className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              E-mail
            </a>

            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-slate-200 px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Site web
            </a>
          </div>

          {/* Professional links */}
          <div className="mt-7 border-t border-slate-200 pt-6 text-left">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400">
              Liens professionnels
            </h2>

            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-between rounded-xl bg-slate-100 px-4 py-4 font-medium text-slate-800 transition hover:bg-slate-200"
            >
              <span>LinkedIn</span>
              <span>→</span>
            </a>
          </div>

          {/* Share button */}
          <button
            type="button"
            className="mt-4 w-full rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Partager le profil
          </button>

          <p className="mt-8 text-xs text-slate-400">
            Profil LinkCard : {slug}
          </p>
        </div>
      </section>

      <p className="mt-6 text-center text-sm text-slate-400">
        Propulsé par LinkCard
      </p>
    </main>
  );
}