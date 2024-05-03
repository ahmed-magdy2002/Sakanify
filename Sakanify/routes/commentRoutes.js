const express = require('express');
const commController = require('../controllers/commController');
const authController = require('../controllers/authController');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => cb(null, true),
});

const router = express.Router();

router
  .route('/')
  .get(authController.protect, commController.getMyComments)
  .post(authController.protect, upload.none(), commController.createComm);

router
  .route('/:id')
  .patch(upload.none(), commController.updateComm)
  .delete(commController.deleteComm);

module.exports = router;
