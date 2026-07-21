export default function Home() {
  return (
    <main className="min-h-screen bg-[#071A2B] text-white">
      {/* Barre de navigation */}
      <header className="border-b border-white/10">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-8">
          <a href="#" className="text-2xl font-bold tracking-tight">
            Link<span className="text-[#16C7D9]">Card</span>
          </a>

          <div className="hidden items-center gap-8 text-sm text-slate-300 md:flex">
            <a href="#features" className="transition hover:text-white">
              Fonctionnalités
            </a>

            <a href="#how-it-works" className="transition hover:text-white">
              Fonctionnement
            </a>

            <a href="#solutions" className="transition hover:text-white">
              Solutions
            </a>

            <a href="#contact" className="transition hover:text-white">
              Contact
            </a>
          </div>

          <a
            href="#contact"
            className="rounded-lg bg-[#16C7D9] px-5 py-2.5 text-sm font-semibold text-[#071A2B] transition hover:bg-[#5DDEE9]"
          >
            Commander une carte
          </a>
        </nav>
      </header>

      {/* Section principale */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-[#16C7D9]/15 blur-3xl" />

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-16 px-6 py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="mb-5 inline-flex rounded-full border border-[#16C7D9]/30 bg-[#16C7D9]/10 px-4 py-2 text-sm font-medium text-[#7BE7F0]">
              Cartes professionnelles NFC et QR Code
            </p>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Partagez votre identité professionnelle en un seul geste.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
              LinkCard permet aux professionnels, aux entreprises et aux
              institutions de partager instantanément leurs coordonnées grâce
              à une carte NFC et un QR code reliés à un profil numérique.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <a
                href="#contact"
                className="rounded-xl bg-[#16C7D9] px-7 py-4 text-center font-semibold text-[#071A2B] transition hover:bg-[#5DDEE9]"
              >
                Commander ma LinkCard
              </a>

              <a
                href="/p/demo"
                className="rounded-xl border border-white/20 px-7 py-4 text-center font-semibold transition hover:border-[#16C7D9] hover:bg-white/5"
              >
                Voir un profil démo
              </a>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-bold text-[#16C7D9]">NFC</p>
                <p className="mt-1 text-sm text-slate-400">
                  Partage par contact
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#16C7D9]">QR</p>
                <p className="mt-1 text-sm text-slate-400">
                  Scan universel
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-[#16C7D9]">24/7</p>
                <p className="mt-1 text-sm text-slate-400">
                  Profil accessible
                </p>
              </div>
            </div>
          </div>

          {/* Aperçu du profil numérique */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-[32px] border border-white/10 bg-white p-3 shadow-2xl shadow-black/40">
              <div className="overflow-hidden rounded-[25px] bg-slate-50 text-slate-900">
                <div className="h-32 bg-gradient-to-r from-[#071A2B] to-[#16C7D9]" />

                <div className="-mt-14 px-6 pb-8 text-center">
                  <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-[#E8FAFC] text-3xl font-bold text-[#071A2B]">
                    MH
                  </div>

                  <h2 className="mt-4 text-2xl font-bold">
                    Mohamed Houmed
                  </h2>

                  <p className="mt-1 font-medium text-[#078A98]">
                    Operations Engineer
                  </p>

                  <p className="text-sm text-slate-500">
                    Djibouti Telecom
                  </p>

                  <button className="mt-6 w-full rounded-xl bg-[#071A2B] px-5 py-3 font-semibold text-white">
                    Enregistrer le contact
                  </button>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium">
                      Appeler
                    </button>

                    <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium">
                      WhatsApp
                    </button>

                    <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium">
                      E-mail
                    </button>

                    <button className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium">
                      Site web
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-slate-400">
              Exemple de profil numérique LinkCard
            </p>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section
        id="features"
        className="border-t border-white/10 bg-white/[0.03] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="font-semibold text-[#16C7D9]">Fonctionnalités</p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Toutes vos informations professionnelles au même endroit.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="Profil professionnel"
              description="Présentez votre nom, fonction, entreprise, photo et description professionnelle."
            />

            <FeatureCard
              title="WhatsApp et téléphone"
              description="Permettez à vos contacts de vous appeler ou de vous écrire instantanément."
            />

            <FeatureCard
              title="Enregistrer le contact"
              description="Les visiteurs peuvent enregistrer vos coordonnées directement dans leur téléphone."
            />

            <FeatureCard
              title="Sites et réseaux sociaux"
              description="Ajoutez votre site web, LinkedIn, Facebook, Instagram et autres liens."
            />

            <FeatureCard
              title="Modification sans réimpression"
              description="Mettez à jour vos informations sans remplacer votre carte physique."
            />

            <FeatureCard
              title="Gestion pour entreprises"
              description="Créez et gérez les profils numériques de plusieurs collaborateurs."
            />
          </div>
        </div>
      </section>

      {/* Fonctionnement */}
      <section id="how-it-works" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold text-[#16C7D9]">Fonctionnement</p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Simple, rapide et professionnel
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            <StepCard
              number="01"
              title="Création du profil"
              description="Nous créons votre profil numérique avec toutes vos informations professionnelles."
            />

            <StepCard
              number="02"
              title="Impression de la carte"
              description="Votre QR code est imprimé et votre lien est enregistré dans la puce NFC."
            />

            <StepCard
              number="03"
              title="Partage instantané"
              description="Un contact scanne ou approche son téléphone pour accéder à votre profil."
            />
          </div>
        </div>
      </section>

      {/* Marchés ciblés */}
      <section
        id="solutions"
        className="border-y border-white/10 bg-white/[0.03] px-6 py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="font-semibold text-[#16C7D9]">Nos solutions</p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Une solution adaptée à chaque organisation
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <MarketCard
              title="Professionnels"
              description="Consultants, ingénieurs, entrepreneurs, commerciaux et indépendants."
            />

            <MarketCard
              title="Entreprises"
              description="Cartes pour collaborateurs, équipes commerciales, dirigeants et visiteurs."
            />

            <MarketCard
              title="Institutions publiques"
              description="Badges et profils professionnels pour administrations et organismes publics."
            />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 py-24">
        <div className="mx-auto max-w-4xl rounded-3xl bg-[#16C7D9] px-8 py-14 text-center text-[#071A2B]">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Prêt à créer votre LinkCard ?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg">
            Demandez votre carte NFC et QR Code accompagnée de votre profil
            numérique professionnel.
          </p>

          <a
            href="https://wa.me/25377000000"
            className="mt-8 inline-block rounded-xl bg-[#071A2B] px-8 py-4 font-semibold text-white transition hover:bg-[#102E45]"
          >
            Nous contacter sur WhatsApp
          </a>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-sm text-slate-400 sm:flex-row">
          <p>
            © {new Date().getFullYear()} LinkCard. Tous droits réservés.
          </p>

          <p>Cartes professionnelles NFC et QR Code</p>
        </div>
      </footer>
    </main>
  );
}

type CardProps = {
  title: string;
  description: string;
};

function FeatureCard({ title, description }: CardProps) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/5 p-7">
      <div className="mb-5 h-11 w-11 rounded-xl bg-[#16C7D9]/20" />

      <h3 className="text-xl font-semibold">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </article>
  );
}

type StepCardProps = CardProps & {
  number: string;
};

function StepCard({ number, title, description }: StepCardProps) {
  return (
    <article className="rounded-2xl border border-white/10 p-7">
      <p className="text-4xl font-bold text-[#16C7D9]">{number}</p>

      <h3 className="mt-5 text-xl font-semibold">{title}</h3>

      <p className="mt-3 leading-7 text-slate-400">{description}</p>
    </article>
  );
}

function MarketCard({ title, description }: CardProps) {
  return (
    <article className="rounded-2xl bg-white p-8 text-[#071A2B]">
      <h3 className="text-2xl font-bold">{title}</h3>

      <p className="mt-4 leading-7 text-slate-600">{description}</p>
    </article>
  );
}