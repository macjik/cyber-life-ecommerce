require('dotenv').config();
const pg = require('pg');

module.exports = {
  development: {
    url: process.env.DB_URL,
    dialect: 'postgres',
    dialectModule: pg,
  },
  test: {
    url: process.env.DB_URL,
    dialect: 'postgres',
    dialectModule: pg,
  },
  production: {
    url: process.env.DB_URL,
    dialect: 'postgres',
    dialectModule: pg,
  },
};
