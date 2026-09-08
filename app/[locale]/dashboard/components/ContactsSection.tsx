import {
  CalendarDays,
  Globe,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa6";

export type ProfileForm = {
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  location: string;
  bio: string;
  phone: string;
  whatsapp: string;
  email: string;
  socialLink: string;
  website: string;
  address: string;
  mapsLink: string;
  bookingLink: string;
};

type ContactsSectionProps = {
  profile: ProfileForm;
  isFrench: boolean;
  updateField: (
    field: keyof ProfileForm,
    value: string,
  ) => void;
};

export default function ContactsSection({
  profile,
  isFrench,
  updateField,
}: ContactsSectionProps) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
        {isFrench
          ? "Coordonnées"
          : "Contact details"}
      </p>

      <h2 className="mt-2 text-2xl font-black text-slate-950">
        {isFrench
          ? "Comment peut-on vous contacter ?"
          : "How can people contact you?"}
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-600">
        {isFrench
          ? "Ajoutez les coordonnées et liens professionnels que vos visiteurs pourront utiliser."
          : "Add the contact details and professional links your visitors can use."}
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <ContactInput
          label={
            isFrench ? "Téléphone" : "Phone"
          }
          value={profile.phone}
          onChange={(value) =>
            updateField("phone", value)
          }
          icon={<Phone size={18} />}
          placeholder="+253 77 00 00 00"
          type="tel"
        />

        <ContactInput
          label="WhatsApp"
          value={profile.whatsapp}
          onChange={(value) =>
            updateField("whatsapp", value)
          }
          icon={<FaWhatsapp size={18} />}
          placeholder="+253 77 00 00 00"
          type="tel"
        />

        <ContactInput
          label="E-mail"
          value={profile.email}
          onChange={(value) =>
            updateField("email", value)
          }
          icon={<Mail size={18} />}
          placeholder="name@example.com"
          type="email"
        />

        <ContactInput
          label={
            isFrench ? "Site web" : "Website"
          }
          value={profile.website}
          onChange={(value) =>
            updateField("website", value)
          }
          icon={<Globe size={18} />}
          placeholder="example.com"
          type="url"
        />

        <div className="sm:col-span-2">
          <ContactInput
            label={
              isFrench
                ? "Adresse professionnelle"
                : "Office address"
            }
            value={profile.address}
            onChange={(value) =>
              updateField("address", value)
            }
            icon={<MapPin size={18} />}
            placeholder={
              isFrench
                ? "Ex. Djibouti-ville, Djibouti"
                : "e.g. Djibouti City, Djibouti"
            }
          />
        </div>

        <ContactInput
          label="Google Maps"
          value={profile.mapsLink}
          onChange={(value) =>
            updateField("mapsLink", value)
          }
          icon={<MapPin size={18} />}
          placeholder="maps.google.com/..."
          type="url"
        />

        <ContactInput
          label={
            isFrench
              ? "Lien de réservation"
              : "Booking link"
          }
          value={profile.bookingLink}
          onChange={(value) =>
            updateField("bookingLink", value)
          }
          icon={<CalendarDays size={18} />}
          placeholder="calendly.com/..."
          type="url"
        />
      </div>
    </div>
  );
}

type ContactInputProps = {
  label: string;
  value: string;
  icon: React.ReactNode;
  placeholder?: string;
  type?: "text" | "email" | "tel" | "url";
  onChange: (value: string) => void;
};

function ContactInput({
  label,
  value,
  icon,
  placeholder,
  type = "text",
  onChange,
}: ContactInputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-950 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
        />
      </div>
    </div>
  );
}