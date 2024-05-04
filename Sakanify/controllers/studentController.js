const student = require('./../models/studentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const uploadImage = require('../utils/uploadImageMid');
const firebase = require('firebase/app');
const {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} = require('firebase/storage');
const firebaseConfig = {
  apiKey: 'AIzaSyCRiMRrdD38CIMXfgSLQAIPvZu5GDxyShk',
  authDomain: 'sakanify-upload.firebaseapp.com',
  projectId: 'sakanify-upload',
  storageBucket: 'sakanify-upload.appspot.com',
  messagingSenderId: '974061018868',
  appId: '1:974061018868:web:9a6dac0276fe8514aa48a1',
};
firebase.initializeApp(firebaseConfig);
const storage = getStorage();
const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.uploadUserImage = uploadImage.uploadSingleImage('photo');

exports.resizeImage = async (req, res, next) => {
  //Processing Single Image
  if (req.file) {
    // const ext = req.file.mimetype.split('/')[1];
    // const ext = req.file.mimetype.split('/').join(' ')[1];

    const filename = `user-${uuidv4()}-${Date.now()}-photo.jpeg`;
    await sharp(req.file.buffer)
      // .resize(200, 200)
      .toFormat('jpeg')
      .jpeg({ quality: 90 });
    // .toFile(`public/img/users/${filename}`);
    const storageRef = ref(storage, filename);
    const metadata = { contentType: 'image/jpeg' };
    await uploadBytes(storageRef, req.file.buffer, metadata);
    const url = await getDownloadURL(storageRef);
    req.body.photo = filename;
    req.body.photoUrl = url;
  }
  //Processing Multiple Images
  // if (req.files.images) {
  //   req.body.images = [];
  //   req.files.images.map(async (img, index) => {
  //     const ext = img.mimetype.split('/')[1];
  //     const filename = tour-${uuidv4()}-${Date.now()}-${index + 1}.${ext};
  //     req.body.images.push(filename);
  //     await sharp(img.buffer)
  //       .resize(200, 200)
  //       .toFormat('jpeg')
  //       .jpeg({ quality: 90 })
  //       .toFile(starter/public/img/tours/${filename});
  //   });
  // }
  next();
};

exports.getAllStudent = catchAsync(async (req, res, next) => {
  const students = await student.find();

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: students.length,
    data: {
      students,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  // 3) Update user document
  const updatedstudent = await student.findByIdAndUpdate(
    req.student.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: 'success',
    data: {
      student: updatedstudent,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await student.findByIdAndUpdate(req.student.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getStudent = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.createStudent = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.updateStudent = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
exports.deleteStudent = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!',
  });
};
