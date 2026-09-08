import {
  Mail,
  MapPin,
  Phone,
  UserRoundPlus,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

const socialNetworks = [
  {
    name: "in",
    className: "bg-[#0a66c2]",
  },
  {
    name: "◎",
    className:
      "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
  },
  {
    name: "f",
    className: "bg-[#1877f2]",
  },
  {
    name: "𝕏",
    className: "bg-black",
  },
  {
    name: "▶",
    className: "bg-red-600",
  },
];

export default async function HeroPhone() {
  const t = await getTranslations("heroPhone");

  return (
    <div className="relative mx-auto w-[300px] sm:w-[330px] lg:w-[350px]">
      <div className="absolute -inset-10 rounded-full bg-violet-600/25 blur-3xl" />

      <div className="relative rounded-[52px] border-[6px] border-[#252532] bg-[#0d0d14] p-2 shadow-[0_40px_100px_rgba(0,0,0,0.65)]">
        <div className="absolute left-1/2 top-3 z-20 h-7 w-24 -translate-x-1/2 rounded-full bg-black" />

        <div className="overflow-hidden rounded-[42px] bg-white">
          <div className="relative h-36 overflow-hidden bg-[radial-gradient(circle_at_top_left,_#9333ea_0%,_#312e81_45%,_#111827_100%)]">
            <div className="absolute -right-10 top-4 h-28 w-28 rounded-full border border-white/10" />
            <div className="absolute -right-5 top-9 h-20 w-20 rounded-full border border-white/10" />

            <div className="absolute bottom-3 left-5 text-white">
              <p className="text-xs font-medium text-white/70">
                {t("coverSubtitle")}
              </p>

              <p className="mt-1 text-lg font-bold">
                {t("coverTitle")}
              </p>
            </div>
          </div>

          <div className="relative px-5 pb-6">
            <div className="-mt-14 flex justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-[5px] border-white bg-gradient-to-br from-violet-500 to-indigo-700 shadow-xl">
                <span className="text-4xl font-black text-white">
                  MH
                </span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <div className="flex items-center justify-center gap-1.5">
                <h3 className="text-xl font-black text-slate-950">
                  Mohamed Houmed
                </h3>

                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[11px] font-bold text-white">
                  ✓
                </span>
              </div>

              <p className="mt-1 text-sm font-bold text-violet-600">
                {t("jobTitle")}
              </p>

              <p className="mt-1 text-xs font-medium text-slate-500">
                {t("professionalSubtitle")}
              </p>

              <div className="mt-2 flex items-center justify-center gap-1 text-xs text-slate-500">
                <MapPin size={13} />
                {t("location")}
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
              <PhoneAction
                icon={<Phone size={17} />}
                label={t("actions.call")}
              />

              <PhoneAction
                icon={<span className="text-base font-black">◉</span>}
                label="WhatsApp"
              />

              <PhoneAction
                icon={<Mail size={17} />}
                label={t("actions.email")}
              />

              <PhoneAction
                icon={<UserRoundPlus size={17} />}
                label={t("actions.save")}
              />
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-violet-500/20"
            >
              {t("profileButton")}
            </button>

            <div className="mt-5">
              <h4 className="text-xs font-black text-slate-900">
                {t("aboutTitle")}
              </h4>

              <p className="mt-2 text-[11px] leading-5 text-slate-600">
                {t("aboutDescription")}
              </p>
            </div>

            <div className="mt-5">
              <h4 className="text-xs font-black text-slate-900">
                {t("socialMediaTitle")}
              </h4>

              <div className="mt-3 flex items-center gap-3">
                {socialNetworks.map((network) => (
                  <span
                    key={network.name}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-black text-white ${network.className}`}
                  >
                    {network.name}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type PhoneActionProps = {
  icon: ReactNode;
  label: string;
};

function PhoneAction({ icon, label }: PhoneActionProps) {
  return (
    <div className="text-center">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-violet-50 text-violet-700">
        {icon}
      </div>

      <span className="mt-1 block text-[9px] font-semibold text-slate-500">
        {label}
      </span>
    </div>
  );
}