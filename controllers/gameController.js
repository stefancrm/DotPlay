const Game = require('../models/gameModel');
const User = require('../models/userModel');
const errorHandler = require('../utils/errorHandler');
const catchAsyncErr = require('../utils/asyncError');
const APIfilter = require('../utils/apiFilters');

const sendToken = require('../utils/sendToken');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');



const gameController = {
    // List all games => /api/v1/games
    getAllGames : catchAsyncErr(async (req, res, next) => {
        const apiFilter = new APIfilter(Game.find(), req.query)
            .filter();
        const games = await apiFilter.query;

        res.status(200).json({
            success: true,
            results: games.length,
            data: games
        });
    }),
    // Create new game => /api/v1/game/new
    newGame : catchAsyncErr(async (req, res, next) => {
        //Adding user to body
        req.body.user = req.user.id;
        //req.body.email = req.user.email;

        // Get data from form and create game page
        //console.log(user.id)
        const game = await Game.create(req.body);

        res.status(200).json({
            success: true,
            message: 'Game Created.'
        });
    }),
    // Update a game => /api/v1/game/update/:id
    updateGame : catchAsyncErr(async (req, res, next) => {
        let game =await Game.findById(req.params.id);

        if(!game) {
            return next(new errorHandler("Game page not found", 404));
        }

        game = await Game.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true,
            useFindAndModify : false
        })
        res.status(200).json({
            success: true,
            message: `Game ${game.title} updated.`
        });
    }),
    // Delete a game => /api/v1/game/delete/:id
    deleteGame : catchAsyncErr(async (req, res, next) => {
        let game = await Game.findById(req.params.id);
        let gameName = game.title

        if(!game) {
            return next(new errorHandler("Game page not found", 404));
        }

        game = await Game.findByIdAndRemove(req.params.id);

        res.status(200).json({
            success: true,
            message: `Game ${gameName} deleted.`
        });
    }),
    // Join a game => /api/v1/game/join/:id
    joinGame : catchAsyncErr(async (req, res, next) => {
        let game = await Game.findById(req.params.id).select(["+gameStatus","+usersApplied"]);

        if(!game) {
            return next(new errorHandler("Game not found", 404));
        }
        // check if game is active
        if(game.gameStatus === "closed"){
            return next(new errorHandler("Game is curretnly offline", 400));
        } else if(req.user.role === "user" && !req.user.tester){
            return next(new errorHandler("You do not have permission to access this game", 400));
        }
        // Check if user applied before
        const userCount = game.usersApplied.length;
        for (let i = 0; i < userCount; ++i) {
            if (game.usersApplied[i].userid === req.user.id)
                return next(new errorHandler('You have already applied for this game.', 400))
        }
        const regDate  = new Date(Date.now());
        await Game.findByIdAndUpdate(game.id, {$push : {
            usersApplied : {
                userid : req.user.id,
                regDate : regDate,
                gamesPlayed : 0,
                gamesLost : 0,
                gamesWon : 0
            }
        }}, {
            new : true,
            runValidators : true,
            useFindAndModify: false
        })
        await User.findByIdAndUpdate(req.user.id, {$push : {
            gameList : {
                gameid : game.id,
                regDate : regDate
            }
        }}, {
            new : true,
            runValidators : true,
            useFindAndModify: false
        })
        res.status(200).json({
            success: true,
            message: `User ${req.user.name} joined ${game.title}.`
        });
    }),
    // User plays a game => /api/v1/play/:gameId/
    playGame : catchAsyncErr(async(req,res,nest) => {
        let game = await Game.findById(req.params.id).select(["+gameStatus","+usersApplied"]);
        if(!game) {
            return next(new errorHandler("Game not found", 404));
        }
        if(game.gameStatus === "closed"){
            return next(new errorHandler("Game is curretnly offline", 400));
        } else if(req.user.role === "user" && !req.user.tester){
            return next(new errorHandler("You do not have permission to access this game", 400));
        }
        const userCount = game.usersApplied.length;
        const userPos = undefined;
        for (let i = 0; i < userCount; ++i) {
            if (game.usersApplied[i].userid === req.user.id) {
                userPos = i;
                break;
            } else {
                return next(new errorHandler('You have already applied for this game.', 400))
            }  
        }
        const gamesPlayed = game.usersApplied[userPos].gamesPlayed;
        const gamesWon = game.usersApplied[userPos].gamesWon;
        const gamesLost = game.usersApplied[userPos].gamesLost;
        const result = req.body
        ++gamesPlayed
        if(result){
            ++gamesWon;
        } else {
            ++gamesLost
        }


        await Game.findByIdAndUpdate(game.id, {"usersApplied.$[userPos]" : {
            $push : {
                gamesPlayed : gamesPlayed,
                gamesLost : gamesWon,
                gamesWon : gamesLost
            }
        }},
            {
            new : true,
            runValidators : true,
            useFindAndModify: false
        })

    })
};

module.exports = gameController;