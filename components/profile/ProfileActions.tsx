import {
  Globe,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

import type { Contact } from "@/types/contact";

type ProfileActionsProps = {
  contacts: Contact[];
};

export default function ProfileActions({
  contacts,
}: ProfileActionsProps) {
  function getLink(contact: Contact) {
    switch (contact.type) {
      case "phone":
        return `tel:${contact.value}`;

      case "whatsapp":
        return `https://wa.me/${contact.value.replace(/\D/g, "")}`;

      case "email":
        return `mailto:${contact.value}`;

      case "website":
        return contact.value.startsWith("http")
          ? contact.value
          : `https://${contact.value}`;

      default:
        return "#";
    }
  }

  function getIcon(type: Contact["type"]) {
    switch (type) {
      case "phone":
        return <Phone size={24} />;

      case "whatsapp":
        return <MessageCircle size={24} />;

      case "email":
        return <Mail size={24} />;

      case "website":
        return <Globe size={24} />;
    }
  }

  return (
    <div className="mt-8 flex justify-center gap-6">
      {contacts
        .filter((c) => c.isVisible)
        .map((contact) => (
          <a
            key={contact.id}
            href={getLink(contact)}
            target={
              contact.type === "website" ||
              contact.type === "whatsapp"
                ? "_blank"
                : undefined
            }
            rel="noreferrer"
            className="group flex flex-col items-center"
          >
            <div
              className="
                flex
                h-16
                w-16
                items-center
                justify-center
                rounded-full
                bg-gradient-to-br
                from-violet-600
                to-blue-600
                text-white
                shadow-lg
                transition-all
                duration-300
                group-hover:scale-110
                group-hover:shadow-violet-500/50
              "
            >
              {getIcon(contact.type)}
            </div>

            <span className="mt-2 text-sm text-slate-300">
              {contact.label}
            </span>
          </a>
        ))}
    </div>
  );
}