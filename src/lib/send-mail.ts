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