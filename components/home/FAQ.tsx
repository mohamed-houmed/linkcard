"use client";

import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export default function FAQ() {
  const t = useTranslations("faq");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      id: "whatIsLinkCard",
      question: t("items.whatIsLinkCard.question"),
      answer: t("items.whatIsLinkCard.answer"),
    },
    {
      id: "physicalCard",
      question: t("items.physicalCard.question"),
      answer: t("items.physicalCard.answer"),
    },
    {
      id: "updateInformation",
      question: t("items.updateInformation.question"),
      answer: t("items.updateInformation.answer"),
    },
    {
      id: "freePlan",
      question: t("items.freePlan.question"),
      answer: t("items.freePlan.answer"),
    },
    {
      id: "companyProfiles",
      question: t("items.companyProfiles.question"),
      answer: t("items.companyProfiles.answer"),
    },
    {
      id: "saveContact",
      question: t("items.saveContact.question"),
      answer: t("items.saveContact.answer"),
    },
  ];

  return (
    <section
      id="faq"
      className="scroll-mt-20 bg-[#050510] py-24 sm:py-28"
    >
      <div className="mx-auto max-w-4xl px-5">
        <div className="text-center">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-violet-400">
            {t("badge")}
          </p>

          <h2 className="mt-4 text-4xl font-black text-white sm:text-5xl">
            {t("title")}
          </h2>

          <p className="mt-5 text-lg text-slate-400">
            {t("description")}
          </p>
        </div>

        <div className="mt-16 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg font-bold text-white">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={22}
                    className={`shrink-0 text-slate-300 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-6 pb-6 leading-7 text-slate-300">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}