export type ContactType =
  | "phone"
  | "whatsapp"
  | "email"
  | "website";

export type Contact = {
  id: string;
  profileId: string;

  type: ContactType;

  label: string;
  value: string;

  isVisible: boolean;

  order: number;
};