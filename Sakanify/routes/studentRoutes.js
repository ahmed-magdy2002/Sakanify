const express = require('express');
const studentController = require('../controllers/studentController');
const authController = require('./../controllers/authController');
const multer = require('multer');
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => cb(null, true),
});

const router = express.Router();

router.post(
  '/signup',
  studentController.uploadUserImage,
  studentController.resizeImage,
  authController.signup
);
router.post('/login', upload.none(), authController.login);

router.post('/forgotPassword', upload.none(), authController.forgotPassword);
router.post('/resetPassword', upload.none(), authController.resetPassword);
router.post(
  '/changePlan',
  authController.protect,
  upload.none(),
  studentController.changePlan
);
router.patch(
  '/updateMyPassword',
  upload.none(),
  authController.protect,
  authController.updatePassword
);
router.patch(
  '/updateMe',
  authController.protect,
  studentController.uploadUserImage,
  studentController.resizeImage,
  studentController.updateMe
);
router.delete('/deleteMe', authController.protect, studentController.deleteMe);
router.get('/Me', authController.protect, studentController.myData);

router
  .route('/')
  .get(studentController.getAllStudent)
  .post(studentController.createStudent);

router
  .route('/:id')
  .get(studentController.getStudent)
  .patch(studentController.updateStudent)
  .delete(studentController.deleteStudent);

module.exports = router;
