const Comment = require('./../models/commModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createComm = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const comment = await Comment.create({
    yourEmail: req.student.email,
    ...req.body,
  });
  if (!comment) {
    return next(new AppError('No comment created', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.getMyComments = catchAsync(async (req, res, next) => {
  const comments = await Comment.find({ yourEmail: req.student.id });

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: comments.length,
    data: {
      comments,
    },
  });
});

exports.updateComm = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      comment,
    },
  });
});

exports.deleteComm = catchAsync(async (req, res, next) => {
  const comment = await Comment.findByIdAndDelete(req.params.id);

  if (!comment) {
    return next(new AppError('No comment found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});
