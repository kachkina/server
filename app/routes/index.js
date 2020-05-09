const express = require('express');

const {  addWord, updateWord, getWords } = require('../controllers/words');

const router = express.Router();

// routes

router.post('/add', addWord);
router.patch('/update', updateWord);
router.get('/get', getWords);


module.exports = router;
