const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('Hello World'));

app.listen(process.env.PORT || 5000);