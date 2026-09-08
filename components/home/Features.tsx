import {
  BarChart3,
  Bot,
  FileText,
  ImageIcon,
  Link2,
  Palette,
  Phone,
  QrCode,
  Share2,
  ShieldCheck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";

export default async function Features() {
  const t = await getTranslations("features");

const features = [
  {
    icon: Phone,
    title: t("items.contact.title"),
    description: t("items.contact.description"),
  },
  {
    icon: QrCode,
    title: t("items.qrCode.title"),
    description: t("items.qrCode.description"),
  },
  {
    icon: Share2,
    title: t("items.sharing.title"),
    description: t("items.sharing.description"),
  },
  {
    icon: Link2,
    title: t("items.smartLink.title"),
    description: t("items.smartLink.description"),
  },
  {
    icon: ShieldCheck,
    title: t("items.security.title"),
    description: t("items.security.description"),
  },
];

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-slate-50 py-24 sm:py-28"
    >
      <div className="absolute left-1/2 top-0 h-72 w-[700px] -translate-x-1/2 rounded-full bg-violet-100/70 blur-3xl" />

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

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <article
                key={feature.title}
                className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-2 hover:border-violet-200 hover:shadow-[0_22px_50px_rgba(76,29,149,0.12)]"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-700 transition duration-300 group-hover:scale-105 group-hover:bg-violet-600 group-hover:text-white">
                  <Icon size={26} strokeWidth={2} />
                </div>

                <h3 className="mt-5 text-lg font-extrabold leading-6 text-slate-950">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {feature.description}
                </p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}