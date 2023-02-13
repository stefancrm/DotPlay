const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');

router.route('/profile').get(user.viewProfile);
router.route('/profile/edit').put(user.editProfile);
router.route('/profile/password').put(user.editPassword);
router.route('/list').get(user.viewGameList);
router.route('/list/:gameId').get(user.gameStats);

router.route('/delete').delete(user.delAccount);

module.exports = router;
