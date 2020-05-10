const express = require('express');

const { register, login, logout, getStatus } = require('../controllers/auth');
const { authMiddleware } = require('../utils/auth');

const router = express.Router();

// routes

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/status', authMiddleware, getStatus);


module.exports = router;
