const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');

router.route('/').get(userCtrl.getUsers);
router.route('/').put(userCtrl.editUser);
router.route('/feed').get(userCtrl.feed);
router.route('/search').get(userCtrl.searchUser);
router.route('/:username').get(userCtrl.getUser);
router.route('/:id/follow').get(userCtrl.follow);
router.route('/:id/unfollow').get(userCtrl.unfollow);


  module.exports = router;