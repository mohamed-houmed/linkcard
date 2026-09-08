"use client";

import { Globe, ChevronDown } from "lucide-react";
import { useLocale } from "next-intl";
import { useState, useTransition } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (newLocale: "en" | "fr") => {
    setIsOpen(false);

    startTransition(() => {
      router.replace(pathname, {
        locale: newLocale
      });
    });
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        disabled={isPending}
        aria-label="Change language"
        aria-expanded={isOpen}
        className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
      >
        <Globe className="h-4 w-4" />

        <span>{locale === "fr" ? "FR" : "EN"}</span>

        <ChevronDown
          className={`h-4 w-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-xl">
          <button
            type="button"
            onClick={() => changeLanguage("en")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
              locale === "en"
                ? "bg-slate-100 font-semibold text-slate-950"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span aria-hidden="true">🇬🇧</span>
            <span>English</span>
          </button>

          <button
            type="button"
            onClick={() => changeLanguage("fr")}
            className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition ${
              locale === "fr"
                ? "bg-slate-100 font-semibold text-slate-950"
                : "text-slate-700 hover:bg-slate-50"
            }`}
          >
            <span aria-hidden="true">🇫🇷</span>
            <span>Français</span>
          </button>
        </div>
      )}
    </div>
  );
}