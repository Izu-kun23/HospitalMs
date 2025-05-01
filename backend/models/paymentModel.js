// import mongoose from 'mongoose';

// const paymentSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // Reference to the User collection
//     required: true,
//   },
//   userName: {
//     type: String,
//     required: true,
//   },
//   amount: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   date: {
//     type: Date,
//     default: Date.now,
//   },
//   status: {
//     type: String,
//     enum: ['Pending', 'Completed', 'Failed'], // Restrict to specific values
//     default: 'Pending',
//   },
//   method: {
//     type: String,
//     enum: ['Stripe', 'Cash'], // Example methods
//     required: true,
//   },
// });

// const paymentModel = mongoose.model('Payment', paymentSchema);
// export default paymentModel;