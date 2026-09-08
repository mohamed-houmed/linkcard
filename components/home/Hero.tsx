import {
  ArrowRight,
  Check,
  Link2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";

import HeroPhone from "./HeroPhone";
import HeroQRCard from "./HeroQRCard";

const advantages = [
  {
    key: "smartLink",
    icon: Link2,
  },
  {
    key: "modern",
    icon: Sparkles,
  },
  {
    key: "updated",
    icon: RefreshCw,
  },
] as const;

const benefits = [
  "noCreditCard",
  "freeProfile",
  "updateAnytime",
] as const;

export default async function Hero() {
  const t = await getTranslations("hero");

  return (
    <section className="relative overflow-hidden bg-[#050510]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_32%,_rgba(109,40,217,0.25),_transparent_32%),radial-gradient(circle_at_20%_20%,_rgba(59,130,246,0.10),_transparent_24%)]" />

      <div className="absolute left-[65%] top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-500/10" />
      <div className="absolute left-[65%] top-1/2 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-500/10" />
      <div className="absolute left-[65%] top-1/2 h-[320px] w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-violet-500/10" />

      <div className="relative mx-auto grid min-h-[760px] w-full max-w-7xl items-center gap-16 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10 lg:py-20">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-2 text-xs font-bold text-violet-200">
            <Sparkles size={14} className="text-violet-400" />

            {t("badge")}
          </div>

          <h1 className="mt-7 text-5xl font-black leading-[1.05] tracking-[-0.045em] text-white sm:text-6xl lg:text-7xl">
            {t("title")}{" "}
            <span className="bg-gradient-to-r from-violet-400 to-fuchsia-500 bg-clip-text text-transparent">
              {t("titleHighlight")}
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300 sm:text-xl">
            {t("description")}
          </p>

          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {advantages.map((advantage) => {
              const Icon = advantage.icon;

              return (
                <div key={advantage.key} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-400/25 bg-violet-500/10 text-violet-400">
                    <Icon size={19} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-white">
                      {t(`advantages.${advantage.key}.title`)}
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      {t(`advantages.${advantage.key}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-7 py-4 text-sm font-bold text-white shadow-[0_16px_40px_rgba(124,58,237,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_20px_50px_rgba(124,58,237,0.48)]"
            >
              {t("primaryButton")}
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/mohamed-houmed"
              className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/[0.04] px-7 py-4 text-sm font-bold text-white transition hover:border-violet-400/50 hover:bg-white/[0.08]"
            >
              {t("secondaryButton")}
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-400">
            <div className="flex -space-x-3">
              {["MH", "SA", "AK"].map((initials) => (
                <div
                  key={initials}
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#050510] bg-gradient-to-br from-violet-500 to-indigo-700 text-[10px] font-black text-white"
                >
                  {initials}
                </div>
              ))}
            </div>

            <span>{t("socialProof")}</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2">
            {benefits.map((benefit) => (
              <div
                key={benefit}
                className="flex items-center gap-2 text-xs font-medium text-slate-400"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                  <Check size={12} />
                </span>

                {t(`benefits.${benefit}`)}
              </div>
            ))}
          </div>
        </div>

        <div className="relative grid items-center gap-8 xl:grid-cols-[1fr_220px]">
          <HeroPhone />

          <div className="hidden xl:block">
            <HeroQRCard />
          </div>
        </div>

        <div className="mx-auto w-full max-w-[260px] xl:hidden">
          <HeroQRCard />
        </div>
      </div>
    </section>
  );
}