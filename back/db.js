const mysql = require('mysql');
const Promise = require('bluebird');
const settings = require('./db-settings');
const connection = mysql.createConnection(settings);

Promise.promisifyAll(connection);

module.exports = connection;
