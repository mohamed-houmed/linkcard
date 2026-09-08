import {
  Mail,
  Phone,
  UserRoundPlus,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa6";

import type { Contact } from "@/types/contact";
import type { Profile } from "@/types/profile";

type Props = {
  contacts: Contact[];
  profile: Profile;
};

export default function ContactActions({
  contacts,
  profile,
}: Props) {
  const visibleContacts = (contacts ?? []).filter(
    (contact) => contact.isVisible,
  );

  const phone = visibleContacts.find(
    (contact) => contact.type === "phone",
  );

  const whatsapp = visibleContacts.find(
    (contact) => contact.type === "whatsapp",
  );

  const email = visibleContacts.find(
    (contact) => contact.type === "email",
  );

  const cleanWhatsAppNumber =
    whatsapp?.value.replace(/\D/g, "") ?? "";

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim();

  const vCardContent = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${fullName}`,
    `N:${profile.lastName};${profile.firstName};;;`,
    profile.jobTitle
      ? `TITLE:${profile.jobTitle}`
      : "",
    profile.companyName
      ? `ORG:${profile.companyName}`
      : "",
    phone?.value
      ? `TEL;TYPE=CELL:${phone.value}`
      : "",
    email?.value
      ? `EMAIL:${email.value}`
      : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");

  const saveContactUrl = `data:text/vcard;charset=utf-8,${encodeURIComponent(
    vCardContent,
  )}`;

  return (
    <div className="px-5 pt-2">
      <div className="grid grid-cols-4 gap-2">
        <CircleButton
          href={phone ? `tel:${phone.value}` : undefined}
          label="Call"
          icon={
            <Phone
              size={24}
              strokeWidth={2.2}
            />
          }
          iconClassName="text-slate-700"
        />

        <CircleButton
          href={
            cleanWhatsAppNumber
              ? `https://wa.me/${cleanWhatsAppNumber}`
              : undefined
          }
          label="WhatsApp"
          icon={<FaWhatsapp size={26} />}
          iconClassName="text-green-500"
          external
        />

        <CircleButton
          href={
            email
              ? `mailto:${email.value}`
              : undefined
          }
          label="Email"
          icon={
            <Mail
              size={25}
              strokeWidth={2.2}
            />
          }
          iconClassName="text-violet-600"
        />

        <CircleButton
          href={saveContactUrl}
          label="Save Contact"
          icon={
            <UserRoundPlus
              size={25}
              strokeWidth={2.2}
            />
          }
          iconClassName="text-blue-600"
          download={`${profile.slug || "linkcard-contact"}.vcf`}
        />
      </div>
    </div>
  );
}

type CircleButtonProps = {
  href?: string;
  label: string;
  icon: React.ReactNode;
  iconClassName: string;
  external?: boolean;
  download?: string;
};

function CircleButton({
  href,
  label,
  icon,
  iconClassName,
  external = false,
  download,
}: CircleButtonProps) {
  const content = (
    <>
      <div
        className={`flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 shadow-sm ring-1 ring-slate-200 transition-all duration-300 group-hover:-translate-y-1 group-hover:bg-white group-hover:shadow-md ${iconClassName}`}
      >
        {icon}
      </div>

      <span className="mt-2 min-h-8 text-center text-[12px] font-medium leading-4 text-slate-700">
        {label}
      </span>
    </>
  );

  if (!href) {
    return (
      <div className="flex flex-col items-center opacity-40">
        {content}
      </div>
    );
  }

  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      download={download}
      className="group flex flex-col items-center"
      aria-label={label}
    >
      {content}
    </a>
  );
}