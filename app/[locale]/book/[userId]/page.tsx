"use client";

import { createClient } from "@/lib/supabase/client";
import {
  CalendarDays,
  CheckCircle2,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import { useParams } from "next/navigation";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

type BookingSettings = {
  is_enabled: boolean;
  meeting_duration: number;
  minimum_notice_minutes: number;
  timezone: string;
  start_time: string;
  end_time: string;
  available_days: number[];
};
type MeetingType = {
  id: string;
  name: string;
  description: string | null;
  duration_minutes: number;
};

export default function BookingPage() {
  const params = useParams<{
    locale: string;
    userId: string;
  }>();

  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const locale = params.locale ?? "en";
  const isFrench = locale === "fr";

  const [settings, setSettings] =
    useState<BookingSettings | null>(null);
    const [meetingTypes, setMeetingTypes] =
  useState<MeetingType[]>([]);

const [selectedMeetingTypeId, setSelectedMeetingTypeId] =
  useState("");

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  type BookedInterval = {
  appointment_time: string;
  duration_minutes: number;
};

const [bookedIntervals, setBookedIntervals] =
  useState<BookedInterval[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [isLoading, setIsLoading] =
    useState(true);

  const [isLoadingSlots, setIsLoadingSlots] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("booking_settings")
        .select(`
          is_enabled,
          meeting_duration,
          timezone,
          start_time,
          end_time,
          available_days
        `)
        .eq("user_id", params.userId)
        .maybeSingle();

      if (error) {
        setErrorMessage(error.message);
      }

      if (data) {
        setSettings({
          is_enabled: data.is_enabled ?? true,
          meeting_duration:
            data.meeting_duration ?? 30,
          timezone:
            data.timezone ?? "Africa/Djibouti",
          start_time:
            data.start_time ?? "09:00",
          end_time:
            data.end_time ?? "17:00",
          available_days:
            data.available_days ??
            [1, 2, 3, 4, 5],
        });
      }
const { data: meetingTypeData, error: meetingTypeError } =
  await supabase
    .from("meeting_types")
    .select(
      "id, name, description, duration_minutes",
    )
    .eq("user_id", params.userId)
    .eq("is_enabled", true)
    .order("sort_order", {
      ascending: true,
    });
console.log("Loaded meeting types:", meetingTypeData);
console.log("Meeting types error:", meetingTypeError);

if (meetingTypeError) {
  setErrorMessage(meetingTypeError.message);
} else {
  setMeetingTypes(
    (meetingTypeData ?? []) as MeetingType[],
  );

  if (meetingTypeData?.length) {
    setSelectedMeetingTypeId(
      meetingTypeData[0].id,
    );
  }
}
      setIsLoading(false);
    }


    loadSettings();
  }, [params.userId, supabase]);

useEffect(() => {
  async function loadBookedTimes() {
    if (!date) {
      setBookedIntervals([]);
      return;
    }

    setIsLoadingSlots(true);
    setTime("");

    const { data, error } =
      await supabase.rpc(
        "get_booked_intervals",
        {
          p_owner_id: params.userId,
          p_date: date,
        },
      );

    if (error) {
      setErrorMessage(error.message);
      setBookedIntervals([]);
    } else {
      setBookedIntervals(
        (data ?? []).map(
          (item: {
            appointment_time: string;
            duration_minutes: number;
          }) => ({
            appointment_time:
              item.appointment_time.slice(0, 5),
            duration_minutes:
              item.duration_minutes,
          }),
        ),
      );
    }

    setIsLoadingSlots(false);
  }

  loadBookedTimes();
}, [date, params.userId, supabase]);
  const selectedMeetingType =
  meetingTypes.find(
    (item) =>
      item.id === selectedMeetingTypeId,
  ) ?? null;

  const availableSlots = useMemo(() => {
  if (!settings || !selectedMeetingType) {
    return [];
  }

  const duration =
    selectedMeetingType.duration_minutes;

  const startMinutes =
    timeToMinutes(settings.start_time);

  const endMinutes =
    timeToMinutes(settings.end_time);

  const slots: string[] = [];

  for (
    let current = startMinutes;
    current + duration <= endMinutes;
    current += duration
  ) {
    const slot = minutesToTime(current);

    const slotStart = current;
const slotEnd = current + duration;
const selectedDate = new Date(`${date}T00:00:00`);
const today = new Date();

const isToday =
  selectedDate.getFullYear() === today.getFullYear() &&
  selectedDate.getMonth() === today.getMonth() &&
  selectedDate.getDate() === today.getDate();

if (isToday) {
  const nowMinutes =
  today.getHours() * 60 + today.getMinutes();

const minimumNoticeMinutes =
  settings.minimum_notice_minutes ?? 30;

if (slotStart < nowMinutes + minimumNoticeMinutes) {
  continue;
}
}

const overlaps = bookedIntervals.some(
  (booking) => {
    const bookedStart = timeToMinutes(
      booking.appointment_time,
    );

    const bookedEnd =
      bookedStart +
      booking.duration_minutes;

    return (
      slotStart < bookedEnd &&
      slotEnd > bookedStart
    );
  },
);

if (!overlaps) {
  slots.push(slot);
}
  }

  return slots;
}, [
  settings,
  bookedIntervals,
  selectedMeetingType,
  date,
]);
  const selectedDayIsAvailable =
    useMemo(() => {
      if (!date || !settings) return false;

      const selectedDate = new Date(
        `${date}T12:00:00`,
      );

      return settings.available_days.includes(
        selectedDate.getDay(),
      );
    }, [date, settings]);

  async function submitAppointment() {
    setErrorMessage("");

    if (!settings?.is_enabled) {
      setErrorMessage(
        isFrench
          ? "Les réservations sont actuellement désactivées."
          : "Bookings are currently disabled.",
      );
      return;
    }

    if (!name.trim()) {
      setErrorMessage(
        isFrench
          ? "Veuillez saisir votre nom."
          : "Please enter your name.",
      );
      return;
    }

    if (!date) {
      setErrorMessage(
        isFrench
          ? "Veuillez choisir une date."
          : "Please choose a date.",
      );
      return;
    }

    if (!selectedDayIsAvailable) {
      setErrorMessage(
        isFrench
          ? "Cette journée n'est pas disponible."
          : "This day is not available.",
      );
      return;
    }

    if (!time) {
      setErrorMessage(
        isFrench
          ? "Veuillez choisir une heure disponible."
          : "Please choose an available time.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase
  .from("appointments")
  .insert({
    owner_id: params.userId,
    visitor_name: name.trim(),
    visitor_email: email.trim() || null,
    visitor_phone: phone.trim() || null,
    visitor_message: message.trim() || null,

    appointment_date: date,
    appointment_time: time,

    meeting_type_id:
      selectedMeetingType?.id ?? null,

    meeting_type_name:
      selectedMeetingType?.name ?? null,

    duration_minutes:
      selectedMeetingType?.duration_minutes ?? 30,

    status: "pending",
  });

      if (error) {
        if (
          error.code === "23505"
        ) {
          setErrorMessage(
            isFrench
              ? "Ce créneau vient d'être réservé. Veuillez en choisir un autre."
              : "This time was just booked. Please choose another slot.",
          );

          setTime("");
          return;
        }

        setErrorMessage(
          isFrench
            ? `Impossible de réserver : ${error.message}`
            : `Unable to book: ${error.message}`,
        );

        return;
      }

      setSuccess(true);
    } finally {
        if (!selectedMeetingType) {
  setErrorMessage(
    isFrench
      ? "Veuillez choisir un type de rendez-vous."
      : "Please choose a meeting type.",
  );
  return;
}
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="font-bold text-slate-600">
            {isFrench
              ? "Chargement des disponibilités..."
              : "Loading availability..."}
          </p>
        </div>
      </main>
    );
  }

  if (!settings) {
    return (
      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CalendarDays
            size={36}
            className="mx-auto text-slate-300"
          />

          <h1 className="mt-4 text-2xl font-black text-slate-950">
            {isFrench
              ? "Réservation indisponible"
              : "Booking unavailable"}
          </h1>
        </div>
      </main>
    );
  }

  if (!settings.is_enabled) {
    return (
      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="mx-auto max-w-2xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <CalendarDays
            size={36}
            className="mx-auto text-slate-300"
          />

          <h1 className="mt-4 text-2xl font-black text-slate-950">
            {isFrench
              ? "Réservations fermées"
              : "Bookings are closed"}
          </h1>

          <p className="mt-2 text-slate-600">
            {isFrench
              ? "Cette personne n'accepte pas de rendez-vous actuellement."
              : "This person is not accepting appointments right now."}
          </p>
        </div>
      </main>
    );
  }

  if (success) {
    return (
      <main className="min-h-screen bg-slate-100 px-5 py-10">
        <div className="mx-auto max-w-xl rounded-[32px] border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle2 size={30} />
          </div>

          <h1 className="mt-5 text-3xl font-black text-slate-950">
            {isFrench
              ? "Demande envoyée"
              : "Appointment requested"}
          </h1>

          <p className="mt-3 text-slate-600">
            {isFrench
              ? "Votre demande de rendez-vous a été enregistrée."
              : "Your appointment request has been saved."}
          </p>

          <div className="mt-6 rounded-2xl bg-slate-50 p-5 text-left">
            <p className="text-sm text-slate-500">
              {isFrench ? "Date" : "Date"}
            </p>

            <p className="mt-1 font-black">
              {date}
            </p>

            <p className="mt-4 text-sm text-slate-500">
              {isFrench ? "Heure" : "Time"}
            </p>

            <p className="mt-1 font-black">
              {time}
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 px-5 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
            LinkCard Booking
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-950">
            {isFrench
              ? "Réserver un rendez-vous"
              : "Book an appointment"}
          </h1>

          <p className="mt-3 leading-7 text-slate-600">
            {isFrench
              ? "Choisissez une date puis un créneau disponible."
              : "Choose a date and then an available time slot."}
          </p>

          <div className="mt-8">
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {isFrench ? "Date" : "Date"}
            </label>

            <input
              type="date"
              min={getToday()}
              value={date}
              onChange={(event) => {
                setDate(event.target.value);
                setErrorMessage("");
              }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
            />
          </div>

          {date &&
            !selectedDayIsAvailable && (
              <div className="mt-4 rounded-2xl bg-amber-50 p-4 text-sm font-bold text-amber-700">
                {isFrench
                  ? "Cette journée n'est pas disponible. Choisissez un autre jour."
                  : "This day is not available. Please choose another day."}
              </div>
            )}

          {date &&
            selectedDayIsAvailable && (
              <div className="mt-7">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-black text-slate-700">
                    {isFrench
                      ? "Heures disponibles"
                      : "Available times"}
                  </h2>

                  <span className="text-xs font-bold text-slate-400">
                    {selectedMeetingType?.duration_minutes ?? 30} min
                  </span>
                </div>

                {isLoadingSlots ? (
                  <p className="mt-4 text-sm text-slate-500">
                    {isFrench
                      ? "Chargement..."
                      : "Loading times..."}
                  </p>
                ) : availableSlots.length ===
                  0 ? (
                  <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm font-bold text-slate-500">
                    {isFrench
                      ? "Aucun créneau disponible pour cette journée."
                      : "No available times for this day."}
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {availableSlots.map(
                      (slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() =>
                            setTime(slot)
                          }
                          className={`rounded-xl border px-3 py-3 text-sm font-black transition ${
                            time === slot
                              ? "border-violet-600 bg-violet-600 text-white"
                              : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50"
                          }`}
                        >
                          {slot}
                        </button>
                      ),
                    )}
                  </div>
                )}
              </div>
            )}

          <div className="mt-8 space-y-5">
            <Field
              label={
                isFrench
                  ? "Votre nom"
                  : "Your name"
              }
              icon={<UserRound size={18} />}
            >
              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder={
                  isFrench
                    ? "Nom complet"
                    : "Full name"
                }
                className={inputClass}
              />
            </Field>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="E-mail"
                icon={<Mail size={18} />}
              >
                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="name@example.com"
                  className={inputClass}
                />
              </Field>

              <Field
                label={
                  isFrench
                    ? "Téléphone"
                    : "Phone"
                }
                icon={<Phone size={18} />}
              >
                <input
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="+253..."
                  className={inputClass}
                />
              </Field>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {isFrench
                  ? "Message"
                  : "Message"}
              </label>

              <textarea
                rows={4}
                value={message}
                onChange={(event) =>
                  setMessage(event.target.value)
                }
                placeholder={
                  isFrench
                    ? "Objet du rendez-vous (facultatif)"
                    : "Reason for the meeting (optional)"
                }
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100"
              />
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700">
              {errorMessage}
            </div>
          )}

          <button
            type="button"
            onClick={submitAppointment}
            disabled={
              isSubmitting ||
              !date ||
              !time ||
              !selectedDayIsAvailable
            }
            className="mt-7 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-5 py-4 font-black text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSubmitting
              ? isFrench
                ? "Réservation..."
                : "Booking..."
              : isFrench
                ? "Demander le rendez-vous"
                : "Request appointment"}
          </button>

          <p className="mt-5 text-center text-xs text-slate-400">
            {settings.timezone}
            {" · "}
            {selectedMeetingType?.duration_minutes ?? 30} min
          </p>
        </div>
      </div>
    </main>
  );
}

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 outline-none transition focus:border-violet-500 focus:bg-white focus:ring-4 focus:ring-violet-100";

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        {children}
      </div>
    </div>
  );
}

function timeToMinutes(value: string) {
  const [hours, minutes] = value
    .slice(0, 5)
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function minutesToTime(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  return `${String(hours).padStart(
    2,
    "0",
  )}:${String(mins).padStart(2, "0")}`;
}

function getToday() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(
    now.getMonth() + 1,
  ).padStart(2, "0");
  const day = String(now.getDate()).padStart(
    2,
    "0",
  );

  return `${year}-${month}-${day}`;
}