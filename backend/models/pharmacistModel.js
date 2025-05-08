import mongoose from "mongoose";

const pharmacistSchema = new mongoose.Schema(
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
      name: { type: String, required: true }, // Make sure branch name is required
      location: { type: String, required: true }, // Make sure branch location is required
    },
    date: { type: Number, required: true }, // Pharmacist registration date
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);

// Correct the model reference here
const pharmacistModel = mongoose.models.Pharmacist || mongoose.model("Pharmacist", pharmacistSchema);

export default pharmacistModel;