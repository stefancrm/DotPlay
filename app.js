const express = require('express');
const app = express();

const dotenv = require('dotenv');
dotenv.config({path : './config/.env'});

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});