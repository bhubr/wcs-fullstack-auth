const express = require('express');
const bodyParser = require('body-parser');
require('./env');
const authRouter = require('./routes/auth');

const app = express();
app.use(bodyParser.json());

app.use('/api/auth', authRouter);

app.listen(process.env.PORT || 5000);