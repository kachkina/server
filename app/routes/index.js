const express = require('express');

const {  addWord, updateWord, getWords } = require('../controllers/words');

const { authMiddleware } = require('../utils/auth');

const router = express.Router();

// routes

router.post('/add', authMiddleware, addWord);
router.patch('/update', authMiddleware, updateWord);
router.get('/get', authMiddleware, getWords);


module.exports = router;
