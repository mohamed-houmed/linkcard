import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const body = await request.json();

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
      console.error("Resend error:", error);

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