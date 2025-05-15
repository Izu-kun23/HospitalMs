import express from 'express';
import { listPharmacists, changePharmacistAvailability, loginPharmacist, appointmentsPharmacist, getPharmacistProfile, updatePharmacistProfile } from '../controllers/pharmacistController.js';
import  authPharmacist  from '../middlewares/authPharmacist.js';


const pharmacistRouter = express.Router();

// Route to add a new pharmacist

// Route to login a pharmacistnpm star
pharmacistRouter.post('/login', loginPharmacist);
// Route to get appointments for a pharmacist
pharmacistRouter.get('/appointments', authPharmacist, appointmentsPharmacist);
// Route to list all pharmacists
pharmacistRouter.get('/pharm-list', listPharmacists);

pharmacistRouter.put('/change-availability-pharmacist', changePharmacistAvailability);

// Route to update pharmacist profile
// Routes file (e.g., routes/pharmacistRouter.js)
pharmacistRouter.get('/profile', authPharmacist, getPharmacistProfile);

pharmacistRouter.post("/update-profile", authPharmacist, updatePharmacistProfile);

export default pharmacistRouter;