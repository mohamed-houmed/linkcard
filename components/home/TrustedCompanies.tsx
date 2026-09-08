import { getTranslations } from "next-intl/server";

export default async function TrustedCompanies() {
  const t = await getTranslations("trustedCompanies");

  const companies = [
    "StarTimes",
    "Escale Hotel",
    "Djibouti Telecom",
    "BRED Bank",
    "OIM",
    "PNUD",
  ];

  return (
    <section className="border-t border-white/10 bg-[#050510] py-12">
      <div className="mx-auto max-w-7xl px-5">
        <p className="text-center text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
          {t("title")}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {companies.map((company) => (
            <div
              key={company}
              className="flex h-16 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-center text-lg font-bold text-slate-300 transition hover:border-violet-500/30 hover:text-white"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}