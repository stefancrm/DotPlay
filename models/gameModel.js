const mongoose = require('mongoose');
const validator = require('validator');
const slugify = require('slugify');

const gameSchema = new mongoose.Schema({
    title : {
        type : String,
        requiered : [true, "Please enter the game title"],
        maxlength : [100, 'Game title can not exceed 100 characters.']
    },
    slug : String,
    description : {
        type : String,
        required : [true, 'Please enter Game description.'],
        maxlength : [1000, 'Game description can not exceed 1000 characters.']
    },
    email : {
        type : String,
        validate : [validator.isEmail, 'Please add a valid email address.'],
        requiered : [true, "Please enter a email address"]
    },
    gameType : {
        type : String,
        required : [true, 'Please enter game type.'],
        enum : {
            values : [
                'Sandbox',
                'Real-time strategy (RTS)',
                'Shooters (FPS and TPS)',
                'Multiplayer online battle arena (MOBA)',
                'Role-playing (RPG, ARPG, and More)',
                'Simulation and sports',
                'Puzzlers and party games',
                'Action-adventure',
                'Survival and horror',
                'Platformer'
            ],
            message : 'Please select correct options for game type.'
        }
    },
    gameStatus : {
        type : String,
        requiered : true,
        enum : [
            'open',
            'closed',
            'testing'
        ],
        default : 'closed',
        select : false
    },
    postingDate : {
        type : Date,
        default : Date.now
    },
    usersApplied : {
        type : [Object],
        select : false
    },
    user : {
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    }
});
// Creating Game title Slug before saving
gameSchema.pre('save', function(next) {
    // Creating slug before saving to DB
    this.slug = slugify(this.title, {lower : true});
    next();
});

module.exports = mongoose.model('Game', gameSchema)