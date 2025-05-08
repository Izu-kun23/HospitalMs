import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pharmacistModel from "../models/pharmacistModel.js";
import appointmentModel from "../models/appointmentModel.js";



// Add a new pharmacist


// List all pharmacists
export const listPharmacists = async (req, res) => {
    try {
        const pharmacists = await pharmacistModel.find(); // Fetch all pharmacists
        res.status(200).json({
            success: true,
            pharmacists,
        });
    } catch (error) {
        console.error("Error listing pharmacists:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching pharmacists. Please try again later.",
        });
    }
};

// API to change pharmacist availability for Admin
const changePharmacistAvailability = async (req, res) => {
    try {
        const { pharmacistId } = req.body;

        if (!pharmacistId) {
            return res.status(400).json({
                success: false,
                message: "Pharmacist ID is required.",
            });
        }

        // Find the pharmacist by ID
        const pharmacist = await pharmacistModel.findById(pharmacistId);

        if (!pharmacist) {
            return res.status(404).json({
                success: false,
                message: "Pharmacist not found.",
            });
        }

        // Toggle availability
        pharmacist.available = !pharmacist.available;
        await pharmacist.save();

        res.status(200).json({
            success: true,
            message: "Pharmacist availability updated successfully.",
            pharmacist,
        });
    } catch (error) {
        console.error("Error in changePharmacistAvailability:", error);
        res.status(500).json({
            success: false,
            message: "An error occurred while updating pharmacist availability.",
        });
    }
};

// Login a pharmacist
export const loginPharmacist = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if pharmacist exists
        const pharmacist = await pharmacistModel.findOne({ email });
        if (!pharmacist) {
            return res.status(400).json({
                success: false,
                message: "Pharmacist with this email does not exist.",
            });
        }

        // Compare the password with the stored hash
        const isMatch = await bcrypt.compare(password, pharmacist.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid credentials. Please try again.",
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: pharmacist._id, email: pharmacist.email },
            process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your environment variables
            { expiresIn: '1h' } // Token expiry time (1 hour in this case)
        );

        res.status(200).json({
            success: true,
            message: "Login successful.",
            token, // Send the JWT token to the client
        });
    } catch (error) {
        console.error("Error logging in pharmacist:", error);
        res.status(500).json({
            success: false,
            message: "Error logging in pharmacist. Please try again later.",
        });
    }
};

// API to get all appointments for pharmacist
export const pharmAppointment = async (req, res) => {
    try {

        const { pharmacistId } = req.body
        const appointments = await appointmentModel.find({ pharmacistId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
// Fetch pharmacist profile

export const PharmacistProfile = async (req, res) => {
    try {

        const { pharmacistId } = req.body
        const profileData = await pharmacistModel.findById(pharmacistId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
  

export { changePharmacistAvailability }; // Export the function for availability change