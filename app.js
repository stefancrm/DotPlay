const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config({path : './config/.env'});

const auth = require('./routes/authRouter');
const user = require('./routes/userRoute');

app.use('/api/v1', auth);
app.use('/api/v1', user);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});