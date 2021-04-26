const router = require('express').Router();
const postCtrl = require('../controllers/postCtrl');
const auth = require('../middlewares/requireLogin');

router.post('/',auth,postCtrl.addPost);
router.get('/',postCtrl.getPosts)
                 
router.get('/search',postCtrl.searchPost);
router.get('/:id',auth,postCtrl.getPost)
router.delete('/:id',auth,postCtrl.deletePost);
router.get('/:id/togglelike',auth,postCtrl.toggleLike);
router.post('/:id/comments',auth,postCtrl.addComment);
router.delete('/:id/comments/:commentId',auth,postCtrl.deleteComment);

module.exports = router;