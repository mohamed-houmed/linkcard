"use client";

import { Menu, X } from "lucide-react";
import { MouseEvent, useState } from "react";
import { useTranslations } from "next-intl";

import LanguageSwitcher from "./LanguageSwitcher";
import { Link } from "@/i18n/navigation";

const navigationItems = [
  {
    key: "features",
    href: "#features",
  },
  {
    key: "howItWorks",
    href: "#how-it-works",
  },
  {
    key: "examples",
    href: "#examples",
  },
  {
    key: "pricing",
    href: "#pricing",
  },
  {
    key: "faq",
    href: "#faq",
  },
] as const;

export default function Navbar() {
  const t = useTranslations("navbar");
  console.log("Current locale translation:", t("features"));
  const [menuOpen, setMenuOpen] = useState(false);

  function scrollToSection(
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    event.preventDefault();

    const sectionId = href.replace("#", "");
    const section = document.getElementById(sectionId);

    if (!section) {
      console.warn(`Section with id="${sectionId}" was not found.`);
      setMenuOpen(false);
      return;
    }

    section.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", href);
    setMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050510]/85 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
        <Link
          href="/"
          className="group flex items-center gap-3"
          aria-label={t("homeAriaLabel")}
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 shadow-[0_0_30px_rgba(139,92,246,0.18)] transition group-hover:bg-violet-500/20">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 text-violet-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 0 7.07.07l2-2A5 5 0 0 0 12 4l-1.15 1.15" />
              <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15" />
            </svg>
          </div>

          <span className="text-2xl font-black tracking-tight text-white">
            Link<span className="text-violet-400">Card</span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(event) => scrollToSection(event, item.href)}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {t(item.key)}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />

          <Link
            href="/login"
            className="px-3 py-2 text-sm font-semibold text-slate-200 transition hover:text-white"
          >
            {t("login")}
          </Link>

          <Link
            href="/signup"
            className="rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-3 text-sm font-bold text-white shadow-[0_12px_35px_rgba(124,58,237,0.3)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(124,58,237,0.42)]"
          >
            {t("signup")}
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {menuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-white/10 bg-[#080817] px-5 pb-6 pt-4 lg:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(event) => scrollToSection(event, item.href)}
                className="rounded-xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/5 hover:text-white"
              >
                {t(item.key)}
              </a>
            ))}

            <div className="mt-3 border-t border-white/10 pt-5">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-medium text-slate-400">
                  {t("language")}
                </span>

                <LanguageSwitcher />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl border border-white/15 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/5"
                >
                  {t("login")}
                </Link>

                <Link
                  href="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-center text-sm font-bold text-white"
                >
                  {t("signup")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}