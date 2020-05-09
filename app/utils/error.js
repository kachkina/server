module.exports = class CustomError extends Error {
  constructor(message, code, key) {
    super(message);
    this.key = key || null;
    this.statusCode = code;
  }
};
