import {
  BriefcaseBusiness,
  Settings,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import {
  getLocale,
  getTranslations,
} from "next-intl/server";


export default async function Examples() {
  const t = await getTranslations("examples");
  const locale = await getLocale();

  const examples = [
    {
      id: "ceo",
      icon: BriefcaseBusiness,
      title: t("items.ceo.title"),
      description: t("items.ceo.description"),
      href: `/${locale}/demo/ceo`,
    },
    {
      id: "manager",
      icon: UsersRound,
      title: t("items.manager.title"),
      description: t("items.manager.description"),
      href: `/${locale}/demo/manager`,
    },
    {
      id: "engineer",
      icon: Settings,
      title: t("items.engineer.title"),
      description: t("items.engineer.description"),
      href: `/${locale}/demo/engineer`,
    },
  ];

  return (
    <section
      id="examples"
      className="relative overflow-hidden bg-[#070711] py-24 sm:py-28"
    >
      <div className="absolute left-1/2 top-10 h-80 w-[760px] -translate-x-1/2 rounded-full bg-violet-700/20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">
            {t("badge")}
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            {t("description")}
          </p>
        </div>

        <div className="mx-auto mt-16 grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {examples.map((example) => {
            const Icon = example.icon;

            return (
              <article
                key={example.id}
                className="group flex h-full min-h-[330px] flex-col rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-violet-400/40 hover:bg-white/10"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-300 ring-1 ring-violet-400/20 transition duration-300 group-hover:bg-violet-500 group-hover:text-white">
                  <Icon size={27} strokeWidth={2} />
                </div>

                <h3 className="mt-6 text-xl font-black text-white">
                  {example.title}
                </h3>

                <p className="mt-3 flex-1 text-sm leading-6 text-slate-400">
                  {example.description}
                </p>

                <Link
                  href={example.href}
                  className="mt-6 inline-flex w-fit items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10 px-5 py-3 text-sm font-bold text-violet-200 transition hover:bg-violet-500 hover:text-white"
                >
                  {t("viewDemo")}
                </Link>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}