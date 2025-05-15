import express from 'express';
import {
  loginDoctor,
  appointmentsDoctor,
  appointmentCancel,
  doctorList,
  changeAvailability,
  appointmentComplete,
  doctorDashboard,
  doctorProfile,
  updateDoctorProfile,
  acceptAppointment,  // <-- New controller for accepting appointments
} from '../controllers/doctorController.js';
import authDoctor from '../middlewares/authDoctor.js';

const doctorRouter = express.Router();

// Doctor login
doctorRouter.post("/login", loginDoctor);

// Fetch appointments for the doctor
doctorRouter.get("/appointments", authDoctor, appointmentsDoctor);

// Cancel an appointment
doctorRouter.post("/cancel-appointment", authDoctor, appointmentCancel);

// Accept an appointment
doctorRouter.post('/accept-appointment', authDoctor, acceptAppointment);

// Doctor list
doctorRouter.get("/list", doctorList);

// Change doctor's availability (better suited as a PUT request with doctorId in params)
doctorRouter.put("/change-availability", authDoctor, changeAvailability);
// Mark appointment as completed
doctorRouter.post("/complete-appointment", authDoctor, appointmentComplete);

// Doctor dashboard
doctorRouter.get("/dashboard", authDoctor, doctorDashboard);

// View doctor's profile
doctorRouter.get("/profile", authDoctor, doctorProfile);

// Update doctor's profile
doctorRouter.post("/update-profile", authDoctor, updateDoctorProfile);

export default doctorRouter;