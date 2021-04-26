const router = require('express').Router();
const storiesCtrl = require('../controllers/storiesCtrl');
const auth = require('../middlewares/requireLogin');

router.post('/',auth,storiesCtrl.addStories);
router.get('/',storiesCtrl.getStories);
router.delete('/:id',auth,storiesCtrl.deleteStories);
router.post('/:id/reply',auth,storiesCtrl.giveReply);

module.exports = router;