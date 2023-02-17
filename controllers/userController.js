const User = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');
const catchAsyncErr = require('../utils/asyncError');
const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

const userController = {
    //View profile => /api/v1/profile
    viewProfile : catchAsyncErr( async (req, res) => {
            const user = await User.findById(req.user.id)

            res.status(200).json({
                success : true,
                data : user
            });
        }),
    //Edit profile name and email => /api/v1/profile/edit
    editProfile : catchAsyncErr( async(req, res, next) => {
        const newUserData = {
            name : req.body.name,
            email : req.body.email
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new : true,
            runValidators : true,
            useFindAndModify : false
        });

        res.status(200).json({
            success : true,
            message : "Profile Updated successfully!",
            data : user
        });
    }),
    //Edit password => /api/v1/profile/password
    editPassword : catchAsyncErr( async (req, res, next) => {
        const user = await User.findById(req.user.id).select('+password');

        // Check previous user password
        const isMatched = await user.comparePassword(req.body.currentPassword);
        if(!isMatched) {
            return next(new ErrorHandler('Old Password is incorrect.', 401));
        }   
        user.password = req.body.newPassword;
        await user.save();
        sendToken(user, 200, res);
    }),
    //view Game list => /api/v1/list
    viewGameList : (req, res) => {
        res.status(200).json({
            success : true,
            message : "View game list route"
        });
    },
    //view Game statistics => /api/v1/list/:gameId
    gameStats : (req, res) => {
        res.status(200).json({
            success : true,
            message : "Game Stats route"
        });
    },
    //Delete account => /api/v1/delete
    delAccountRequest : catchAsyncErr( async(req, res, next ) => {
        const user = await User.findById(req.user.id);

        const deleteToken = user.getDeleteToken();
        await user.save({ validateBeforeSave : false });

        const deleteUrl = `${req.protocol}://${req.get('host')}/api/v1/delete/${deleteToken}`;
        const message = `You Request the Closure of Your Account and the Deletion of Your Personal Information.
                        \n\n Acces this link to confirm deletion in the next 30 minutes:
                        \n\n${deleteUrl}`
        try {
            await sendEmail({
                email : user.email,
                name : user.name,
                subject : 'DotPlay account deletion',
                message
            });
            res.status(200).json({
                success : true,
                message : `Email sent successfully to: ${user.email}`
            });
        } catch (error) {
            user.deletionToken = undefined;
            user.deletionExpire = undefined;
            await user.save({ validateBeforeSave : false });
            return next(new errorHandler('Email is not sent.'), 500);
        }
    }),
    delAccountConfirm : catchAsyncErr( async (req, res, next) => {
        // Hash url token
        const deletionToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex');

        const user = await User.findOne({ 
            deletionToken, 
            deletionExpire: {$gt : Date.now() }
        });

        if(!user) {
            return next(new errorHandler('Account deletion token is invalid or has been expired.', 400));
        }
        await User.findByIdAndDelete(user);
        res.cookie('token', 'none', {
            expires : new Date(Date.now()),
            httpOnly : true
        });
        res.status(200).json({
            success : true,
            message : 'Your account has been deleted.'
        })
    })
}

module.exports = userController