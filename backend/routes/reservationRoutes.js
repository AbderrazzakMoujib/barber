import express from 'express';
import {
  makeReservation,
  getUserReservations,
  getWorkingDays,
  getPastReservations,
  getAllReservations,
  checkDayAvailability,
  deleteReservation,
  updateReservation,
} from '../controllers/reservationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/working-days', getWorkingDays);
router.get('/past-reservations', getPastReservations);
router.get('/day-availability', checkDayAvailability);

// Protected routes
router.use(protect);
router.post('/', makeReservation);
router.get('/myreservations', getUserReservations);
router.get('/all', getAllReservations);
router.delete('/:id', deleteReservation);
router.put('/:id', updateReservation);

export default router;
