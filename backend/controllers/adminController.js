import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import pharmacistModel from "../models/pharmacistModel.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login attempt:', email, password);
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '24h' });
            console.log('Token generated:', token);
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: "Invalid credentials" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        res.json({ success: true, appointments });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        res.json({ success: true, message: 'Appointment Cancelled' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for adding Doctor
const addDoctor = async (req, res) => {
    try {
        const { name, email, password, speciality, degree, experience, about, fees, branch } = req.body;
        const imageFile = req.file;

        // Checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !branch) {
            return res.json({ success: false, message: "Missing Details" });
        }

        // Validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10); // The more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            branch: JSON.parse(branch),
            date: Date.now()
        };

        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();
        res.json({ success: true, message: 'Doctor Added' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API for adding Pharmacist
const addPharmacist = async (req, res) => {
    try {
        const { name, email, password, experience, fees, about, speciality, degree, branch } = req.body;
        const imageFile = req.file;

        // Ensure all required fields are provided
        if (!name || !email || !password || !experience || !fees || !about || !speciality || !degree || !branch || !imageFile) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Hash the pharmacist password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        // If branch is passed as a string, parse it; if it's already an object, use it directly
        let parsedBranch = branch;
        if (typeof branch === 'string') {
            try {
                parsedBranch = JSON.parse(branch);
            } catch (error) {
                return res.status(400).json({ success: false, message: 'Invalid branch data format. Ensure "branch" is a valid JSON object.' });
            }
        }

        // Create the pharmacist instance
        const newPharmacist = new pharmacistModel({
            name,
            email,
            password: hashedPassword,
            image: imageUrl,
            experience,
            fees,
            about,
            speciality,
            degree,
            branch: parsedBranch,
            date: new Date(),  // Use current Date object
        });

        // Save the pharmacist to the database
        await newPharmacist.save();
        res.status(201).json({ success: true, message: 'Pharmacist added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to add pharmacist. Please try again later.' });
    }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password');
        res.json({ success: true, doctors });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// API to get all pharmacists list for admin panel
const allPharmacists = async (req, res) => {
    try {
        // Fetching all pharmacists from the database while excluding the password field
        const pharmacists = await pharmacistModel.find({}).select('-password');

        // Sending a successful response with the list of pharmacists
        return res.status(200).json({
            success: true,
            message: "Pharmacists fetched successfully",
            pharmacists, // The fetched pharmacists list
        });
    } catch (error) {
        console.log(error);

        // Sending an error response with the error message
        return res.status(500).json({
            success: false,
            message: "Error fetching pharmacists. Please try again later.",
        });
    }
};


// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});
        const appointments = await appointmentModel.find({});

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        };

        res.json({ success: true, dashData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Archive Doctor
const archiveDoctor = async (req, res) => {
    try {
        const docId = req.params.id;

        // Find doctor by ID
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Mark the doctor as archived (assuming you have an 'archived' field)
        doctor.archived = true;
        await doctor.save();

        res.status(200).json({ success: true, message: "Doctor archived successfully", doctor });
    } catch (error) {
        console.error("Error archiving doctor:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export {
    loginAdmin,
    appointmentsAdmin,
    appointmentCancel,
    addDoctor,
    addPharmacist,
    allDoctors,
    allPharmacists,
    adminDashboard,
    archiveDoctor
};