"use client";

import {
  ArrowLeft,
  BriefcaseBusiness,
  Check,
  Mail,
  MessageSquareText,
  Phone,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";

type QuoteFormData = {
  fullName: string;
  company: string;
  email: string;
  phone: string;
  message: string;
};

export default function PremiumContactPage() {
  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "en";
  const isFrench = locale === "fr";

  const [formData, setFormData] = useState<QuoteFormData>({
    fullName: "",
    company: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  function updateField(
    field: keyof QuoteFormData,
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    setIsSubmitting(true);

    // Temporary simulation until email/database integration.
    await new Promise((resolve) => setTimeout(resolve, 700));

    setIsSubmitting(false);
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-[#070711] px-5 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30">
            <Check size={30} strokeWidth={3} />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            {isFrench
              ? "Demande envoyée"
              : "Request submitted"}
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            {isFrench
              ? "Votre demande Premium a bien été enregistrée. L’équipe LinkCard vous contactera afin de préparer une offre personnalisée."
              : "Your Premium request has been recorded. The LinkCard team will contact you to prepare a personalized offer."}
          </p>

          <Link
            href={`/${locale}`}
            className="mt-8 inline-flex rounded-2xl bg-white px-6 py-4 text-sm font-black text-violet-700"
          >
            {isFrench
              ? "Retour à l’accueil"
              : "Back to homepage"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070711] px-5 py-10 text-white sm:py-16">
      <div className="mx-auto max-w-6xl">
        <Link
          href={`/${locale}#pricing`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />
          {isFrench ? "Retour aux tarifs" : "Back to pricing"}
        </Link>

        <div className="mt-8 grid overflow-hidden rounded-[36px] border border-white/10 bg-white shadow-2xl lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-950 p-8 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-200">
              LinkCard Premium
            </p>

            <h1 className="mt-4 text-4xl font-black">
              {isFrench
                ? "Tarif personnalisé"
                : "Custom pricing"}
            </h1>

            <p className="mt-5 text-sm leading-7 text-violet-100/80">
              {isFrench
                ? "Recevez une solution adaptée à votre profil, votre design et votre carte NFC physique."
                : "Receive an offer adapted to your profile, design, and physical NFC card."}
            </p>

            <div className="my-8 border-t border-white/15" />

            <ul className="space-y-4 text-sm text-violet-50">
              {[
                isFrench
                  ? "Toutes les fonctionnalités Standard"
                  : "Everything included in Standard",
                isFrench
                  ? "Carte NFC physique Premium incluse"
                  : "Premium physical NFC card included",
                isFrench
                  ? "Design de profil premium"
                  : "Premium profile design",
                isFrench
                  ? "Suppression de la marque LinkCard"
                  : "Remove LinkCard branding",
                isFrench
                  ? "Configuration personnalisée"
                  : "Personalized setup",
                isFrench
                  ? "Assistance prioritaire"
                  : "Priority support",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Check size={12} strokeWidth={3} />
                  </span>
                  {feature}
                </li>
              ))}
            </ul>
          </aside>

          <section className="bg-white p-8 text-slate-950 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">
              {isFrench
                ? "Demande de devis"
                : "Quote request"}
            </p>

            <h2 className="mt-3 text-3xl font-black">
              {isFrench
                ? "Parlez-nous de vos besoins"
                : "Tell us about your needs"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isFrench
                ? "Remplissez ce formulaire afin que nous puissions préparer une offre Premium personnalisée."
                : "Complete this form so we can prepare a personalized Premium offer."}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              <Field
                icon={<UserRound size={19} />}
                type="text"
                placeholder={
                  isFrench ? "Nom complet" : "Full name"
                }
                value={formData.fullName}
                onChange={(value) =>
                  updateField("fullName", value)
                }
                required
              />

              <Field
                icon={<BriefcaseBusiness size={19} />}
                type="text"
                placeholder={
                  isFrench
                    ? "Entreprise ou organisation"
                    : "Company or organization"
                }
                value={formData.company}
                onChange={(value) =>
                  updateField("company", value)
                }
              />

              <Field
                icon={<Mail size={19} />}
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(value) =>
                  updateField("email", value)
                }
                required
              />

              <Field
                icon={<Phone size={19} />}
                type="tel"
                placeholder={
                  isFrench
                    ? "Numéro de téléphone"
                    : "Phone number"
                }
                value={formData.phone}
                onChange={(value) =>
                  updateField("phone", value)
                }
                required
              />

              <div className="relative">
                <MessageSquareText
                  size={19}
                  className="absolute left-4 top-4 text-slate-400"
                />

                <textarea
                  value={formData.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder={
                    isFrench
                      ? "Décrivez brièvement vos besoins..."
                      : "Briefly describe your needs..."
                  }
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60"
              >
                {isSubmitting
                  ? isFrench
                    ? "Envoi en cours..."
                    : "Submitting..."
                  : isFrench
                    ? "Demander mon devis Premium"
                    : "Request my Premium quote"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

type FieldProps = {
  icon: React.ReactNode;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
};

function Field({
  icon,
  type,
  placeholder,
  value,
  onChange,
  required = false,
}: FieldProps) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
        {icon}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
      />
    </div>
  );
}