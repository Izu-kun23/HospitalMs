import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import stripe from "stripe";
import bwipJs from 'bwip-js';
import qrcode from 'qrcode'
import nodemailer from "nodemailer";
import pharmacistModel from "../models/pharmacistModel.js";

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateQRCode = async (appointmentId) => {
    // Replace `entry.1234567890` with the correct entry parameter ID from your Google Form
    const googleFormLink = `https://docs.google.com/forms/d/e/1FAIpQLSeKXnDiGIg5SuHt482_y2d1Uej90PuaCQTvuDP3MlhILCT2Yw/viewform?usp=sf_link&entry.1234567890=${appointmentId}`; 
    try {
      const qrCodeDataUrl = await qrcode.toDataURL(googleFormLink);
      return qrCodeDataUrl;
    } catch (error) {
      throw new Error("Failed to generate QR code");
    }
  };
  

// Function to send confirmation email with QR code
const sendConfirmationEmail = async (userEmail, userName, docName, appointmentId, slotDate, slotTime) => {
    try {
      // Generate QR code image as a data URL
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
          <p>Please scan the attached QR code to access the pre-appointment form on Google Forms. Show this QR code upon arrival at the hospital for check-in.</p>
          <p>Thank you for choosing our service!</p>
        `,
        attachments: [
          {
            filename: 'appointment-qr-code.png',
            content: qrCodeImage.split(",")[1], // Extract base64 content
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

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body; // Removed 'branch' from destructuring

    // Validate required fields
    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    // Validate password strength
    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a stronger password" });
    }

    // Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Prepare user data without branch
    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    // Save new user
    const newUser = new userModel(userData);
    const user = await newUser.save();

    // Generate a JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to get user profile
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to update user profile
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
      // Upload image to Cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to book appointment 
const bookAppointment = async (req, res) => {

  try {

      const { userId, docId, slotDate, slotTime } = req.body
      const docData = await doctorModel.findById(docId).select("-password")

      if (!docData.available) {
          return res.json({ success: false, message: 'Doctor Not Available' })
      }

      let slots_booked = docData.slots_booked

      // checking for slot availablity 
      if (slots_booked[slotDate]) {
          if (slots_booked[slotDate].includes(slotTime)) {
              return res.json({ success: false, message: 'Slot Not Available' })
          }
          else {
              slots_booked[slotDate].push(slotTime)
          }
      } else {
          slots_booked[slotDate] = []
          slots_booked[slotDate].push(slotTime)
      }

      const userData = await userModel.findById(userId).select("-password")

      delete docData.slots_booked

      const appointmentData = {
          userId,
          docId,
          userData,
          docData,
          amount: docData.fees,
          slotTime,
          slotDate,
          date: Date.now()
      }

      const newAppointment = new appointmentModel(appointmentData)
      await newAppointment.save()

      // save new slots data in docData
      await doctorModel.findByIdAndUpdate(docId, { slots_booked })

      res.json({ success: true, message: 'Appointment Booked' })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }

}

// API to book an appointment with a pharmacist
const bookPharmAppointment = async (req, res) => {
  try {
    const { userId, pharmacistId, slotDate, slotTime } = req.body;
    const pharmData = await pharmacistModel.findById(pharmacistId).select("-password");

    if (!pharmData || !pharmData.available) {
      return res.json({ success: false, message: "Pharmacist Not Available" });
    }

    let slots_booked = pharmData.slots_booked || {};

    // Check if slot is available
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot Not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    const userData = await userModel.findById(userId).select("-password");

    const appointmentData = {
      userId,
      pharmacistId,
      userData,
      pharmData,
      amount: pharmData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // Update pharmacist's booked slots
    await pharmacistModel.findByIdAndUpdate(pharmacistId, { slots_booked });

    res.json({ success: true, message: "Pharmacist Appointment Booked" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ success: false, message: "Appointment ID is required." });
    }

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.status(404).json({ success: false, message: "Appointment not found." });
    }

    if (appointment.cancelled) {
      return res.status(400).json({ success: false, message: "Appointment is already cancelled." });
    }

    appointment.cancelled = true;
    await appointment.save();

    res.status(200).json({ success: true, message: "Appointment cancelled successfully.", appointment });
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
  try {
      const { userId } = req.body
      const appointments = await appointmentModel.find({ userId })

      res.json({ success: true, appointments })

  } catch (error) {
      console.log(error)
      res.json({ success: false, message: error.message })
  }
}

const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { origin } = req.headers;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancelled) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    // Check if appointment is accepted
    if (!appointmentData.accepted) {
      return res.json({
        success: false,
        message: "Appointment not accepted by the doctor yet.",
      });
    }

    const currency = process.env.CURRENCY.toLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: "Appointment Fees",
          },
          unit_amount: appointmentData.amount * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// API to verify Stripe payment and send confirmation email after successful payment
const verifyStripe = async (req, res) => {
    try {
      const { appointmentId, success } = req.body;
  
      if (success === "true") {
        // Mark the appointment as paid
        await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
  
        // Fetch appointment details for email
        const appointmentDetails = await appointmentModel.findById(appointmentId).populate('docId', 'name');
        const userEmail = appointmentDetails.userData.email;
        const userName = appointmentDetails.userData.name;
        const docName = appointmentDetails.docData.name;
        const slotDate = appointmentDetails.slotDate;
        const slotTime = appointmentDetails.slotTime;
  
        // Send confirmation email with QR code
        await sendConfirmationEmail(userEmail, userName, docName, appointmentId, slotDate, slotTime);
  
        return res.json({ success: true, message: 'Payment Successful and confirmation email sent' });
      }
  
      res.json({ success: false, message: 'Payment Failed' });
    } catch (error) {
      console.log(error);
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
    listAppointment,
    cancelAppointment,
    paymentStripe,
    verifyStripe,
  };