import express from 'express';
import {
  getProfile,
  loginUser,
  registerUser,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentStripe,
  verifyStripe,
  pharmAppointment,
  bookPharmAppointment,
} from '../controllers/userController.js';

import authUser from '../middlewares/authUser.js';
import upload from '../middlewares/multer.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/get-profile', authUser, getProfile);
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile);
userRouter.post('/book-appointment', authUser, bookAppointment);
userRouter.get('/appointments', authUser, listAppointment);
userRouter.get('/pharm-appointment', authUser, pharmAppointment);
userRouter.post('/book-pharm-appointment', authUser, bookPharmAppointment);
userRouter.post('/cancel-appointment', authUser, cancelAppointment);
userRouter.post('/payment-stripe', authUser, paymentStripe);
userRouter.post('/verifyStripe', authUser, verifyStripe);

export default userRouter;