const express = require('express');
const router = express.Router();
const user = require('../controllers/authController');

router.route('/register').post(user.register);
router.route('/login').post(user.login);
router.route('/logout').get(user.logout);

router.route('/forgot').post(user.forgot);
router.route('/reset/:token').put(user.reset);



module.exports = router;