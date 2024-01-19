import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  party: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  target: {
    type: String,
    required: true
  },
  entry: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    minlength: 0,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
})

const Payment = mongoose.model('payment', paymentSchema)
export { Payment } 
