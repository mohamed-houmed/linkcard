import {
  Link2,
  Share2,
  TrendingUp,
  UserPlus,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function HowItWorks() {
  const t = await getTranslations("howItWorks");

  const steps = [
    {
      icon: UserPlus,
      title: t("steps.create.title"),
      description: t("steps.create.description"),
    },
    {
      icon: Link2,
      title: t("steps.link.title"),
      description: t("steps.link.description"),
    },
    {
      icon: Share2,
      title: t("steps.share.title"),
      description: t("steps.share.description"),
    },
    {
      icon: TrendingUp,
      title: t("steps.grow.title"),
      description: t("steps.grow.description"),
    },
  ];

  return (
    <section
      id="how-it-works"
      className="bg-white py-28"
    >
      <div className="mx-auto max-w-7xl px-5">
        <p className="text-center text-sm font-bold uppercase tracking-[0.2em] text-violet-600">
          {t("badge")}
        </p>

        <h2 className="mt-3 text-center text-5xl font-black text-slate-900">
          {t("title")}
        </h2>

        <p className="mt-4 text-center text-lg text-slate-500">
          {t("subtitle")}
        </p>

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.title}
                className="relative rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white">
                  <Icon size={30} />
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <span className="text-sm font-bold text-violet-600">
                    {index + 1}.
                  </span>

                  <h3 className="text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>
                </div>

                <p className="mt-4 leading-7 text-slate-500">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}