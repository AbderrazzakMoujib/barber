// reservationRoutes.js
import express from 'express';
import { 
  makeReservation, 
  getUserReservations, 
  getWorkingDays, 
  getPastReservations, 
  getAllReservations,
  checkDayAvailability 
} from '../controllers/reservationController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, makeReservation);
router.get('/myreservations', protect, getUserReservations);
router.get('/working-days', getWorkingDays);
router.get('/past-reservations', getPastReservations);
router.get('/all', protect, getAllReservations);
router.get('/day-availability', checkDayAvailability);

export default router;