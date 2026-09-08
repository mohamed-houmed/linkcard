import { BadgeCheck, MapPin } from "lucide-react";

import type { Profile } from "@/types/profile";

type IdentityProps = {
  profile: Profile;
};

export default function Identity({
  profile,
}: IdentityProps) {
  return (
    <div className="px-4 pb-6 pt-24 text-center sm:px-6">
      <div className="flex items-center justify-center gap-1.5">
        <h1 className="whitespace-nowrap text-[20px] font-bold leading-tight text-slate-900">
          {profile.firstName} {profile.lastName}
        </h1>

        <BadgeCheck
          size={19}
          className="shrink-0 fill-blue-500 text-white"
        />
      </div>

      {profile.jobTitle && (
        <p className="mt-3 text-lg font-semibold text-violet-600">
          {profile.jobTitle}
        </p>
      )}

      {profile.companyName && (
        <p className="mt-1 text-base text-slate-600">
          {profile.companyName}
        </p>
      )}

      {(profile.city || profile.country) && (
        <div className="mt-4 flex items-center justify-center gap-2 text-slate-500">
          <MapPin
            size={16}
            className="shrink-0"
          />

          <span className="text-sm">
            {[profile.city, profile.country]
              .filter(Boolean)
              .join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}