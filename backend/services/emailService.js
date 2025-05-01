import nodemailer from 'nodemailer';
import bwipjs from 'bwip-js';
import appointmentModel from '../models/appointmentModel.js';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: 'Gmail', // Or use another SMTP service like SendGrid, Mailgun, etc.
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
  },
});

// Function to send an email with appointment details and form link
export const sendAppointmentEmail = async (userEmail, appointmentId) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Appointment Confirmation and Details',
      html: `
        <p>Dear Patient,</p>
        <p>Thank you for booking your appointment with our hospital. Please click the link below to fill out the necessary pre-appointment form:</p>
        <p><a href="${process.env.FRONTEND_URL}/appointment-form/${appointmentId}" target="_blank">Fill Out Appointment Form on Our Website</a></p>
        <p>Alternatively, you can complete this form on Google Forms if you prefer:</p>
        <p><a href="https://docs.google.com/forms/d/e/1FAIpQLSeKXnDiGIg5SuHt482_y2d1Uej90PuaCQTvuDP3MlhILCT2Yw/viewform?usp=sf_link" target="_blank">Fill Out Appointment Form on Google Forms</a></p>
        <p>We look forward to seeing you!</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Appointment email sent successfully');
  } catch (error) {
    console.error('Error sending appointment email:', error);
  }
};
