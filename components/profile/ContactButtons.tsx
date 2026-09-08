import {
  ChevronRight,
  Globe,
  Mail,
  MessageCircle,
  Phone,
} from "lucide-react";

import type {
  Contact,
  ContactType,
} from "@/types/contact";

type ContactButtonsProps = {
  contacts: Contact[];
};

function getContactHref(contact: Contact) {
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

function getContactIcon(type: ContactType) {
  switch (type) {
    case "phone":
      return Phone;

    case "whatsapp":
      return MessageCircle;

    case "email":
      return Mail;

    case "website":
      return Globe;
  }
}

function getIconClasses(type: ContactType) {
  switch (type) {
    case "phone":
      return "from-emerald-500 to-teal-500";

    case "whatsapp":
      return "from-green-500 to-emerald-500";

    case "email":
      return "from-blue-500 to-indigo-500";

    case "website":
      return "from-violet-500 to-purple-500";
  }
}

export default function ContactButtons({
  contacts,
}: ContactButtonsProps) {
  const visibleContacts = contacts
    .filter((contact) => contact.isVisible)
    .sort((a, b) => a.order - b.order);

  return (
    <section>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-white">
          Contact
        </h2>

        <div
          className="
            mt-2
            h-1
            w-14
            rounded-full
            bg-gradient-to-r
            from-violet-500
            to-blue-500
          "
        />
      </div>

      <div className="space-y-3">
        {visibleContacts.map((contact) => {
          const Icon = getContactIcon(contact.type);
          const href = getContactHref(contact);

          return (
            <a
              key={contact.id}
              href={href}
              target={
                contact.type === "website" ||
                contact.type === "whatsapp"
                  ? "_blank"
                  : undefined
              }
              rel="noreferrer"
              className="
                group
                flex
                items-center
                gap-4
                rounded-2xl
                border
                border-white/10
                bg-white/5
                p-3
                transition
                duration-200
                hover:-translate-y-0.5
                hover:border-violet-400/40
                hover:bg-white/10
              "
            >
              <div
                className={`
                  flex
                  h-14
                  w-14
                  shrink-0
                  items-center
                  justify-center
                  rounded-2xl
                  bg-gradient-to-br
                  ${getIconClasses(contact.type)}
                  text-white
                  shadow-lg
                `}
              >
                <Icon size={25} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-semibold text-white">
                  {contact.label}
                </p>

                <p className="truncate text-sm text-slate-400">
                  {contact.value}
                </p>
              </div>

              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-white/5
                  text-slate-400
                  transition
                  group-hover:bg-violet-500/20
                  group-hover:text-violet-300
                "
              >
                <ChevronRight size={20} />
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}