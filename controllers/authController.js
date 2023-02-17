const User = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');
const catchAsyncErr = require('../utils/asyncError');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const authController = {
    //Register
    register : catchAsyncErr(async (req, res, next) => {
        const {name, email, password} = req.body;
        const user = await User.create ({
            name,
            email,
            password
        });
        const loginPage = `${req.protocol}://${req.hostname}/api/v1/login`;
        const message = `Wellcome, you have registered at DotPlay
                        \n\n Login here \n\n
                        ${loginPage}`;
        try {
            await sendEmail({
                email : email,
                name : name,
                subject : "DotPlay Registration",
                message
            })
            res.status(200).json({
                success : true,
                message : "User Created",
                data : [{id : user.id, 
                        usernname: user.name, 
                        email : user.email}]
            });
        } catch (error) {
            return next(new errorHandler('Email is not sent.'), 500);
        }
    }),
    //Login
    login : catchAsyncErr(async (req, res, next) => {
        const {email, password} = req.body;
        // verify id email and password are entered
        if(!email || !password) {
            return next(new errorHandler('Please enter email & password', 400));
        }
        //search for the user in database
        const user = await User.findOne({email}).select('+password');
        if(!user) {
            return next(new errorHandler('Invalid email or password', 401));
        }
        //check for password
        const passverification = await user.comparePassword(password);
        if(!passverification) {
            return next(new errorHandler('Invalid email or password', 401));
        }   
        // everithing is ok and proceed forward
        sendToken(user, 200, res);
    }),
    //Logout
    logout : catchAsyncErr(async (req, res, next) => {
        res.cookie('token', 'none', {
            Expires : new Date(Date.now()),
            httpOnly : true 
        });
        res.status(200).json({
            success : true,
            message : 'Logged out successfully.'
        });
    }),
    //Send Reset Password emails
    forgot : catchAsyncErr( async (req, res, next) => {
        const user = await User.findOne({email : req.body.email});

        //check is user is registered
        if(!user) {
            return next(new errorHandler('No user found with this email.', 404));
        }
        // Get reset token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave : false });

        // create reset password url
        const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;
        const message = `Your password reset link is as follow:
                        \n\n${resetUrl}
                        \n\n If you have not request this, then please ignore this message.`
        try {
            await sendEmail({
                email : user.email,
                name : user.name,
                subject : 'DotPlay Password Recovery',
                message
            });
            res.status(200).json({
                success : true,
                message : `Email sent successfully to: ${user.email}`
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave : false });
            return next(new errorHandler('Email is not sent.'), 500);
        }
    }),
    //Reset password from email link
    reset : catchAsyncErr( async (req, res, next) => {
        // Hash url token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({ 
            resetPasswordToken, 
            resetPasswordExpire: {$gt : Date.now() }
        });

        if(!user) {
            return next(new ErrorHandler('Password Reset token is invalid or has been expired.', 400));
        }
        user.password = req.body.password;

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendToken(user, 200, res);
    })
}

module.exports = authController