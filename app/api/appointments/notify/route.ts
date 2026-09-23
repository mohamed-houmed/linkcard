import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    /*
     * CONFIRMATION EMAIL
     * Sent when the profile owner confirms an appointment.
     */
    if (body.type === "cancelled") {
  const appointment = body.appointment;

  if (!appointment?.visitor_email) {
    return NextResponse.json(
      { error: "Visitor email is required" },
      { status: 400 }
    );
  }

  const { data, error } = await resend.emails.send({
    from: "LinkCard <contact@getlinkcard.com>",
    to: [appointment.visitor_email],
    subject: "Your LinkCard appointment has been cancelled",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Appointment cancelled</h2>

        <p>Hello ${appointment.visitor_name || "there"},</p>

        <p>
          Your appointment has been cancelled by the profile owner.
        </p>

        <p>
          <strong>Date:</strong> ${appointment.appointment_date}<br />
          <strong>Time:</strong> ${appointment.appointment_time}<br />
          <strong>Meeting:</strong> ${
            appointment.meeting_type_name || "Appointment"
          }<br />
          <strong>Duration:</strong> ${
            appointment.duration_minutes || 30
          } minutes
        </p>

        <p>
          You can visit the LinkCard profile again if you would like
          to request another appointment.
        </p>

        <p>LinkCard</p>
      </div>
    `,
  });

  if (error) {
    console.error("Resend cancellation email error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    emailId: data?.id,
  });
}
    if (body.type === "confirmed") {
      const appointment = body.appointment;

      if (!appointment?.visitor_email) {
        return NextResponse.json(
          { error: "Visitor email is required" },
          { status: 400 }
        );
      }

      const { data, error } = await resend.emails.send({
        from: "LinkCard <contact@getlinkcard.com>",
        to: [appointment.visitor_email],
        subject: "Your LinkCard appointment is confirmed",
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Appointment confirmed</h2>

            <p>Hello ${appointment.visitor_name || "there"},</p>

            <p>
              Good news! Your appointment request has been confirmed.
            </p>

            <p>
              <strong>Date:</strong> ${appointment.appointment_date}<br />
              <strong>Time:</strong> ${appointment.appointment_time}<br />
              <strong>Meeting:</strong> ${
                appointment.meeting_type_name || "Appointment"
              }<br />
              <strong>Duration:</strong> ${
                appointment.duration_minutes || 30
              } minutes
            </p>

            <p>
              Your appointment is now confirmed. Please make sure
              you're available at the scheduled time.
            </p>

            <p>LinkCard</p>
          </div>
        `,
      });

      if (error) {
        console.error("Resend confirmation email error:", error);

        return NextResponse.json(
          { error: error.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        emailId: data?.id,
      });
    }

    /*
     * INITIAL APPOINTMENT REQUEST EMAIL
     * Keep the existing behavior.
     */
    const {
      visitorName,
      visitorEmail,
      appointmentDate,
      appointmentTime,
      meetingType,
      durationMinutes,
    } = body;

    if (!visitorEmail) {
      return NextResponse.json(
        { error: "Visitor email is required" },
        { status: 400 }
      );
    }

    const { data, error } = await resend.emails.send({
      from: "LinkCard <contact@getlinkcard.com>",
      to: [visitorEmail],
      subject: "Your LinkCard appointment request",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Appointment request received</h2>

          <p>Hello ${visitorName || "there"},</p>

          <p>
            Your appointment request has been successfully submitted.
          </p>

          <p>
            <strong>Date:</strong> ${appointmentDate}<br />
            <strong>Time:</strong> ${appointmentTime}<br />
            <strong>Meeting:</strong> ${meetingType || "Appointment"}<br />
            <strong>Duration:</strong> ${durationMinutes || 30} minutes
          </p>

          <p>
            The profile owner will review your request.
            You will receive another notification once it is confirmed.
          </p>

          <p>LinkCard</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend request email error:", error);

      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      emailId: data?.id,
    });
  } catch (error) {
    console.error("Email API error:", error);

    return NextResponse.json(
      { error: "Unable to send email" },
      { status: 500 }
    );
  }
}