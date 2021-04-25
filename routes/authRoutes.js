const router = require('express').Router();
const authCtrl = require('../controllers/authCtrl');
const auth = require('../middlewares/requireLogin');

router.post('/register',authCtrl.register);
router.post('/login',authCtrl.login);
router.get('/logout',authCtrl.logout);
router.get('/refresh_token',authCtrl.refreshToken);
router.get('/infor',auth,authCtrl.userInformation);

module.exports = router;