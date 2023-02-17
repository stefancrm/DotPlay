const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

const dotenv = require('dotenv');
dotenv.config({path : './config/.env'});

const ErrorHandler = require('./utils/errorHandler');
const errorManager = require('./utils/errorsManager');

const dbConnect = require('./config/mongooseDb');
dbConnect();

// Set cookie parser
app.use(cookieParser());

// Setup body parser
app.use(express.json());
//app.use(bodyParser.urlencoded({ extended : true }));

const game = require('./routes/gameRouter');
const auth = require('./routes/authRouter');
const user = require('./routes/userRoute');

app.use('/api/v1', game);
app.use('/api/v1', auth);
app.use('/api/v1', user);

// Handle unhandled routes
app.all('*', (req, res, next) => {
    next(new ErrorHandler(`${req.originalUrl} route not found`, 404));
});

// Middleware to handle errors
app.use(errorManager);

app.listen(process.env.PORT, () => {
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV}`);
});

// Handling Unhandled Promise Rejection
process.on('unhandledRejection', err => {
    console.log(`Error: ${err.message}`);
    console.log('Shutting down the server due to Unhandled promise rejection.')
    server.close( () => {
        process.exit(1);
    }) 
});