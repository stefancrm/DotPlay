const express = require('express');
const router = express.Router();
const user = require('../controllers/userController');
const {
    authUser,
    authRole
    } = require('../utils/authenticatedUser');

router.use(authUser);

router.route('/profile').get(user.viewProfile);
router.route('/profile/edit').put(user.editProfile);
router.route('/profile/password').put(user.editPassword);
router.route('/list').get(user.viewGameList);
router.route('/list/:gameId').get(user.gameStats);

router.route('/delete').post(user.delAccountRequest);
router.route('/delete/:token').delete(user.delAccountConfirm);

module.exports = router;
