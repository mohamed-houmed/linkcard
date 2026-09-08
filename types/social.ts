export type SocialPlatform =
  | "linkedin"
  | "facebook"
  | "instagram"
  | "x"
  | "youtube"
  | "github"
  | "tiktok";

export type Social = {
  id: string;

  profileId: string;

  platform: SocialPlatform;

  url: string;

  isVisible: boolean;

  order: number;
};