const express = require('express');
const router = express.Router();
const game = require('../controllers/gameController');
const {
    authUser,
    authRole
    } = require('../utils/authenticatedUser');

router.route('/games').get(game.getAllGames);
router.route('/game/new').post(authUser, authRole('developer', 'admin'), game.newGame);
router.route('/game/update/:id').put(authUser, authRole('developer', 'admin'),game.updateGame);
router.route('/game/delete/:id').delete(authUser, authRole('developer', 'admin'),game.deleteGame);

router.route('/game/join/:id').put(authUser, game.joinGame);
//router.route('/game/play/:id').put(authUser, game.playGame); 

module.exports = router;
