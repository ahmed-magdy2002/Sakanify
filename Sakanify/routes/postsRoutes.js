const express = require('express');
const postController = require('../controllers/postController');
const authController = require('../controllers/authController');
const rateController = require('../controllers/rateController');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => cb(null, true),
});

const router = express.Router();

router
  .route('/')
  .get(postController.getAllPosts)
  .post(
    authController.protect,
    authController.restrictTo('owner'),
    postController.uploadPostImages,
    postController.resizePostImages,
    postController.createPost
  );

router
  .route('/:id')
  .get(postController.getPost)
  .patch(
    postController.uploadPostImages,
    postController.resizePostImages,
    postController.updatePost
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    postController.deletePost
  );
router
  .route('/:id/rates')
  .post(authController.protect, upload.none(), rateController.createRate)
  .patch(authController.protect, upload.none(), rateController.updateRate);

module.exports = router;
