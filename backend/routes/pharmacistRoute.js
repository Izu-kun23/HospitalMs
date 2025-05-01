import express from 'express';
import { addPharmacist, listPharmacists, changePharmacistAvailability, loginPharmacist, PharmacistProfile } from '../controllers/pharmacistController.js';


const pharmRouter = express.Router();

// Route to add a new pharmacist
pharmRouter.post('/', addPharmacist);

// Route to login a pharmacist
pharmRouter.post('/login', loginPharmacist);

pharmRouter.get("/profile", PharmacistProfile); // Protected route


// Route to list all pharmacists
pharmRouter.get('/pharm-list', listPharmacists);

pharmRouter.put('/change-availability-pharmacist', changePharmacistAvailability)


export default pharmRouter;