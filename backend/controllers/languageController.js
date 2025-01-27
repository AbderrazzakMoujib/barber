// controllers/languageController.js
import asyncHandler from 'express-async-handler';

// @desc    Set user language preference
// @route   POST /api/language/set
// @access  Public
export const setLanguage = asyncHandler(async (req, res) => {
    const { language } = req.body;
    
    // Validate language code
    const validLanguages = ['ar', 'fr', 'en'];
    if (!validLanguages.includes(language)) {
        res.status(400);
        throw new Error('Invalid language code');
    }

    // Store in cookie with 30 days expiration
    res.cookie('preferredLanguage', language, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
    });

    res.status(200).json({
        success: true,
        language
    });
});

// @desc    Get user language preference
// @route   GET /api/language/get
// @access  Public
export const getLanguage = asyncHandler(async (req, res) => {
    const language = req.cookies.preferredLanguage || 'fr'; // Default to French
    
    res.status(200).json({
        language
    });
});