import express from 'express';
import { listPharmacists, changePharmacistAvailability, loginPharmacist, pharmAppointment, PharmacistProfile } from '../controllers/pharmacistController.js';
import authPharmacist from '../middlewares/authPharmacist.js';


const pharmRouter = express.Router();

// Route to add a new pharmacist

// Route to login a pharmacistnpm star
pharmRouter.post('/login', loginPharmacist);

pharmRouter.get("/profile", PharmacistProfile); // Protected route

pharmRouter.get('/pharm-appointment', authPharmacist, pharmAppointment);



// Route to list all pharmacists
pharmRouter.get('/pharm-list', listPharmacists);

pharmRouter.put('/change-availability-pharmacist', changePharmacistAvailability)


export default pharmRouter;