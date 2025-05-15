import express from 'express';
import { listPharmacists, changePharmacistAvailability, loginPharmacist, appointmentsPharmacist, PharmacistProfile } from '../controllers/pharmacistController.js';
import  authPharmacist  from '../middlewares/authPharmacist.js';


const pharmacistRouter = express.Router();

// Route to add a new pharmacist

// Route to login a pharmacistnpm star
pharmacistRouter.post('/login', loginPharmacist);

pharmacistRouter.get("/profile", PharmacistProfile); // Protected route

// Route to get appointments for a pharmacist
pharmacistRouter.get('/appointments', authPharmacist, appointmentsPharmacist);
// Route to list all pharmacists
pharmacistRouter.get('/pharm-list', listPharmacists);

pharmacistRouter.put('/change-availability-pharmacist', changePharmacistAvailability)


export default pharmacistRouter;