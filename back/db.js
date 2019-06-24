const mysql = require('mysql');
const settings = require('./db-settings');
const connection = mysql.createConnection(settings);

module.exports = connection;
