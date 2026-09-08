type SettingsSectionProps = {
  isFrench: boolean;
};

export default function SettingsSection({
  isFrench,
}: SettingsSectionProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
        {isFrench ? "Paramètres" : "Settings"}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {isFrench
          ? "Paramètres du compte"
          : "Account settings"}
      </h2>

      <p className="mt-3 text-slate-600">
        {isFrench
          ? "L’URL publique, la langue et les options du compte seront ajoutées ici."
          : "Public URL, language, and account options will be added here."}
      </p>
    </div>
  );
}