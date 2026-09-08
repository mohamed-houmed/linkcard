export type Expertise = {
  id: string;
  profileId: string;

  title: string;
  description: string | null;

  order: number;

  isVisible: boolean;
};