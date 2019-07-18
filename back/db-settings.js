const isTest = process.env.NODE_ENV === 'test';
const suffix = isTest ? '_test' : '';

module.exports = {
  host: process.env.DB_HOST,
  database: process.env.DB_NAME + suffix,
  user: process.env.DB_USER,
  password: process.env.DB_PASS
};
