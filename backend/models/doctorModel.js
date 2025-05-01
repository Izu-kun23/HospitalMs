import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: true },
    speciality: { type: String, required: true },
    degree: { type: String, required: true },
    experience: { type: String, required: true },
    about: { type: String, required: true },
    available: { type: Boolean, default: true },
    fees: { type: Number, required: true },
    slots_booked: { type: Object, default: {} },
    branch: {
      name: { type: String}, // Required field for branch name
      location: { type: String}, // Required field for branch location
    },
    date: { type: Number, required: true }, // It seems like the 'date' field is related to a timestamp, like the doctor's registration date or availability, etc.
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

const doctorModel = mongoose.models.Doctor || mongoose.model("Doctor", doctorSchema);

export default doctorModel;