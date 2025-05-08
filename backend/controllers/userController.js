// ... [your imports remain unchanged]
import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import stripe from "stripe";
import qrcode from "qrcode";
import nodemailer from "nodemailer";
import pharmacistModel from "../models/pharmacistModel.js";

const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateQRCode = async (appointmentId) => {
  const googleFormLink = `https://docs.google.com/forms/d/e/1FAIpQLSeKXnDiGIg5SuHt482_y2d1Uej90PuaCQTvuDP3MlhILCT2Yw/viewform?usp=sf_link&entry.1234567890=${appointmentId}`; 
  try {
    const qrCodeDataUrl = await qrcode.toDataURL(googleFormLink);
    return qrCodeDataUrl;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};

const sendConfirmationEmail = async (userEmail, userName, docName, appointmentId, slotDate, slotTime) => {
  try {
    const qrCodeImage = await generateQRCode(appointmentId);
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Appointment Confirmation and QR Code',
      html: `
        <h2>Appointment Payment Confirmed</h2>
        <p>Dear ${userName},</p>
        <p>Your payment for the appointment with Dr. ${docName} has been confirmed.</p>
        <p>Date: ${slotDate}</p>
        <p>Time: ${slotTime}</p>
        <p>Please scan the attached QR code to access the pre-appointment form.</p>
      `,
      attachments: [
        {
          filename: 'appointment-qr-code.png',
          content: qrCodeImage.split(",")[1],
          encoding: 'base64',
        },
      ],
    };
    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent successfully with QR code');
  } catch (error) {
    console.error('Error sending confirmation email:', error);
  }
};

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a stronger password" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await new userModel({ name, email, password: hashedPassword }).save();
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.json({ success: false, message: "User does not exist" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ success: true, token });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender, branch } = req.body;
    const imageFile = req.file;
    if (!name || !phone || !dob || !gender || !branch) {
      return res.json({ success: false, message: "Data Missing" });
    }
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });
    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      await userModel.findByIdAndUpdate(userId, { image: imageUpload.secure_url });
    }
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Book Doctor Appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;
    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({ success: false, message: 'Doctor Not Available' });
    }
    let slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: 'Slot Not Available' });
    }
    slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime];
    const userData = await userModel.findById(userId).select("-password");
    const appointment = new appointmentModel({
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now()
    });
    await appointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: 'Appointment Booked' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Book Pharmacist Appointment
const bookPharmAppointment = async (req, res) => {
  try {
    const { userId, pharmacistId, slotDate, slotTime } = req.body;

    const pharmData = await pharmacistModel.findById(pharmacistId).select("-password");
    if (!pharmData || !pharmData.available) {
      return res.json({ success: false, message: "Pharmacist Not Available" });
    }

    let slots_booked = pharmData.slots_booked || {};
    if (slots_booked[slotDate]?.includes(slotTime)) {
      return res.json({ success: false, message: "Slot Not Available" });
    }

    // Update booked slots
    slots_booked[slotDate] = [...(slots_booked[slotDate] || []), slotTime];

    const userData = await userModel.findById(userId).select("-password");

    const appointment = new appointmentModel({
      userId,
      pharmacistId,
      userData: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
      },
      pharmacistData: {
        name: pharmData.name,
        image: pharmData.image,
        branch: pharmData.branch,
        speciality: pharmData.speciality,
      },
      amount: pharmData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    });

    await appointment.save();
    await pharmacistModel.findByIdAndUpdate(pharmacistId, { slots_booked });

    res.json({ success: true, message: "Pharmacist Appointment Booked" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// View Pharmacist Appointments (dummy)
const pharmAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment) return res.json({ success: false, message: "Appointment not found." });
    if (appointment.cancelled) return res.json({ success: false, message: "Already cancelled." });
    appointment.cancelled = true;
    await appointment.save();
    res.json({ success: true, message: "Appointment cancelled." });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { origin } = req.headers;
    const appointment = await appointmentModel.findById(appointmentId);
    if (!appointment || appointment.cancelled || !appointment.accepted) {
      return res.json({ success: false, message: "Invalid or unaccepted appointment" });
    }
    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&appointmentId=${appointment._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointment._id}`,
      line_items: [{
        price_data: {
          currency: process.env.CURRENCY.toLowerCase(),
          product_data: { name: "Appointment Fees" },
          unit_amount: appointment.amount * 100,
        },
        quantity: 1,
      }],
      mode: "payment",
    });
    res.json({ success: true, session_url: session.url });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyStripe = async (req, res) => {
  try {
    const { appointmentId, success } = req.body;
    if (success === "true") {
      await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
      const appointmentDetails = await appointmentModel.findById(appointmentId).populate('docId', 'name');
      await sendConfirmationEmail(
        appointmentDetails.userData.email,
        appointmentDetails.userData.name,
        appointmentDetails.docData.name,
        appointmentId,
        appointmentDetails.slotDate,
        appointmentDetails.slotTime
      );
      return res.json({ success: true, message: 'Payment Successful and Email Sent' });
    }
    res.json({ success: false, message: 'Payment Failed' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  bookAppointment,
  bookPharmAppointment,
  pharmAppointment,
  listAppointment,
  cancelAppointment,
  paymentStripe,
  verifyStripe,
};   