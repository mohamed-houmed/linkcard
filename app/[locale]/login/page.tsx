"use client";

import { createClient } from "@/lib/supabase/client";
import {
  ArrowLeft,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
} from "lucide-react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  FormEvent,
  ReactNode,
  useMemo,
  useState,
} from "react";

type LoginFormData = {
  email: string;
  password: string;
};

type LoginErrors = Partial<
  Record<keyof LoginFormData, string>
>;

export default function LoginPage() {
  const params = useParams<{ locale: string }>();
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const locale = params.locale ?? "en";
  const isFrench = locale === "fr";
  const [emailNotConfirmed, setEmailNotConfirmed] = useState(false);

  const [formData, setFormData] =
    useState<LoginFormData>({
      email: "",
      password: "",
    });

  const [errors, setErrors] =
    useState<LoginErrors>({});

  const [submitError, setSubmitError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  function updateField(
    field: keyof LoginFormData,
    value: string,
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((current) => ({
        ...current,
        [field]: undefined,
      }));
    }

    if (submitError) {
      setSubmitError("");
    }
  }

  function validateForm() {
    const newErrors: LoginErrors = {};

    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim(),
      );

    if (!validEmail) {
      newErrors.email = isFrench
        ? "Veuillez saisir une adresse e-mail valide."
        : "Please enter a valid email address.";
    }

    if (!formData.password) {
      newErrors.password = isFrench
        ? "Veuillez saisir votre mot de passe."
        : "Please enter your password.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function resendConfirmationEmail() {
  const email = formData.email.trim();

  if (!email) {
    setSubmitError(
      isFrench
        ? "Veuillez saisir votre adresse e-mail."
        : "Please enter your email address."
    );
    return;
  }

  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
  });

  if (error) {
    setSubmitError(error.message);
    return;
  }

  setSubmitError(
    isFrench
      ? "Un nouvel e-mail de confirmation a été envoyé. Vérifiez votre boîte de réception."
      : "A new confirmation email has been sent. Please check your inbox."
  );
}
  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");
    setEmailNotConfirmed(false);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: formData.email.trim(),
          password: formData.password,
        });

      if (error) {
        const message =
          error.message.toLowerCase();

        if (
          message.includes(
            "invalid login credentials",
          )
        ) {
          setSubmitError(
            isFrench
              ? "Adresse e-mail ou mot de passe incorrect."
              : "Incorrect email or password.",
          );
        } else if (
          message.includes("email not confirmed")
        ) {
          setEmailNotConfirmed(true);
          setSubmitError(
            isFrench
              ? "Veuillez confirmer votre adresse e-mail avant de vous connecter."
              : "Please confirm your email address before signing in.",
          );
        } else if (
          message.includes("too many requests") ||
          message.includes("rate limit")
        ) {
          setSubmitError(
            isFrench
              ? "Trop de tentatives. Veuillez patienter quelques minutes."
              : "Too many attempts. Please wait a few minutes.",
          );
        } else {
          setSubmitError(
            isFrench
              ? "La connexion a échoué. Veuillez vérifier vos informations."
              : "Sign-in failed. Please check your information.",
          );
        }

        return;
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    } catch {
      setSubmitError(
        isFrench
          ? "Une erreur inattendue s’est produite. Veuillez réessayer."
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#070711] px-5 py-10 text-white sm:py-16">
      <div className="mx-auto w-full max-w-lg">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={18} />

          {isFrench
            ? "Retour à l’accueil"
            : "Back to homepage"}
        </Link>

        <div className="mt-8 overflow-hidden rounded-[36px] border border-white/10 bg-white shadow-2xl">
          <div className="bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-950 px-8 py-10 text-center sm:px-10">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
              <LogIn size={27} />
            </div>

            <p className="mt-6 text-sm font-black uppercase tracking-[0.18em] text-violet-200">
              LinkCard
            </p>

            <h1 className="mt-3 text-4xl font-black">
              {isFrench
                ? "Bon retour"
                : "Welcome back"}
            </h1>

            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-violet-100/80">
              {isFrench
                ? "Connectez-vous pour gérer votre profil numérique LinkCard."
                : "Sign in to manage your LinkCard digital profile."}
            </p>
          </div>

          <section className="bg-white p-8 text-slate-950 sm:p-10">
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
              noValidate
            >
              <FormField
                label="E-mail"
                error={errors.email}
              >
                <div className="relative">
                  <Mail
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(event) =>
                      updateField(
                        "email",
                        event.target.value,
                      )
                    }
                    placeholder="name@example.com"
                    autoComplete="email"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>
              </FormField>

              <FormField
                label={
                  isFrench
                    ? "Mot de passe"
                    : "Password"
                }
                error={errors.password}
              >
                <div className="relative">
                  <LockKeyhole
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={(event) =>
                      updateField(
                        "password",
                        event.target.value,
                      )
                    }
                    placeholder={
                      isFrench
                        ? "Votre mot de passe"
                        : "Your password"
                    }
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-12 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                    disabled={isSubmitting}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={
                      showPassword
                        ? isFrench
                          ? "Masquer le mot de passe"
                          : "Hide password"
                        : isFrench
                          ? "Afficher le mot de passe"
                          : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </FormField>

              <div className="flex justify-end">
                <Link
                  href={`/${locale}/forgot-password`}
                  className="text-sm font-bold text-violet-700 transition hover:underline"
                >
                  {isFrench
                    ? "Mot de passe oublié ?"
                    : "Forgot password?"}
                </Link>
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="rounded-2xl border border-red-200 bg-red-50 p-4"
                >
                  <p className="text-sm font-medium leading-6 text-red-700">
                    {submitError}
                  </p>
                  {emailNotConfirmed && (
                  <button
                   type="button"
                   onClick={resendConfirmationEmail}
                  className="mt-3 text-sm font-bold text-violet-700 hover:underline"
                 >
                 {isFrench
                ? "Renvoyer l’e-mail de confirmation"
                : "Resend confirmation email"}
               </button>
              )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogIn size={18} />

                {isSubmitting
                  ? isFrench
                    ? "Connexion en cours..."
                    : "Signing in..."
                  : isFrench
                    ? "Se connecter"
                    : "Sign in"}
              </button>

              <p className="text-center text-sm text-slate-500">
                {isFrench
                  ? "Vous n’avez pas encore de compte ?"
                  : "Don't have an account yet?"}{" "}

                <Link
                  href={`/${locale}/signup?plan=free`}
                  className="font-bold text-violet-700 hover:underline"
                >
                  {isFrench
                    ? "Créer un compte"
                    : "Create an account"}
                </Link>
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

function FormField({
  label,
  error,
  children,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      {children}

      {error && (
        <p className="mt-2 text-sm font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}