const express = require('express');
const bodyParser = require('body-parser');
require('./env');
const db = require('./db');

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => db.query('SELECT 1', (err, results) => {
  res.send(results);
}));

app.listen(process.env.PORT || 5000);