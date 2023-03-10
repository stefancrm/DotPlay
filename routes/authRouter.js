const express = require('express');
const router = express.Router();
const user = require('../controllers/authController');
const loggedIn = require('../utils/authenticatedUser')

router.route('/register').post(user.register);
router.route('/login').post(user.login);
router.route('/logout').get(loggedIn.authUser,user.logout);

router.route('/forgot').post(user.forgot);
router.route('/reset/:token').put(user.reset);



module.exports = router;