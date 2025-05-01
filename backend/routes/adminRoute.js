import express from 'express';
import upload from '../middlewares/multer.js';
import { addDoctor, addPharmacist, allDoctors, allPharmacists, loginAdmin, appointmentsAdmin, appointmentCancel, adminDashboard, archiveDoctor } from '../controllers/adminController.js';
import authAdmin from '../middlewares/authAdmin.js';
import { changeAvailability } from '../controllers/doctorController.js';
import { changePharmacistAvailability } from '../controllers/pharmacistController.js';

const adminRouter = express.Router();

// Route to add a doctor, applying multer middleware for image upload
adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor);
adminRouter.post('/add-pharmacist', authAdmin, upload.single('image'), addPharmacist);  // Ensure AddPharmacist is correctly imported
adminRouter.post('/login', loginAdmin);
adminRouter.get('/all-doctors', authAdmin, allDoctors);
adminRouter.get('/all-pharmacists', authAdmin, allPharmacists);
adminRouter.post('/change-availability', changeAvailability);
adminRouter.post("/doctors/:id/archive", authAdmin, archiveDoctor);
adminRouter.post('/change-availability-pharmacist', changePharmacistAvailability)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin);
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel);
adminRouter.get('/dashboard', authAdmin, adminDashboard);

export default adminRouter;