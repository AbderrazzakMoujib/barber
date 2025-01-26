import Reservation from '../models/Reservation.js';

export const makeReservation = async (req, res) => {
  try {
    const { date, timeSlot, partySize } = req.body;
    
    // Validate input
    if (!date || !timeSlot || !partySize) {
      return res.status(400).json({ message: 'Missing reservation details' });
    }

    const formattedDate = new Date(date);
    
    // Set time to start and end of day for precise date matching
    const startOfDay = new Date(formattedDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(formattedDate.setHours(23, 59, 59, 999));

    // Check total daily reservations
    const totalSlots = 19;
    const dayReservations = await Reservation.find({
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (dayReservations.length >= totalSlots) {
      return res.status(400).json({ 
        message: 'All slots are full for this day',
        availableSlots: 0
      });
    }

    // Attempt to create reservation with unique constraint
    const reservation = new Reservation({
      user: req.user._id,
      date: startOfDay,
      timeSlot,
      partySize,
      contactPhone: req.user.phone
    });

    try {
      await reservation.save();
      return res.status(201).json(reservation);
    } catch (saveError) {
      // Handle potential duplicate key error
      if (saveError.code === 11000) {
        return res.status(400).json({ 
          message: 'This time slot is already booked',
          errorCode: 'SLOT_TAKEN'
        });
      }
      throw saveError;
    }

  } catch (error) {
    console.error('Reservation creation error:', error);
    return res.status(500).json({ 
      message: 'Reservation creation failed',
      error: error.message 
    });
  }
};

export const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .sort({ date: 'asc' });
    return res.status(200).json(reservations);
  } catch (error) {
    console.error('Error fetching user reservations:', error);
    return res.status(500).json({ message: 'Error fetching user reservations' });
  }
};

export const getWorkingDays = async (req, res) => {
  try {
    const { month, year } = req.query;

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const daysInMonth = endDate.getDate();
    const workingDays = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() !== 2) { // Only Tuesday (2) is a rest day
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

    if (!month || !year) {
      return res.status(400).json({ message: 'Month and year are required' });
    }

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    const currentDate = new Date();

    const pastReservations = await Reservation.find({
      date: {
        $gte: startDate,
        $lte: endDate,
        $lt: currentDate
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
    const { month, year, date } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const query = {
      date: {
        $gte: startDate,
        $lte: endDate
      }
    };

    if (date) {
      const specificDate = new Date(date);
      query.date = {
        $gte: new Date(specificDate.setHours(0,0,0,0)),
        $lt: new Date(specificDate.setHours(23,59,59,999))
      };
    }

    const reservations = await Reservation.find(query).populate({
      path: 'user',
      select: 'name phone' 
    });

    return res.status(200).json(reservations);
  } catch (error) {
    console.error('Fetching reservations error:', error);
    return res.status(500).json({ message: 'Error fetching reservations' });
  }
};

export const checkDayAvailability = async (req, res) => {
  try {
    const { date } = req.query;
    const formattedDate = new Date(date);

    const reservations = await Reservation.find({
      date: {
        $gte: new Date(formattedDate.setHours(0,0,0,0)),
        $lt: new Date(formattedDate.setHours(23,59,59,999))
      }
    });

    const totalSlots = 19;
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

    if (!id) {
      return res.status(400).json({ message: 'Reservation ID is required' });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this reservation' });
    }

    await Reservation.findByIdAndDelete(id);
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

    if (!id) {
      return res.status(400).json({ message: 'Reservation ID is required' });
    }

    const reservation = await Reservation.findById(id);

    if (!reservation) {
      return res.status(404).json({ message: 'Reservation not found' });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this reservation' });
    }

    if (timeSlot && timeSlot !== reservation.timeSlot) {
      const existingReservation = await Reservation.findOne({
        date: reservation.date,
        timeSlot: timeSlot,
        _id: { $ne: id }
      });

      if (existingReservation) {
        return res.status(400).json({ message: 'Selected time slot is already taken' });
      }
    }

    reservation.timeSlot = timeSlot || reservation.timeSlot;
    reservation.partySize = partySize || reservation.partySize;
    
    await reservation.save();
    return res.status(200).json(reservation);
  } catch (error) {
    console.error('Error updating reservation:', error);
    return res.status(500).json({ message: 'Error updating reservation' });
  }
};
