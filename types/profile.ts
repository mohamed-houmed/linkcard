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

  profileImageUrl: string | null;
  coverImageUrl: string | null;

  city: string | null;
  country: string | null;

  isPublished: boolean;

  createdAt: string;
  updatedAt: string;
};
