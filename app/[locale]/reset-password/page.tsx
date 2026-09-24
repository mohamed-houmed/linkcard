"use client";

import { Check, KeyRound } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const supabase = createClient();

  const params = useParams<{ locale: string }>();
  const locale = params.locale ?? "en";
  const isFrench = locale === "fr";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(
        isFrench
          ? "Le mot de passe doit contenir au moins 8 caractères."
          : "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        isFrench
          ? "Les mots de passe ne correspondent pas."
          : "Passwords do not match."
      );
      return;
    }

    setIsSubmitting(true);

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    });

    setIsSubmitting(false);

    if (updateError) {
      console.error("Password update error:", updateError);

      setError(
        isFrench
          ? "Impossible de modifier le mot de passe. Veuillez demander un nouveau lien."
          : "Unable to update the password. Please request a new reset link."
      );
      return;
    }

    setIsComplete(true);
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-[#070711] px-5 py-16 text-white">
        <div className="mx-auto max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-8 text-center sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
            <Check size={30} strokeWidth={3} />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            {isFrench
              ? "Mot de passe modifié"
              : "Password updated"}
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            {isFrench
              ? "Votre nouveau mot de passe est maintenant actif."
              : "Your new password is now active."}
          </p>

          <Link
            href={`/${locale}/login`}
            className="mt-8 inline-flex rounded-2xl bg-white px-6 py-4 font-bold text-violet-700"
          >
            {isFrench
              ? "Se connecter"
              : "Sign in"}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070711] px-5 py-16 text-white">
      <div className="mx-auto max-w-lg rounded-[32px] border border-white/10 bg-white/5 p-8 sm:p-10">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/20 text-violet-300">
          <KeyRound size={30} />
        </div>

        <div className="text-center">
          <h1 className="mt-6 text-3xl font-black">
            {isFrench
              ? "Créer un nouveau mot de passe"
              : "Create a new password"}
          </h1>

          <p className="mt-3 text-slate-300">
            {isFrench
              ? "Choisissez un nouveau mot de passe pour votre compte LinkCard."
              : "Choose a new password for your LinkCard account."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-bold">
              {isFrench
                ? "Nouveau mot de passe"
                : "New password"}
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              placeholder={
                isFrench
                  ? "Au moins 8 caractères"
                  : "At least 8 characters"
              }
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none transition focus:border-violet-400"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold">
              {isFrench
                ? "Confirmer le mot de passe"
                : "Confirm password"}
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(event) =>
                setConfirmPassword(event.target.value)
              }
              autoComplete="new-password"
              placeholder={
                isFrench
                  ? "Saisissez à nouveau le mot de passe"
                  : "Enter the password again"
              }
              className="w-full rounded-2xl border border-white/10 bg-white/10 px-4 py-4 outline-none transition focus:border-violet-400"
              required
            />
          </div>

          {error && (
            <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-4 font-bold text-white transition hover:opacity-90 disabled:opacity-60"
          >
            {isSubmitting
              ? isFrench
                ? "Modification..."
                : "Updating..."
              : isFrench
                ? "Modifier le mot de passe"
                : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}