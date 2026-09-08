"use client";

import { createClient } from "@/lib/supabase/client";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Settings2,
  XCircle,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type Appointment = {
  id: string;
  visitor_name: string;
  visitor_email: string | null;
  visitor_phone: string | null;
  visitor_message: string | null;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  meeting_type_id: string | null;
 meeting_type_name: string | null;
  status:
    | "pending"
    | "confirmed"
    | "cancelled"
    | "completed";

};

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
  is_enabled: boolean;
  sort_order: number;
};

type Props = {
  isFrench: boolean;
};

export default function AppointmentsSection({
  isFrench,
}: Props) {
  const supabase = useMemo(() => createClient(), []);

  const [activeTab, setActiveTab] = useState<
    "appointments" | "availability"
  >("appointments");

  const [appointments, setAppointments] =
    useState<Appointment[]>([]);

  const [appointmentFilter, setAppointmentFilter] =
  useState<
    "all" | "pending" | "confirmed" | "completed" | "cancelled"
  >("all");

  const [settings, setSettings] =
    useState<BookingSettings>({
      is_enabled: true,
      meeting_duration: 30,
      minimum_notice_minutes: 30,
      timezone: "Africa/Djibouti",
      start_time: "09:00",
      end_time: "17:00",
      available_days: [1, 2, 3, 4, 5],
    });
    const [meetingTypes, setMeetingTypes] =
  useState<MeetingType[]>([]);

  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsLoading(false);
        return;
      }

      setUserId(user.id);

      const { data: appointmentData } =
        await supabase
          .from("appointments")
          .select("*")
          .eq("owner_id", user.id)
          .order("appointment_date", {
            ascending: true,
          })
          .order("appointment_time", {
            ascending: true,
          });

      setAppointments(
        (appointmentData ?? []) as Appointment[],
      );

      const { data: settingsData } =
        await supabase
          .from("booking_settings")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

      if (settingsData) {
        setSettings({
          is_enabled:
            settingsData.is_enabled ?? true,
          meeting_duration:
            settingsData.meeting_duration ?? 30,
          minimum_notice_minutes:
           settingsData.minimum_notice_minutes ?? 30,
           timezone:
            settingsData.timezone ??
            "Africa/Djibouti",
          start_time:
            settingsData.start_time ?? "09:00",
          end_time:
            settingsData.end_time ?? "17:00",
          available_days:
            settingsData.available_days ??
            [1, 2, 3, 4, 5],
        });
      }
const { data: meetingTypeData } =
  await supabase
    .from("meeting_types")
    .select(
      "id, name, description, duration_minutes, is_enabled, sort_order",
    )
    .eq("user_id", user.id)
    .order("sort_order", {
      ascending: true,
    });

setMeetingTypes(
  (meetingTypeData ?? []) as MeetingType[],
);
      setIsLoading(false);
    }

    loadData();
  }, [supabase]);

  async function updateAppointmentStatus(
    id: string,
    status: Appointment["status"],
  ) {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id
          ? { ...appointment, status }
          : appointment,
      ),
    );
  }

  async function saveAvailability() {
    if (!userId) return;

    setIsSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("booking_settings")
      .upsert(
        {
          user_id: userId,
          ...settings,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      );

    if (error) {
      setMessage(error.message);
    } else {
      setMessage(
        isFrench
          ? "Disponibilités enregistrées."
          : "Availability saved.",
      );
    }

    setIsSaving(false);
  }
async function addMeetingType() {
  if (!userId) return;

  const { data, error } = await supabase
    .from("meeting_types")
    .insert({
      user_id: userId,
      name: isFrench
        ? "Nouveau rendez-vous"
        : "New meeting",
      description: "",
      duration_minutes: 30,
      is_enabled: true,
      sort_order: meetingTypes.length,
    })
    .select(
      "id, name, description, duration_minutes, is_enabled, sort_order",
    )
    .single();

  if (error) {
    setMessage(error.message);
    return;
  }

  setMeetingTypes((current) => [
    ...current,
    data as MeetingType,
  ]);
}

async function updateMeetingType(
  meetingType: MeetingType,
) {
  const { error } = await supabase
    .from("meeting_types")
    .update({
      name: meetingType.name,
      description: meetingType.description,
      duration_minutes: meetingType.duration_minutes,
      is_enabled: meetingType.is_enabled,
      sort_order: meetingType.sort_order,
      updated_at: new Date().toISOString(),
    })
    .eq("id", meetingType.id)
    .eq("user_id", userId);

  if (error) {
    setMessage(error.message);
    return;
  }

  setMessage(
    isFrench
      ? "Type de rendez-vous enregistré."
      : "Meeting type saved.",
  );
}

async function deleteMeetingType(id: string) {
  const { error } = await supabase
    .from("meeting_types")
    .delete()
    .eq("id", id)
    .eq("user_id", userId);

  if (error) {
    setMessage(error.message);
    return;
  }

  setMeetingTypes((current) =>
    current.filter((item) => item.id !== id),
  );
}
  const days = [
    { id: 1, en: "Monday", fr: "Lundi" },
    { id: 2, en: "Tuesday", fr: "Mardi" },
    { id: 3, en: "Wednesday", fr: "Mercredi" },
    { id: 4, en: "Thursday", fr: "Jeudi" },
    { id: 5, en: "Friday", fr: "Vendredi" },
    { id: 6, en: "Saturday", fr: "Samedi" },
    { id: 0, en: "Sunday", fr: "Dimanche" },
  ];
const filteredAppointments =
  appointmentFilter === "all"
    ? appointments
    : appointments.filter(
        (appointment) =>
          appointment.status === appointmentFilter,
      );
const upcomingAppointments = filteredAppointments.filter(
  (appointment) => {
    const appointmentDateTime = new Date(
      `${appointment.appointment_date}T${appointment.appointment_time}`,
    );

    return appointmentDateTime >= new Date();
  },
);

const pastAppointments = filteredAppointments.filter(
  (appointment) => {
    const appointmentDateTime = new Date(
      `${appointment.appointment_date}T${appointment.appointment_time}`,
    );

    return appointmentDateTime < new Date();
  },
);
  if (isLoading) {
    
    return (
      <div className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="font-bold text-slate-600">
          {isFrench
            ? "Chargement des rendez-vous..."
            : "Loading appointments..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-sm font-black uppercase tracking-[0.16em] text-violet-600">
          LinkCard Booking
        </p>

        <h2 className="mt-2 text-2xl font-black text-slate-950">
          {isFrench
            ? "Rendez-vous"
            : "Appointments"}
        </h2>

        <div className="mt-6 flex gap-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() =>
              setActiveTab("appointments")
            }
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${
              activeTab === "appointments"
                ? "bg-white text-violet-700 shadow-sm"
                : "text-slate-500"
            }`}
          >
            <CalendarDays
              size={17}
              className="mr-2 inline"
            />
            {isFrench
              ? "Rendez-vous"
              : "Appointments"}
          </button>

          <button
            type="button"
            onClick={() =>
              setActiveTab("availability")
            }
            className={`flex-1 rounded-xl px-4 py-3 text-sm font-black ${
              activeTab === "availability"
                ? "bg-white text-violet-700 shadow-sm"
                : "text-slate-500"
            }`}
          >
            <Settings2
              size={17}
              className="mr-2 inline"
            />
            {isFrench ? "Paramètres de réservation" : "Booking settings"}
          </button>
        </div>
      </div>

      {activeTab === "appointments" && (
        <div className="space-y-4">
            <div className="mb-5 flex flex-wrap gap-2">
  {[
    "all",
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ].map((filter) => (
    <button
      key={filter}
      type="button"
      onClick={() =>
        setAppointmentFilter(
          filter as
            | "all"
            | "pending"
            | "confirmed"
            | "completed"
            | "cancelled",
        )
      }
      className={`rounded-full px-4 py-2 text-sm font-bold transition ${
        appointmentFilter === filter
          ? "bg-violet-600 text-white"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {filter === "all"
        ? isFrench
          ? "Tous"
          : "All"
        : filter === "pending"
          ? isFrench
            ? "En attente"
            : "Pending"
          : filter === "confirmed"
            ? isFrench
              ? "Confirmés"
              : "Confirmed"
            : filter === "completed"
              ? isFrench
                ? "Terminés"
                : "Completed"
              : isFrench
                ? "Annulés"
                : "Cancelled"}
    </button>
  ))}
</div>
          {filteredAppointments.length === 0 ? (
            <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
              <CalendarDays
                size={32}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 text-lg font-black text-slate-950">
                {isFrench
                  ? "Aucun rendez-vous"
                  : "No appointments yet"}
              </h3>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
                
              <div
                key={appointment.id}
                className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-950">
                      {appointment.visitor_name}
                    </h3>
{appointment.meeting_type_name && (
  <p className="mt-2 text-sm font-black text-violet-700">
    {appointment.meeting_type_name}
    {" · "}
    {appointment.duration_minutes} min
  </p>
)}
                    <p className="mt-2 text-sm text-slate-600">
  {appointment.appointment_date}
  {" · "}
  {appointment.appointment_time}
  {" → "}
  {minutesToTime(
    timeToMinutes(appointment.appointment_time) +
      appointment.duration_minutes,
  )}
</p>

{appointment.visitor_email && (
 <p className="mt-1 text-sm text-slate-500">
{appointment.visitor_email}
 </p>
)}

{appointment.visitor_phone && (
<p className="mt-1 text-sm text-slate-500">
{appointment.visitor_phone}
 </p>
 )}

{appointment.visitor_message && (
<p className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
{appointment.visitor_message}
</p>
)}
</div>

<span
  className={`rounded-full px-3 py-1 text-xs font-black capitalize ${
    appointment.status === "pending"
      ? "bg-amber-50 text-amber-700"
      : appointment.status === "confirmed"
        ? "bg-violet-50 text-violet-700"
        : appointment.status === "completed"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-red-50 text-red-600"
  }`}
>
  {appointment.status === "pending"
    ? isFrench
      ? "En attente"
      : "Pending"
    : appointment.status === "confirmed"
      ? isFrench
        ? "Confirmé"
        : "Confirmed"
      : appointment.status === "completed"
        ? isFrench
          ? "Terminé"
          : "Completed"
        : isFrench
          ? "Annulé"
          : "Cancelled"}
</span>
</div>

                {appointment.status === "pending" && (
  <div className="mt-5 flex flex-wrap gap-3">
    <button
      type="button"
      onClick={() =>
        updateAppointmentStatus(
          appointment.id,
          "confirmed",
        )
      }
      className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-black text-emerald-700"
    >
      <CheckCircle2 size={17} />
      {isFrench ? "Confirmer" : "Confirm"}
    </button>

    <button
      type="button"
      onClick={() =>
        updateAppointmentStatus(
          appointment.id,
          "cancelled",
        )
      }
      className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600"
    >
      <XCircle size={17} />
      {isFrench ? "Annuler" : "Cancel"}
    </button>
  </div>
)}

{appointment.status === "confirmed" && (
  <div className="mt-5 flex flex-wrap gap-3">
    <button
      type="button"
      onClick={() =>
        updateAppointmentStatus(
          appointment.id,
          "completed",
        )
      }
      className="inline-flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-2 text-sm font-black text-violet-700"
    >
      <CheckCircle2 size={17} />
      {isFrench ? "Terminer" : "Complete"}
    </button>

    <button
      type="button"
      onClick={() =>
        updateAppointmentStatus(
          appointment.id,
          "cancelled",
        )
      }
      className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600"
    >
      <XCircle size={17} />
      {isFrench ? "Annuler" : "Cancel"}
    </button>
  </div>
)}
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "availability" && (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-slate-950">
                {isFrench
  ? "Paramètres de réservation"
  : "Booking settings"}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                {isFrench
                  ? "Définissez quand les visiteurs peuvent réserver."
                  : "Choose when visitors can book you."}
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setSettings((current) => ({
                  ...current,
                  is_enabled:
                    !current.is_enabled,
                }))
              }
              className={`rounded-full px-4 py-2 text-sm font-black ${
                settings.is_enabled
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {settings.is_enabled
                ? isFrench
                  ? "Activé"
                  : "Enabled"
                : isFrench
                  ? "Désactivé"
                  : "Disabled"}
            </button>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-sm font-bold text-slate-700">
              {isFrench
                ? "Jours disponibles"
                : "Available days"}
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {days.map((day) => {
                const selected =
                  settings.available_days.includes(
                    day.id,
                  );

                return (
                  <button
                    key={day.id}
                    type="button"
                    onClick={() =>
                      setSettings((current) => ({
                        ...current,
                        available_days: selected
                          ? current.available_days.filter(
                              (id) =>
                                id !== day.id,
                            )
                          : [
                              ...current.available_days,
                              day.id,
                            ],
                      }))
                    }
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-bold ${
                      selected
                        ? "border-violet-300 bg-violet-50 text-violet-700"
                        : "border-slate-200 bg-white text-slate-500"
                    }`}
                  >
                    {isFrench ? day.fr : day.en}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {isFrench
                  ? "Heure de début"
                  : "Start time"}
              </label>

              <input
                type="time"
                value={settings.start_time}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    start_time:
                      event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {isFrench
                  ? "Heure de fin"
                  : "End time"}
              </label>

              <input
                type="time"
                value={settings.end_time}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    end_time:
                      event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              />
            </div>


            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                {isFrench
                  ? "Fuseau horaire"
                  : "Timezone"}
              </label>
            
            <div>
  <label className="mb-2 block text-sm font-black text-slate-700">
    {isFrench
      ? "Délai minimum de réservation"
      : "Minimum booking notice"}
  </label>

  <select
    value={settings.minimum_notice_minutes}
    onChange={(event) =>
      setSettings((current) => ({
        ...current,
        minimum_notice_minutes: Number(event.target.value),
      }))
    }
    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 outline-none"
  >
    <option value={0}>
      {isFrench ? "Aucun délai" : "No notice"}
    </option>
    <option value={30}>30 minutes</option>
    <option value={60}>1 hour</option>
    <option value={120}>2 hours</option>
    <option value={1440}>24 hours</option>
  </select>
</div>

              <input
                type="text"
                value={settings.timezone}
                onChange={(event) =>
                  setSettings((current) => ({
                    ...current,
                    timezone:
                      event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              />
            </div>
          </div>

          {message && (
            <p className="mt-5 text-sm font-bold text-violet-700">
              {message}
            </p>
          )}
<div className="mt-10 border-t border-slate-200 pt-8">
  <div className="flex items-center justify-between gap-4">
    <div>
      <h3 className="text-xl font-black text-slate-950">
        {isFrench
          ? "Types de rendez-vous"
          : "Meeting types"}
      </h3>

      <p className="mt-1 text-sm text-slate-500">
        {isFrench
          ? "Créez plusieurs options et durées de rendez-vous."
          : "Create different meeting options and durations."}
      </p>
    </div>

    <button
      type="button"
      onClick={addMeetingType}
      className="rounded-xl bg-violet-600 px-4 py-3 text-sm font-black text-white"
    >
      {isFrench ? "Ajouter" : "Add"}
    </button>
  </div>

  <div className="mt-6 space-y-4">
    {meetingTypes.length === 0 && (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm font-bold text-slate-500">
        {isFrench
          ? "Aucun type de rendez-vous."
          : "No meeting types yet."}
      </div>
    )}

    {meetingTypes.map((meetingType) => (
      <div
        key={meetingType.id}
        className="rounded-2xl border border-slate-200 p-5"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {isFrench ? "Nom" : "Name"}
            </label>

            <input
              value={meetingType.name}
              onChange={(event) =>
                setMeetingTypes((current) =>
                  current.map((item) =>
                    item.id === meetingType.id
                      ? {
                          ...item,
                          name: event.target.value,
                        }
                      : item,
                  ),
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-bold text-slate-700">
              {isFrench ? "Durée" : "Duration"}
            </label>

            <select
              value={meetingType.duration_minutes}
              onChange={(event) =>
                setMeetingTypes((current) =>
                  current.map((item) =>
                    item.id === meetingType.id
                      ? {
                          ...item,
                          duration_minutes: Number(
                            event.target.value,
                          ),
                        }
                      : item,
                  ),
                )
              }
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
              <option value={120}>120 min</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-bold text-slate-700">
            {isFrench ? "Description" : "Description"}
          </label>

          <textarea
            value={meetingType.description ?? ""}
            onChange={(event) =>
              setMeetingTypes((current) =>
                current.map((item) =>
                  item.id === meetingType.id
                    ? {
                        ...item,
                        description: event.target.value,
                      }
                    : item,
                ),
              )
            }
            rows={2}
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() =>
              setMeetingTypes((current) =>
                current.map((item) =>
                  item.id === meetingType.id
                    ? {
                        ...item,
                        is_enabled: !item.is_enabled,
                      }
                    : item,
                ),
              )
            }
            className={`rounded-xl px-4 py-2 text-sm font-black ${
              meetingType.is_enabled
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {meetingType.is_enabled
              ? isFrench
                ? "Activé"
                : "Enabled"
              : isFrench
                ? "Désactivé"
                : "Disabled"}
          </button>

          <button
            type="button"
            onClick={() =>
              updateMeetingType(meetingType)
            }
            className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-black text-white"
          >
            {isFrench ? "Enregistrer" : "Save"}
          </button>

          <button
            type="button"
            onClick={() =>
              deleteMeetingType(meetingType.id)
            }
            className="rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-600"
          >
            {isFrench ? "Supprimer" : "Delete"}
          </button>
        </div>
      </div>
    ))}
  </div>
</div>
          <button
            type="button"
            onClick={saveAvailability}
            disabled={isSaving}
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            <Clock size={17} />

            {isSaving
              ? isFrench
                ? "Enregistrement..."
                : "Saving..."
              : isFrench
                ? "Enregistrer les disponibilités"
                : "Save availability"}
          </button>
        </div>
      )}
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