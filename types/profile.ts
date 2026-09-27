export type JourneyItem = {
  period: string;
  title: string;
  organization: string;
};

export type ExpertiseItem = string;

export type Profile = {
  id: string;
  ownerId: string;

  firstName: string;
  lastName: string;
  slug: string;

  jobTitle: string | null;
  companyName: string | null;
  headline: string | null;
  bio: string | null;
  expertise: ExpertiseItem[];
  journey: JourneyItem[];

  profileImageUrl: string | null;
  coverImageUrl: string | null;

  city: string | null;
  country: string | null;

  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
};
