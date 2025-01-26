import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  timeSlot: {
    type: String,
    required: true,
    enum: [
      "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
      "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
      "19:00", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"
    ]
  },
  partySize: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  contactPhone: {
    type: String,
    required: true
  }
}, { 
  timestamps: true 
});

// Unique compound index to prevent duplicate reservations
ReservationSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

const Reservation = mongoose.model('Reservation', ReservationSchema);

export default Reservation;