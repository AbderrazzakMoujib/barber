// reservationController.js
import Reservation from '../models/Reservation.js';

export const makeReservation = async (req, res) => {
  try {
    const { date, timeSlot, partySize } = req.body;

    if (!date || !timeSlot || !partySize) {
      return res.status(400).json({ message: 'Please provide date, time slot, and party size' });
    }

    // Check if max reservations reached for the day
    const dayReservations = await Reservation.find({
      date: {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lt: new Date(date + 'T23:59:59.999Z')
      }
    });

    const totalSlots = 21; // Same as availableSlots length
    if (dayReservations.length >= totalSlots) {
      return res.status(400).json({ 
        message: 'All slots are full for this day. Please select another day.'
      });
    }

    const existingReservation = await Reservation.findOne({ date, timeSlot });
    if (existingReservation) {
      return res.status(400).json({ message: 'Time slot already reserved' });
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      date,
      timeSlot,
      partySize,
    });

    return res.status(201).json(reservation);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return res.status(500).json({ message: 'Error creating reservation' });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .sort({ date: 'asc' });
    return res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return res.status(500).json({ message: 'Error fetching reservations' });
  }
};

export const getWorkingDays = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const daysInMonth = endDate.getDate();
    const workingDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() !== 2 && day !== 0) { // Not Tuesday and not Sunday
        workingDays.push(day);
      }
    }

    res.json({ workingDays });
  } catch (error) {
    console.error('Error fetching working days:', error);
    res.status(500).json({ message: 'Error fetching working days' });
  }
};

export const getPastReservations = async (req, res) => {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const pastReservations = await Reservation.find({
      date: {
        $gte: startDate,
        $lte: endDate,
        $lt: new Date()
      }
    });

    const reservationDays = pastReservations.map(res => res.date.getDate());

    res.json({ reservations: reservationDays });
  } catch (error) {
    console.error('Error fetching past reservations:', error);
    res.status(500).json({ message: 'Error fetching past reservations' });
  }
};

export const getAllReservations = async (req, res) => {
  try {
    const { date } = req.query;
    const reservations = await Reservation.find({
      date: {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lt: new Date(date + 'T23:59:59.999Z')
      }
    }).populate('user', 'firstName name');
    return res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching all reservations:', error);
    return res.status(500).json({ message: 'Error fetching all reservations' });
  }
};

export const checkDayAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    
    // Get all reservations for the specified date
    const reservations = await Reservation.find({
      date: {
        $gte: new Date(date + 'T00:00:00.000Z'),
        $lt: new Date(date + 'T23:59:59.999Z')
      }
    });

    const totalSlots = 21; // Based on availableSlots array length
    const hasAvailability = reservations.length < totalSlots;

    res.json({ 
      hasAvailability,
      totalSlots,
      reservedSlots: reservations.length,
      remainingSlots: totalSlots - reservations.length
    });
  } catch (error) {
    console.error('Error checking day availability:', error);
    res.status(500).json({ message: 'Error checking day availability' });
  }
};

export const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if the reservation belongs to the logged-in user
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this reservation' });
    }

    await reservation.remove();
    return res.status(200).json({ message: 'Reservation deleted successfully' });
  } catch (error) {
    console.error('Error deleting reservation:', error);
    return res.status(500).json({ message: 'Error deleting reservation' });
  }
};

export const updateReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const { timeSlot, partySize } = req.body;

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    // Check if the reservation belongs to the logged-in user
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this reservation' });
    }

    // Check if the new time slot is already taken
    if (timeSlot && timeSlot !== reservation.timeSlot) {
      const existingReservation = await Reservation.findOne({
        date: reservation.date,
        timeSlot: timeSlot
      });

      if (existingReservation) {
        return res.status(400).json({ message: 'Selected time slot is already taken' });
      }
    }

    // Update the reservation
    reservation.timeSlot = timeSlot || reservation.timeSlot;
    reservation.partySize = partySize || reservation.partySize;
    
    await reservation.save();
    return res.status(200).json(reservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return res.status(500).json({ message: 'Error updating reservation' });
  }
};

export default {
  makeReservation,
  getUserReservations,
  getWorkingDays,
  getPastReservations,
  getAllReservations,
  checkDayAvailability,
  deleteReservation,
  updateReservation
};