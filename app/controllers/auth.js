const jwt = require('jsonwebtoken');
const { ObjectID } = require('mongodb')
const {
  verifyPassword,
  hashPassword,
} = require('../utils/auth');
const UserModel = require('../models/user');
const CustomError = require('../utils/error');

const register = async (req, res, next) => {
  const params = req.body;
  try {
    const user = await UserModel.findOne({ email: params.email }, '_id state name')
      .catch(err => { console.error(`${methodName} - Mongodb error: ${err}`); throw err; });
    const password = await new Promise((resolve, reject) => {
      hashPassword(params.password, (error, pass) => {
        if (error) {
          return reject(error);
        }
        return resolve(pass);
      });
    }).catch(error => { throw error; });
    const userData = {
      email: params.email,
      password,
    };
    const newUser = new UserModel(userData);
    const savedUser = await newUser.save()
      .catch(err => { console.error(`${methodName} - Mongodb error: ${err}`); throw err; });
    res.status(200).send({ error: false, data: { email: savedUser.email }, message: 'User created' });
    return next();
  } catch (err) {
    return next(err);
  }
};


const login = async (req, res, next) => {
  const params = req.body;
  try {
    const user = await UserModel.findOne({ email: params.email }).populate({
      path: 'groups',
      select: 'title',
    }).catch(err => { console.error(`${methodName} - Mongodb error: ${err}`); throw err; });
    const verifiedPass = await new Promise((resolve, reject) => {
      verifyPassword(req.body.password, user.password, (error, verified) => {
        if (error) { throw error; }
        if (verified) {
          return resolve(true);
        }
        return resolve(false);
      });
    });
    if (!verifiedPass) {
        throw new CustomError('Invalid email or password', 401)
    }
    const payload = {
      id: user.id,
    };
    const expireTime = 30 * 86400;

    const token = jwt.sign(payload, '1234', { expiresIn: expireTime });
    user.token = token;
    req.session.user = {
      id: user._id,
      token: user.token,
      email: user.email,
    };

    console.log(req.session)
    res.send({
      error: false,
      message: 'USER_LOGGED_IN',
      data: { email: user.email },
    });
    return next();
  } catch (err) {
    return next(err);
  }
};

const logout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('sessionId');
    res.send({ error: false, message: 'USER_LOGGED_OUT' });
    return next();
  });
};

const getStatus = async (req, res, next) => {
    const { user } = req.session;
    try {
      const userObj = user && await UserModel.findById(new ObjectID(user.id))
        .catch(err => { console.error(`${methodName} - Mongodb error: ${err}`); throw err; });
      if (!userObj) {
        const errorMessage = 'USER_NOT_FOUND';
        throw new CustomError(errorMessage, 404);
      }
  
      res.send({ error: false, data: { email: userObj.email } });
      return next();
    } catch (err) {
      return next(err);
    }
  };


module.exports = {
  register,
  login,
  logout,
  getStatus,
};
