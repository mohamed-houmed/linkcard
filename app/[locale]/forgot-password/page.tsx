"use client";

import {
  ArrowLeft,
  Check,
  KeyRound,
  Mail,
  Send,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function ForgotPasswordPage() {
  const params = useParams<{ locale: string }>();

  const locale = params.locale ?? "en";
  const isFrench = locale === "fr";

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [isComplete, setIsComplete] =
    useState(false);

  function validateEmail() {
    const isValid =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!isValid) {
      setError(
        isFrench
          ? "Veuillez saisir une adresse e-mail valide."
          : "Please enter a valid email address.",
      );

      return false;
    }

    setError("");
    return true;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setIsSubmitting(true);

    // Simulation temporaire avant Supabase.
    await new Promise((resolve) =>
      setTimeout(resolve, 700),
    );

    setIsSubmitting(false);
    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-[#070711] px-5 py-16 text-white">
        <div className="mx-auto max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30">
            <Check size={30} strokeWidth={3} />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            {isFrench
              ? "Vérifiez votre e-mail"
              : "Check your email"}
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            {isFrench
              ? "Si un compte existe avec cette adresse e-mail, un lien de réinitialisation du mot de passe vous sera envoyé."
              : "If an account exists with this email address, a password reset link will be sent to you."}
          </p>

          <p className="mt-3 text-sm font-semibold text-violet-300">
            {email}
          </p>

          <Link
            href={`/${locale}/login`}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-50"
          >
            {isFrench
              ? "Retour à la connexion"
              : "Back to sign in"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070711] px-5 py-10 text-white sm:py-16">
      <div className="mx-auto w-full max-w-lg">
        <Link
          href={`/${locale}/login`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />

          {isFrench
            ? "Retour à la connexion"
            : "Back to sign in"}
        </Link>

        <div className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-white shadow-2xl">
          <div className="bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-950 px-8 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
              <KeyRound size={27} />
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-violet-200">
              LinkCard
            </p>

            <h1 className="mt-3 text-4xl font-black">
              {isFrench
                ? "Mot de passe oublié"
                : "Forgot your password"}
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-violet-100/80">
              {isFrench
                ? "Saisissez votre adresse e-mail afin de recevoir un lien de réinitialisation."
                : "Enter your email address to receive a password reset link."}
            </p>
          </div>

          <section className="bg-white p-8 text-slate-950 sm:p-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  E-mail
                </label>

                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);

                      if (error) {
                        setError("");
                      }
                    }}
                    placeholder="name@example.com"
                    autoComplete="email"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>

                {error && (
                  <p className="mt-2 text-sm font-medium text-red-600">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />

                {isSubmitting
                  ? isFrench
                    ? "Envoi en cours..."
                    : "Sending..."
                  : isFrench
                    ? "Envoyer le lien"
                    : "Send reset link"}
              </button>
            </form>

            <div className="mt-7 rounded-2xl border border-violet-100 bg-violet-50 p-4">
              <p className="text-sm leading-6 text-slate-600">
                {isFrench
                  ? "Pour votre sécurité, nous n’indiquerons pas si une adresse e-mail est enregistrée dans LinkCard."
                  : "For your security, we will not confirm whether an email address is registered with LinkCard."}
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}