"use client";

import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import {
  useParams,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  FormEvent,
  ReactNode,
  Suspense,
  useMemo,
  useState,
} from "react";

import { createClient } from "@/lib/supabase/client";

type SignupFormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupFormErrors = Partial<
  Record<keyof SignupFormData, string>
>;

type SelectedPlan = "free" | "standard";

function SignupContent() {
  const params = useParams<{ locale: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const locale = params.locale ?? "en";
  const isFrench = locale === "fr";

  const requestedPlan = searchParams.get("plan");

  const selectedPlan: SelectedPlan =
    requestedPlan === "standard"
      ? "standard"
      : "free";

  const [formData, setFormData] =
    useState<SignupFormData>({
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

  const [errors, setErrors] =
    useState<SignupFormErrors>({});

  const [submitError, setSubmitError] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isComplete, setIsComplete] =
    useState(false);

  const planName =
    selectedPlan === "standard"
      ? "Standard"
      : isFrench
        ? "Gratuit"
        : "Free";

  const planPrice =
    selectedPlan === "standard"
      ? isFrench
        ? "1 999 FDJ / mois"
        : "1,999 FDJ / month"
      : isFrench
        ? "0 FDJ — Gratuit"
        : "0 FDJ — Free";

  const planDescription =
    selectedPlan === "standard"
      ? isFrench
        ? "Pour les professionnels qui souhaitent une identité numérique complète et moderne."
        : "For professionals who want a complete and modern digital identity."
      : isFrench
        ? "Pour découvrir LinkCard avec un profil numérique simple."
        : "For discovering LinkCard with a simple digital profile.";

  const planFeatures =
    selectedPlan === "standard"
      ? isFrench
        ? [
            "Toutes les fonctionnalités de la formule Gratuite",
            "Bouton WhatsApp",
            "Bouton e-mail",
            "QR Code personnel",
            "Image de couverture",
            "Section À propos de moi",
            "Compétences et domaines d’expertise",
            "Thème personnalisable",
            "Enregistrement du contact",
          ]
        : [
            "Everything included in Free",
            "WhatsApp button",
            "Email button",
            "Personal QR code",
            "Cover image",
            "About Me section",
            "Skills and areas of expertise",
            "Customizable theme",
            "Save Contact button",
          ]
      : isFrench
        ? [
            "1 profil numérique LinkCard",
            "Photo de profil",
            "Nom et profession",
            "1 numéro de téléphone",
            "1 lien vers un réseau social",
            "Marque LinkCard affichée",
          ]
        : [
            "1 LinkCard digital profile",
            "Profile photo",
            "Name and profession",
            "1 phone number",
            "1 social media link",
            "LinkCard branding displayed",
          ];

  function updateField(
    field: keyof SignupFormData,
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
    const newErrors: SignupFormErrors = {};

    if (formData.fullName.trim().length < 2) {
      newErrors.fullName = isFrench
        ? "Veuillez saisir votre nom complet."
        : "Please enter your full name.";
    }

    const validEmail =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim(),
      );

    if (!validEmail) {
      newErrors.email = isFrench
        ? "Veuillez saisir une adresse e-mail valide."
        : "Please enter a valid email address.";
    }

    if (formData.password.length < 8) {
      newErrors.password = isFrench
        ? "Le mot de passe doit contenir au moins 8 caractères."
        : "The password must contain at least 8 characters.";
    }

    if (
      formData.confirmPassword !==
      formData.password
    ) {
      newErrors.confirmPassword = isFrench
        ? "Les mots de passe ne correspondent pas."
        : "The passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
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

    try {
      const nameParts = formData.fullName
        .trim()
        .split(/\s+/);

      const firstName = nameParts[0] ?? "";
      const lastName = nameParts
        .slice(1)
        .join(" ");

     const { data, error } =
  await supabase.auth.signUp({
    email: formData.email.trim(),
    password: formData.password,
    options: {
      data: {
        full_name: formData.fullName.trim(),
        first_name: firstName,
        last_name: lastName,
        plan: selectedPlan,
      },
    },
  });

      if (error) {
        setSubmitError(
          translateSupabaseError(error.message),
        );
        return;
      }

      if (data.session) {
        router.push(`/${locale}/dashboard`);
        router.refresh();
        return;
      }

      setIsComplete(true);
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

  function translateSupabaseError(
    message: string,
  ) {
    if (!isFrench) {
      return message;
    }

    const normalizedMessage =
      message.toLowerCase();

    if (
      normalizedMessage.includes(
        "user already registered",
      )
    ) {
      return "Un compte existe déjà avec cette adresse e-mail.";
    }

    if (
      normalizedMessage.includes(
        "password should be at least",
      )
    ) {
      return "Le mot de passe doit contenir au moins 8 caractères.";
    }

    if (
      normalizedMessage.includes(
        "invalid email",
      )
    ) {
      return "L’adresse e-mail saisie n’est pas valide.";
    }

    if (
      normalizedMessage.includes(
        "email rate limit",
      )
    ) {
      return "Trop de demandes ont été envoyées. Veuillez attendre quelques minutes.";
    }

    return message;
  }

  if (isComplete) {
    return (
      <main className="min-h-screen bg-[#070711] px-5 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-400/30">
            <Check
              size={30}
              strokeWidth={3}
            />
          </div>

          <h1 className="mt-6 text-3xl font-black">
            {isFrench
              ? "Vérifiez votre e-mail"
              : "Check your email"}
          </h1>

          <p className="mt-4 leading-7 text-slate-300">
            {isFrench
              ? `Un lien de confirmation a été envoyé à ${formData.email}. Cliquez sur ce lien pour activer votre compte LinkCard.`
              : `A confirmation link was sent to ${formData.email}. Click the link to activate your LinkCard account.`}
          </p>

          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
            <p className="text-sm text-slate-300">
              {isFrench
                ? "Formule sélectionnée :"
                : "Selected plan:"}

              <span className="ml-2 font-black text-violet-300">
                {planName}
              </span>
            </p>
          </div>

          <Link
            href={`/${locale}/login`}
            className="mt-8 inline-flex items-center justify-center rounded-2xl bg-white px-6 py-4 text-sm font-black text-violet-700 transition hover:-translate-y-0.5 hover:bg-violet-50"
          >
            {isFrench
              ? "Aller à la connexion"
              : "Go to sign in"}
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

          {isFrench
            ? "Retour aux tarifs"
            : "Back to pricing"}
        </Link>

        <div className="mt-8 grid overflow-hidden rounded-[36px] border border-white/10 bg-white shadow-2xl lg:grid-cols-[0.85fr_1.15fr]">
          <aside className="bg-gradient-to-br from-violet-700 via-purple-800 to-indigo-950 p-8 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-200">
              {isFrench
                ? "Formule sélectionnée"
                : "Selected plan"}
            </p>

            <h1 className="mt-4 text-4xl font-black">
              {planName}
            </h1>

            <p className="mt-3 text-xl font-bold text-violet-100">
              {planPrice}
            </p>

            <p className="mt-6 text-sm leading-7 text-violet-100/80">
              {planDescription}
            </p>

            <div className="my-8 border-t border-white/15" />

            <ul className="space-y-4">
              {planFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-violet-50"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <Check
                      size={12}
                      strokeWidth={3}
                    />
                  </span>

                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </aside>

          <section className="bg-white p-8 text-slate-950 sm:p-10">
            <p className="text-sm font-black uppercase tracking-[0.18em] text-violet-600">
              LinkCard
            </p>

            <h2 className="mt-3 text-3xl font-black">
              {isFrench
                ? "Créez votre compte"
                : "Create your account"}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              {isFrench
                ? "Renseignez vos informations pour commencer à créer votre profil numérique."
                : "Enter your information to start building your digital profile."}
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
              noValidate
            >
              <FormField
                label={
                  isFrench
                    ? "Nom complet"
                    : "Full name"
                }
                error={errors.fullName}
              >
                <div className="relative">
                  <UserRound
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(event) =>
                      updateField(
                        "fullName",
                        event.target.value,
                      )
                    }
                    placeholder={
                      isFrench
                        ? "Mohamed Houmed Mohamed"
                        : "Your full name"
                    }
                    autoComplete="name"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </FormField>

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
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
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
                        ? "8 caractères minimum"
                        : "Minimum 8 characters"
                    }
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-12 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current,
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-violet-600"
                    aria-label={
                      showPassword
                        ? "Hide password"
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

              <FormField
                label={
                  isFrench
                    ? "Confirmer le mot de passe"
                    : "Confirm password"
                }
                error={errors.confirmPassword}
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
                    value={
                      formData.confirmPassword
                    }
                    onChange={(event) =>
                      updateField(
                        "confirmPassword",
                        event.target.value,
                      )
                    }
                    placeholder={
                      isFrench
                        ? "Saisissez de nouveau le mot de passe"
                        : "Enter your password again"
                    }
                    autoComplete="new-password"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
                  />
                </div>
              </FormField>

              <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
                <p className="text-sm text-slate-700">
                  {isFrench
                    ? "Formule choisie :"
                    : "Selected plan:"}

                  <span className="ml-2 font-black text-violet-700">
                    {planName}
                  </span>
                </p>
              </div>

              {submitError && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-700">
                    {submitError}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-6 py-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? isFrench
                    ? "Création en cours..."
                    : "Creating account..."
                  : isFrench
                    ? "Créer mon compte LinkCard"
                    : "Create my LinkCard account"}
              </button>

              <p className="text-center text-sm text-slate-500">
                {isFrench
                  ? "Vous avez déjà un compte ?"
                  : "Already have an account?"}{" "}

                <Link
                  href={`/${locale}/login`}
                  className="font-bold text-violet-700 hover:underline"
                >
                  {isFrench
                    ? "Se connecter"
                    : "Sign in"}
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
export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#070711] text-white">
          <p className="text-sm text-slate-400">
            Loading...
          </p>
        </main>
      }
    >
      <SignupContent />
    </Suspense>
  );
}