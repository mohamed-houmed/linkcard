import AboutSection from "./AboutSection";
import Avatar from "./Avatar";
import ContactActions from "./ContactActions";
import CoverImage from "./CoverImage";
import CTAButton from "./CTAButton";
import ExpertiseSection from "./ExpertiseSection";
import Identity from "./Identity";
import SkillsSection from "./SkillsSection";
import SocialLinks from "./SocialLinks";

import type { Contact } from "@/types/contact";
import type { Expertise } from "@/types/expertise";
import type { Profile as ProfileType } from "@/types/profile";
import type { Skill } from "@/types/skill";
import type { Social } from "@/types/social";

type ProfileProps = {
  profile: ProfileType;
  contacts: Contact[];
  socials: Social[];
  skills: Skill[];
  expertise: Expertise[];
};

export default function Profile({
  profile,
  contacts,
  socials,
  skills,
  expertise,
}: ProfileProps) {
  return (
    <div className="mx-auto w-full max-w-md">
      <article className="relative overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-black/30">
        <CoverImage imageUrl={profile.coverImageUrl} />

        <Avatar
          imageUrl={profile.profileImageUrl}
          name={`${profile.firstName} ${profile.lastName}`}
        />

        <Identity profile={profile} />

        <ContactActions
          contacts={contacts}
          profile={profile}
        />

        <CTAButton />

        <AboutSection bio={profile.bio} />

        <SocialLinks socials={socials} />


        <ExpertiseSection expertise={expertise} />
      </article>

      <div className="py-6 text-center">
        <p className="text-xs text-slate-400">
          Powered by{" "}
          <span className="font-semibold text-violet-600">
            LinkCard
          </span>
        </p>
      </div>
    </div>
  );
}