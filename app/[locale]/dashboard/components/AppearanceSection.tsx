type AppearanceSectionProps = {
  isFrench: boolean;
};

export default function AppearanceSection({
  isFrench,
}: AppearanceSectionProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
        {isFrench ? "Apparence" : "Appearance"}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {isFrench
          ? "Personnalisez votre profil"
          : "Customize your profile"}
      </h2>

      <p className="mt-3 text-slate-600">
        {isFrench
          ? "Les couleurs et thèmes seront ajoutés ici."
          : "Colors and themes will be added here."}
      </p>
    </div>
  );
}