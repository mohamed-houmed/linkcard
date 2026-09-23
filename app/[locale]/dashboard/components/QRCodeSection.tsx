"use client";

import {
  Check,
  Copy,
  Download,
  ExternalLink,
} from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useState } from "react";

type QRCodeSectionProps = {
  isFrench: boolean;
  userId: string;
  profileSlug: string;
  locale: string;
};

export default function QRCodeSection({
  isFrench,
  userId,
  profileSlug,
  locale,
}: QRCodeSectionProps) {
  const [profileUrl, setProfileUrl] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const url = profileSlug
  ? `https://www.getlinkcard.com/${locale}/${profileSlug}`
  : `https://www.getlinkcard.com/${locale}/p/${userId}`;

    setProfileUrl(url);

    QRCode.toDataURL(url, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: "M",
    })
      .then(setQrDataUrl)
      .catch(console.error);
}, [userId, profileSlug, locale]);

  async function copyLink() {
    if (!profileUrl) return;

    await navigator.clipboard.writeText(profileUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  function downloadQR() {
    if (!qrDataUrl) return;

    const link = document.createElement("a");

    link.href = qrDataUrl;
    link.download = "linkcard-qr.png";

    link.click();
  }

  if (!userId) {
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-slate-500">
          {isFrench
            ? "Chargement de votre QR Code..."
            : "Loading your QR code..."}
        </p>
      </div>
    );
  }

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
          ? "Partagez votre LinkCard avec votre lien ou votre QR Code."
          : "Share your LinkCard using your link or QR code."}
      </p>

      <div className="mt-8 flex flex-col gap-8 lg:flex-row lg:items-center">

        <div className="flex shrink-0 justify-center rounded-3xl border border-slate-200 bg-white p-5">
          {qrDataUrl ? (
            <img
              src={qrDataUrl}
              alt="LinkCard QR Code"
              className="h-56 w-56"
            />
          ) : (
            <div className="flex h-56 w-56 items-center justify-center text-sm text-slate-400">
              {isFrench
                ? "Génération..."
                : "Generating..."}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">

          <p className="text-sm font-bold text-slate-950">
            {isFrench
              ? "Lien public de votre profil"
              : "Your public profile link"}
          </p>

          <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="break-all text-sm text-slate-600">
              {profileUrl}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={copyLink}
              className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-violet-700"
            >
              {copied ? (
                <Check size={18} />
              ) : (
                <Copy size={18} />
              )}

              {copied
                ? isFrench
                  ? "Copié"
                  : "Copied"
                : isFrench
                  ? "Copier le lien"
                  : "Copy link"}
            </button>

            <button
              type="button"
              onClick={downloadQR}
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <Download size={18} />

              {isFrench
                ? "Télécharger QR"
                : "Download QR"}
            </button>

            <a
              href={profileUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
            >
              <ExternalLink size={18} />

              {isFrench
                ? "Voir le profil"
                : "View profile"}
            </a>

          </div>
        </div>
      </div>
    </div>
  );
}