import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";


// API for doctor Login 
const loginDoctor = async (req, res) => {

    try {
        const { email, password } = req.body
        const doctor = await doctorModel.findOne({ email })

        if (!doctor) {
            return res.json({ success: false, message: "Invalid credentials" })
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }


    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
const appointmentsDoctor = async (req, res) => {
    try {

        const { docId } = req.body
        const appointments = await appointmentModel.find({ docId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to cancel appointment for doctor panel
const appointmentCancel = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })
            return res.json({ success: true, message: 'Appointment Cancelled' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to mark appointment completed for doctor panel
const appointmentComplete = async (req, res) => {
    try {

        const { docId, appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)
        if (appointmentData && appointmentData.docId === docId) {
            await appointmentModel.findByIdAndUpdate(appointmentId, { isCompleted: true })
            return res.json({ success: true, message: 'Appointment Completed' })
        }

        res.json({ success: false, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all doctors list for Frontend
const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password', '-email'])
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}


// API to change doctor availablity for Admin and Doctor Panel
const changeAvailability = async (req, res) => {
    try {
      const { docId } = req.body; // Make sure docId is in the request body
  
      // Check if docId is provided in the request
      if (!docId) {
        return res.status(400).json({
          success: false,
          message: "Doctor ID is required.",
        });
      }
  
      // Find the doctor by ID
      const doctor = await doctorModel.findById(docId);
  
      // If the doctor is not found, return an error
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: "Doctor not found.",
        });
      }
  
      // Toggle the availability status
      doctor.available = !doctor.available;
      await doctor.save();
  
      // Send success response
      res.status(200).json({
        success: true,
        message: "Doctor availability updated successfully.",
        doctor, // You can return updated doctor data if needed
      });
    } catch (error) {
      console.error("Error in changeAvailability:", error);
      res.status(500).json({
        success: false,
        message: "An error occurred while updating availability.",
      });
    }
  };

// appointment accepting
const acceptAppointment = async (req, res) => {
    try {
      const { appointmentId } = req.body; // Ensure the request body contains `appointmentId`
  
      // Find the appointment and update the `accepted` status
      const appointment = await appointmentModel.findByIdAndUpdate(
        appointmentId,
        { accepted: true },
        { new: true } // Return the updated document
      );
  
      if (!appointment) {
        return res.status(404).json({ success: false, message: "Appointment not found." });
      }
  
      // Respond with the updated appointment
      res.status(200).json({
        success: true,
        message: "Appointment accepted successfully.",
        appointment,
      });
    } catch (error) {
      console.error("Error accepting appointment:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error. Please try again later.",
      });
    }
  };

// API to get doctor profile for  Doctor Panel
const doctorProfile = async (req, res) => {
    try {

        const { docId } = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// // API to update doctor profile data from  Doctor Panel
const updateDoctorProfile = async (req, res) => {
    try {

        const { docId, fees, address, available } = req.body

        await doctorModel.findByIdAndUpdate(docId, { fees, address, available })

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// // API to get dashboard data for doctor panel
const doctorDashboard = async (req, res) => {
    try {

        const { docId } = req.body

        const appointments = await appointmentModel.find({ docId })

        let earnings = 0

        appointments.map((item) => {
            if (item.isCompleted || item.payment) {
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })



        const dashData = {
            earnings,
            appointments: appointments.length,
            patients: patients.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export {
    loginDoctor,
    appointmentsDoctor,
    appointmentCancel,
    doctorList,
    changeAvailability, // This must match the function name exactly
    appointmentComplete,
    doctorDashboard,
    doctorProfile,
    acceptAppointment,
    updateDoctorProfile
};