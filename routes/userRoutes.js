const router = require('express').Router();
const userCtrl = require('../controllers/userCtrl');
const auth = require('../middlewares/requireLogin');

router.get('/',auth,userCtrl.getUsers);
router.put('/',auth,userCtrl.editUser);
router.get('/feed',auth,userCtrl.feed);
router.get('/search',userCtrl.searchUser);
router.get('/:username',auth,userCtrl.getUser);
router.get('/:id/follow',auth,userCtrl.follow);
router.get('/:id/unfollow',auth,userCtrl.unfollow);


  module.exports = router;