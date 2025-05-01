import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { 
    type: String, 
    required: function() { return !this.pharmacistId; } // Required if pharmacistId is missing
  },
  pharmacistId: { 
    type: String, 
    required: function() { return !this.docId; } // Required if docId is missing
  },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object }, // Optional for pharmacists
  pharmacistData: { type: Object }, // Optional for doctors
  amount: { type: Number, required: true },
  date: { type: Number, required: true },
  accepted: { type: Boolean, default: false },
  cancelled: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
});

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;