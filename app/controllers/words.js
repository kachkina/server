const { ObjectID } = require('mongodb');

const WordModel = require('../models/word');

const addWord = async (req, res, next) => {
  const { text } = req.body;
  try {
    const word = new WordModel({ type: 'entered', text })
    const savedWord = await word.save();
    res.send({
      error: false, data: savedWord
    });
  } catch (err) {
    return next(err);
  }
};

const updateWord = async (req, res, next) => {
  const { text, _id, type } = req.body;
  try {
    const wordForUpdate = await WordModel.findById(new ObjectID(_id));
    if (!wordForUpdate) {
      throw new Error('Not found')
    }

    wordForUpdate.text = text;
    wordForUpdate.type = type;
    const updatedWord = wordForUpdate.save();
    res.send({
      error: false, data: updatedWord
    });
  } catch (err) {
    return next(err);
  }
};

const getWords = async (req, res, next) => {
  const { type, limit } = req.query;
  try {
    const words = await WordModel.find({ type }).limit(+limit);
    res.send({
      error: false, data: words
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { addWord, updateWord, getWords };
