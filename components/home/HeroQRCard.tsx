import { Radio } from "lucide-react";
import { getTranslations } from "next-intl/server";

const qrPattern = [
  1, 1, 1, 0, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 1, 1, 1, 0, 1,
  1, 1, 1, 0, 0, 1, 1, 1, 1,
  0, 0, 1, 1, 1, 0, 0, 1, 0,
  1, 1, 0, 1, 0, 1, 1, 0, 1,
  0, 1, 1, 0, 1, 1, 0, 1, 0,
  1, 1, 1, 1, 0, 0, 1, 1, 1,
  1, 0, 1, 0, 1, 1, 1, 0, 1,
  1, 1, 1, 0, 1, 0, 1, 1, 1,
];

export default async function HeroQRCard() {
  const t = await getTranslations("heroQRCard");

  return (
    <div className="relative mx-auto w-full max-w-[250px] rounded-[30px] border border-white/20 bg-white/[0.07] p-6 text-center shadow-[0_30px_70px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 rounded-[30px] bg-violet-500/10 blur-xl" />

      <p className="text-sm font-bold leading-5 text-white">
        {t("scan")}
        <br />
        {t("connect")}
      </p>

      <div className="mx-auto mt-5 w-fit rounded-2xl bg-white p-3 shadow-xl">
        <div className="relative grid h-32 w-32 grid-cols-9 gap-[2px] bg-white">
          {qrPattern.map((cell, index) => (
            <span
              key={index}
              className={cell ? "bg-slate-950" : "bg-white"}
            />
          ))}

          <div className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border-4 border-white bg-violet-600">
            <svg
              viewBox="0 0 24 24"
              className="h-6 w-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10 13a5 5 0 0 0 7.07.07l2-2A5 5 0 0 0 12 4l-1.15 1.15" />
              <path d="M14 11a5 5 0 0 0-7.07-.07l-2 2A5 5 0 0 0 12 20l1.15-1.15" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-center gap-2 text-sm font-semibold text-slate-200">
        <Radio size={18} className="text-violet-400" />
        {t("nfc")}
      </div>
    </div>
  );
}