import mongoose from 'mongoose';

const reservationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      required: true,
    },
    partySize: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'canceled'],
      default: 'pending',
    },
    // Add phone field to store additional contact info if needed
    contactPhone: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

reservationSchema.index({ date: 1, timeSlot: 1 });
reservationSchema.index({ user: 1, status: 1 });

const Reservation = mongoose.model('Reservation', reservationSchema);
export default Reservation;