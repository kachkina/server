const { ObjectID } = require('mongodb');

const WordModel = require('../models/word');

const addWord = async (req, res, next) => {
  const { user } = req.session;
  const { text } = req.body;
  try {
    const word = new WordModel({ type: 'entered', text, user: new ObjectID(user.id) })
    const savedWord = await word.save();
    res.send({
      error: false, data: savedWord
    });
  } catch (err) {
    return next(err);
  }
};

const updateWord = async (req, res, next) => {
  const { user } = req.session;

  const { text, _id, type } = req.body;
  try {
    const wordForUpdate = await WordModel.findById(new ObjectID(_id));
    if (!wordForUpdate && wordForUpdate.user.toString() === user.id.toString()) {
      throw new Error('Not found')
    }
    if (text) {
      wordForUpdate.text = text;
    }
    
    wordForUpdate.type = type;
    const updatedWord = await wordForUpdate.save();
    updatedWord.id = updatedWord._id;
    delete updatedWord._id;
    res.send({
      error: false, data: updatedWord
    });
  } catch (err) {
    return next(err);
  }
};

const getWords = async (req, res, next) => {
  const { user } = req.session;
  const { type } = req.query;
  try {
    const words = await WordModel.find({ type, user: new ObjectID(user.id) });
    res.send({
      error: false, data: words
    });
  } catch (err) {
    return next(err);
  }
};

module.exports = { addWord, updateWord, getWords };
