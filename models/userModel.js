const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        requiered : [true, "Please enter yor name"]
    },
    email : {
        type : String,
        requiered : [true, "Please enter yor email"],
        unique : true,
        validate : [validator.isEmail, 'Please enter a valid Email address']
    },
    password : {
        type : String,
        requiered : [true, "Please enter a password"],
        minlength : [8, 'The password must be at least 8 characters long'],
        select : false
    },
    regDate : {
        type : Date,
        default : Date.now()
    },
    role : {
        type : String,
        default : "user",
        select : false
    },
    gameList : {
        type : [Object]
    },
    tester : {
        type : Boolean,
        default : false
    },
    resetPasswordToken : String,
    resetPasswordExpire : Date,
    deletionToken : String,
    deletionExpire : Date
});

// Pasword encryption
userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) { next(); }
    this.password = await bcrypt.hash(this.password, 10)
});

// Return JSON web Token
userSchema.methods.getJwtToken = function () {
    return jwt.sign(
        {id : this._id}, 
        process.env.JWT_SECRET, 
        { expiresIn : process.env.JWT_EXPIRE_TIME }
    );
}
// Compare user password in database password
userSchema.methods.comparePassword = async function(enterPassword) { 
    return await bcrypt.compare(enterPassword, this.password);
}
// Generate reset password token
userSchema.methods.getResetPasswordToken = function() {
    const resetToken = crypto.randomBytes(20).toString('hex');
    // Hash and set to resetPasswordToken
    this.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

    // Set token expire time
    this.resetPasswordExpire = Date.now() + 30*60*1000;
    return resetToken;
}
// Generate account deletion token
userSchema.methods.getDeleteToken = function() {
    const deleteToken = crypto.randomBytes(20).toString('hex');
    // Hash and set to resetPasswordToken
    this.deletionToken = crypto
            .createHash('sha256')
            .update(deleteToken)
            .digest('hex');

    // Set token expire time
    this.deletionExpire = Date.now() + 30*60*1000;
    return deleteToken;
}
userSchema.methods.getRole = function () {
    return  this.role;
}

module.exports = mongoose.model('User', userSchema)