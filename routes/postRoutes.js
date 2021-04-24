const router = require('express').Router();
const postCtrl = require('../controllers/postCtrl');


router.route('/').get(postCtrl.getPosts)
                 .post(postCtrl.addPost);
router.route('/search').get(postCtrl.searchPost);
router.route('/:id').get(postCtrl.getPost)
                    .delete(postCtrl.deletePost);
router.route('/:id/togglelike').get(postCtrl.toggleLike);
router.route('/:id/togglesave').get(postCtrl.togggleSave);
router.route('/:id/comments').post(postCtrl.addComment);
router.route('/:id/comments/:commentId').delete(postCtrl.deleteComment);

module.exports = router;