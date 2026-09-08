export type Experience = {
  id: string;

  profileId: string;

  companyName: string;

  jobTitle: string;

  employmentType: string | null;

  location: string | null;

  startDate: string;

  endDate: string | null;

  isCurrent: boolean;

  description: string | null;

  order: number;
};