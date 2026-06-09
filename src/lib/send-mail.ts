import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.GMAIL_FROM,
		pass: process.env.GMAIL_APP_PASSWORD
	  }
})

export const sendMail =  async (to_person : string, currSubject : string) => {
	try {
		transporter.sendMail({
			to : `"Fleeter" ${to_person}`,
			from : process.env.GMAIL_FROM,
			subject : `your 6 digit otp is ${currSubject}`

		})
		return NextResponse.json({ status: 200 })
	} catch (error) {
			console.error(error);
			return NextResponse.json({ status: 500 })
	}
}

export const sendPickupOtp = async (
  email: string,
  otp: string
) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Your Ride Pickup OTP",
    html: `
      <div style="font-family:sans-serif">
        <h2>Ride Pickup Verification</h2>

        <p>Your pickup OTP is:</p>

        <h1 style="
          letter-spacing:8px;
          color:#16a34a;
        ">
          ${otp}
        </h1>

        <p>
          Share this OTP with your driver only after
          they arrive at your pickup location.
        </p>

        <p>
          OTP expires in 10 minutes.
        </p>
      </div>
    `,
  });
};