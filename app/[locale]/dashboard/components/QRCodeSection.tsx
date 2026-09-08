type QRCodeSectionProps = {
  isFrench: boolean;
};

export default function QRCodeSection({
  isFrench,
}: QRCodeSectionProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
        QR Code
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {isFrench
          ? "QR Code de votre profil"
          : "Your profile QR code"}
      </h2>

      <p className="mt-3 text-slate-600">
        {isFrench
          ? "Le générateur et le téléchargement seront ajoutés ici."
          : "The generator and download options will be added here."}
      </p>
    </div>
  );
}