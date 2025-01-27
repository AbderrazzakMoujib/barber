// routes/languageRoutes.js
import express from 'express';
import { setLanguage, getLanguage } from '../controllers/languageController.js';

const router = express.Router();

router.post('/set', setLanguage);
router.get('/get', getLanguage);

export default router;