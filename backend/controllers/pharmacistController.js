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
// In your controller (pharmacistController.js)

const appointmentsPharmacist = async (req, res) => {
    try {
        const pharmacistId = req.user.id; // ensure your authPharmacist middleware sets this
        const appointments = await appointmentModel.find({ pharmacistId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.error("Error fetching pharmacist appointments:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const PharmacistProfile = async (req, res) => {
    try {
        // Use req.user._id which was added by your authentication middleware
        const pharmacistId = req.user._id;

        // Find the pharmacist profile based on the pharmacistId
        const profileData = await pharmacistModel.findById(pharmacistId).select('-password'); // Exclude password field

        // If no profile is found, return an error
        if (!profileData) {
            return res.status(404).json({ success: false, message: "Pharmacist not found." });
        }

        res.json({ success: true, profileData });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "An error occurred while fetching profile data." });
    }
}
  

export { changePharmacistAvailability, appointmentsPharmacist }; // Export the function for availability change