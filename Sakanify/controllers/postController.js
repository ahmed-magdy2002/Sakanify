const post = require('./../models/postModel');
const student = require('../models/studentModel');
const APIFeatures = require('../utils/apiFeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const uploadImage = require('../utils/uploadImageMid');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
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

exports.uploadPostImages = uploadImage.uploadMixOfImages([
  {
    name: 'imageCover',
    maxCount: 1,
  },
  {
    name: 'images',
    maxCount: 5,
  },
]);

exports.resizePostImages = catchAsync(async (req, res, next) => {
  console.log('resize middlewae');
  //1- Image processing for imageCover
  if (req.files.imageCover) {
    console.log('resize middlewae 1.1');
    // console.log(req.files.imageCover, '---------', req.files.images);
    // const ext = req.file.mimetype.split('/').join(' ')[1];
    const imageCoverFileName = `post-${uuidv4()}-${Date.now()}-cover.jpeg`;
    console.log(imageCoverFileName);
    await sharp(req.files.imageCover[0].buffer)
      // .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 95 });
    // .toFile(`public/img/posts/${imageCoverFileName}`);
    console.log('resize middlewae 1.2');

    // Save image into our db
    const storageRef = ref(storage, imageCoverFileName);
    const metadata = { contentType: 'image/jpeg' };
    await uploadBytes(storageRef, req.files.imageCover[0].buffer, metadata);
    const url = await getDownloadURL(storageRef);
    req.body.imageCoverUrl = url;
    req.body.imageCover = imageCoverFileName;
    console.log('resize middlewae 1.1.1');
  }
  //2- Image processing for images

  if (req.files.images) {
    console.log('resize middlewae 1.2');
    req.body.images = [];
    req.body.imagesUrl = [];
    await Promise.all(
      req.files.images.map(async (img, index) => {
        // const ext = img.mimetype.split('/').join(' ')[1];
        const imageName = `post-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

        await sharp(img.buffer)
          // .resize(2000, 1333)
          .toFormat('jpeg')
          .jpeg({ quality: 95 });
        // .toFile(`public/img/posts/${imageName}`);

        // Save image into our db
        const storageRef = ref(storage, imageName);
        const metadata = { contentType: 'image/jpeg' };
        await uploadBytes(storageRef, img.buffer, metadata);
        const url = await getDownloadURL(storageRef);
        req.body.imagesUrl.push(url);
        req.body.images.push(imageName);
      })
    );
    // console.log('resize middlewae 1.3');
  }
  next();
  // if (req.files.images) {
  //   console.log(req.files.images);
  //   req.body.images = req.files.images.map(async (img, index) => {
  //     const imageName = `post-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;

  //     await sharp(img.buffer)
  //       .resize(2000, 1333)
  //       .toFormat('jpeg')
  //       .jpeg({ quality: 95 })
  //       .toFile(`public/img/posts/${imageName}`);

  //     // Save image into our db
  //     return imageName;
  //   });

  //   // req.body.images.push(imageName);
  // }
});

exports.getAllPosts = catchAsync(async (req, res, next) => {
  const features = new APIFeatures(post.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const posts = await features.query;
  if (req.student) {
    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
      favourites: req.student.favourites,
    });
  } else {
    res.status(200).json({
      status: 'success',
      results: posts.length,
      data: {
        posts,
      },
    });
  }
});

exports.getMyPosts = catchAsync(async (req, res, next) => {
  const posts = await post.find({ userId: req.student.id });

  if (!posts) {
    return next(new AppError('No posts found for that user', 404));
  }

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: posts.length,
    data: {
      posts,
    },
  });
});

exports.getPost = catchAsync(async (req, res, next) => {
  const Post = await post.findById(req.params.id);

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      Post,
    },
  });
});

exports.createPost = catchAsync(async (req, res, next) => {
  const newpost = await post.create({
    userId: req.student.id,
    name: req.student.name,
    email: req.student.email,
    phone: req.student.phone,
    userImage: req.student.photoUrl,
    ...req.body,
  });
  if (!newpost) {
    return next(new AppError('No post created', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      post: newpost,
    },
  });
});

exports.updatePost = catchAsync(async (req, res, next) => {
  const Post = await post.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!post) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      Post,
    },
  });
});

exports.deletePost = catchAsync(async (req, res, next) => {
  const Post = await post.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(new AppError('No post found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addFaves = catchAsync(async (req, res, next) => {
  const Student = await student.findById(req.student.id);
  if (!Student.favourites.includes(req.params.id)) {
    Student.favourites.push(req.params.id);
    await Student.save();
  } else {
    return next(new AppError('this Post already in your favourites', 404));
  }
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      Student,
    },
  });
});
exports.deleteFaves = catchAsync(async (req, res, next) => {
  const Student = await student.findById(req.student.id);
  if (Student.favourites.includes(req.params.id)) {
    Student.favourites = Student.favourites.filter(
      (mov, i, arr) => mov != req.params.id
    );
    await Student.save();
  } else {
    return next(new AppError('this Post isnot in your favourites', 404));
  }
  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    data: {
      Student,
    },
  });
});

exports.getMyFaves = catchAsync(async (req, res, next) => {
  const arrayOfIds = req.student.favourites;
  console.log(arrayOfIds);
  const faves = await post.find({ _id: { $in: arrayOfIds } });

  res.status(200).json({
    status: 'success',
    results: faves.length,
    data: {
      faves,
    },
  });
});
