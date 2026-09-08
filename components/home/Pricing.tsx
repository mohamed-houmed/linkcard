import { Check, Sparkles } from "lucide-react";
import Link from "next/link";
import {
  getLocale,
  getTranslations,
} from "next-intl/server";

export default async function Pricing() {
  const t = await getTranslations("pricing");
  const locale = await getLocale();

  const plans = [
    {
      id: "free",
      name: t("plans.free.name"),
      description: t("plans.free.description"),
      dollarPrice: "$0",
      fdjPrice: "0 FDJ",
      priceNote: t("freeForever"),
      buttonLabel: t("plans.free.buttonLabel"),
      buttonHref: `/${locale}/signup?plan=free`,
      highlighted: false,
      customPricing: false,
      features: [
        t("plans.free.features.profile"),
        t("plans.free.features.photo"),
        t("plans.free.features.identity"),
        t("plans.free.features.phone"),
        t("plans.free.features.socialLink"),
        t("plans.free.features.branding"),
      ],
    },
    {
      id: "standard",
      name: t("plans.standard.name"),
      description: t("plans.standard.description"),
      dollarPrice: "$11.50",
      fdjPrice: "1,999 FDJ",
      priceNote: t("perMonth"),
      buttonLabel: t("plans.standard.buttonLabel"),
      buttonHref: `/${locale}/signup?plan=standard`,
      highlighted: true,
      customPricing: false,
      features: [
        t("plans.standard.features.everythingFree"),
        t("plans.standard.features.whatsapp"),
        t("plans.standard.features.email"),
        t("plans.standard.features.qrCode"),
        t("plans.standard.features.coverImage"),
        t("plans.standard.features.about"),
        t("plans.standard.features.skills"),
        t("plans.standard.features.theme"),
        t("plans.standard.features.saveContact"),
      ],
    },
    {
      id: "premium",
      name: t("plans.premium.name"),
      description: t("plans.premium.description"),
      dollarPrice: t("customPricing"),
      fdjPrice: "",
      priceNote: t("contactForQuote"),
      buttonLabel: t("plans.premium.buttonLabel"),
      buttonHref: `/${locale}/contact?plan=premium`,
      highlighted: false,
      customPricing: true,
      features: [
        t("plans.premium.features.everythingStandard"),
        t("plans.premium.features.nfcCard"),
        t("plans.premium.features.premiumDesign"),
        t("plans.premium.features.removeBranding"),
        t("plans.premium.features.prioritySupport"),
        t("plans.premium.features.onboarding"),
      ],
    },
  ];

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-white py-24 sm:py-28"
    >
      <div className="absolute left-1/2 top-0 h-80 w-[760px] -translate-x-1/2 rounded-full bg-violet-100/70 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-600">
            {t("badge")}
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 sm:text-5xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="mt-16 grid items-stretch gap-7 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={
                plan.highlighted
                  ? "relative flex h-full flex-col rounded-[32px] border border-violet-500 bg-gradient-to-b from-violet-700 to-indigo-950 p-8 text-white shadow-[0_30px_80px_rgba(76,29,149,0.3)] lg:-translate-y-5"
                  : "relative flex h-full flex-col rounded-[32px] border border-slate-200 bg-white p-8 text-slate-950 shadow-[0_12px_40px_rgba(15,23,42,0.07)]"
              }
            >
              {plan.highlighted && (
                <div className="absolute left-1/2 top-0 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-500 to-violet-500 px-5 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg">
                  <Sparkles size={14} />
                  {t("mostPopular")}
                </div>
              )}

              <div>
                <h3
                  className={
                    plan.highlighted
                      ? "text-2xl font-black text-white"
                      : "text-2xl font-black text-slate-950"
                  }
                >
                  {plan.name}
                </h3>

                <p
                  className={
                    plan.highlighted
                      ? "mt-3 min-h-14 text-sm leading-6 text-violet-100"
                      : "mt-3 min-h-14 text-sm leading-6 text-slate-600"
                  }
                >
                  {plan.description}
                </p>
              </div>

              <div className="mt-7">
                <div className="flex items-end gap-2">
                  <span
                    className={
                      plan.customPricing
                        ? "text-3xl font-black tracking-tight"
                        : "text-5xl font-black tracking-tight"
                    }
                  >
                    {plan.dollarPrice}
                  </span>

                  {!plan.customPricing && plan.id !== "free" && (
                    <span
                      className={
                        plan.highlighted
                          ? "pb-1 text-sm font-semibold text-violet-200"
                          : "pb-1 text-sm font-semibold text-slate-500"
                      }
                    >
                      {t("perMonth")}
                    </span>
                  )}
                </div>

                {plan.fdjPrice && (
                  <p
                    className={
                      plan.highlighted
                        ? "mt-2 text-lg font-black text-violet-100"
                        : "mt-2 text-lg font-black text-violet-700"
                    }
                  >
                    {plan.fdjPrice}
                  </p>
                )}

                <p
                  className={
                    plan.highlighted
                      ? "mt-2 min-h-5 text-xs font-medium text-violet-200"
                      : "mt-2 min-h-5 text-xs font-medium text-slate-500"
                  }
                >
                  {plan.priceNote}
                </p>
              </div>

              <Link
                href={plan.buttonHref}
                className={
                  plan.highlighted
                    ? "mt-8 flex items-center justify-center rounded-2xl bg-white px-5 py-4 text-sm font-black text-violet-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-violet-50"
                    : "mt-8 flex items-center justify-center rounded-2xl bg-slate-950 px-5 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-violet-700"
                }
              >
                {plan.buttonLabel}
              </Link>

              <div
                className={
                  plan.highlighted
                    ? "my-8 border-t border-white/15"
                    : "my-8 border-t border-slate-200"
                }
              />

              <ul className="flex-1 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className={
                      plan.highlighted
                        ? "flex items-start gap-3 text-sm text-violet-50"
                        : "flex items-start gap-3 text-sm text-slate-700"
                    }
                  >
                    <span
                      className={
                        plan.highlighted
                          ? "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15 text-white"
                          : "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700"
                      }
                    >
                      <Check size={12} strokeWidth={3} />
                    </span>

                    <span className="leading-5">{feature}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-violet-100 bg-violet-50 px-6 py-7 text-center sm:px-10">
          <h3 className="text-lg font-black text-slate-950">
            {t("nfcCard.title")}
          </h3>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            {t("nfcCard.description")}
          </p>
        </div>
      </div>
    </section>
  );
}