import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

import type { IconType } from "react-icons";
import type { Social } from "@/types/social";

type SocialLinksProps = {
  socials: Social[];
};

type SupportedSocialType =
  | "linkedin"
  | "instagram"
  | "x"
  | "facebook"
  | "youtube";

type SocialConfig = {
  label: string;
  icon: IconType;
  iconClassName: string;
  buttonClassName: string;
};

const socialConfig: Record<
  SupportedSocialType,
  SocialConfig
> = {
  linkedin: {
    label: "LinkedIn",
    icon: FaLinkedinIn,
    iconClassName: "text-white",
    buttonClassName: "bg-[#0A66C2]",
  },

  instagram: {
    label: "Instagram",
    icon: FaInstagram,
    iconClassName: "text-white",
    buttonClassName:
      "bg-gradient-to-br from-violet-600 via-pink-500 to-orange-400",
  },

  x: {
    label: "X",
    icon: FaXTwitter,
    iconClassName: "text-white",
    buttonClassName: "bg-black",
  },

  facebook: {
    label: "Facebook",
    icon: FaFacebookF,
    iconClassName: "text-white",
    buttonClassName: "bg-[#1877F2]",
  },

  youtube: {
    label: "YouTube",
    icon: FaYoutube,
    iconClassName: "text-white",
    buttonClassName: "bg-[#FF0000]",
  },
};

const supportedTypes: SupportedSocialType[] = [
  "linkedin",
  "instagram",
  "x",
  "facebook",
  "youtube",
];

export default function SocialLinks({
  socials,
}: SocialLinksProps) {
  const visibleSocials = (socials ?? [])
    .filter(
      (social) =>
        social.isVisible &&
        Boolean(social.url?.trim()) &&
        supportedTypes.includes(
          social.platform as SupportedSocialType
        ),
    )
    .sort((a, b) => a.order - b.order);

  if (visibleSocials.length === 0) {
    return null;
  }

  return (
    <section className="px-5 pb-7 pt-2">
      <h2 className="text-lg font-bold text-violet-700">
        Social Media
      </h2>

      <div className="mt-4 grid grid-cols-5 gap-2">
        {visibleSocials.map((social) => {
          const type =
          social.platform as SupportedSocialType;

          const config = socialConfig[type];
          const Icon = config.icon;

          return (
            <a
              key={social.id}
              href={normalizeSocialUrl(social.url)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${config.label}`}
              title={config.label}
              className="group flex min-w-0 flex-col items-center"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-lg ${config.buttonClassName}`}
              >
                <Icon
                  size={23}
                  className={config.iconClassName}
                />
              </div>

              <span className="mt-2 w-full truncate text-center text-[11px] font-medium text-slate-600">
                {config.label}
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}

function normalizeSocialUrl(url: string) {
  const trimmedUrl = url.trim();

  if (
    trimmedUrl.startsWith("https://") ||
    trimmedUrl.startsWith("http://")
  ) {
    return trimmedUrl;
  }

  return `https://${trimmedUrl}`;
}