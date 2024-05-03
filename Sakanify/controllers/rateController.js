const Review = require('./../models/reviewModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.createRate = catchAsync(async (req, res, next) => {
  const reviewCheck = await Review.find({
    userId: req.student.id,
    postId: req.params.id,
  });
  if (reviewCheck) {
    return next(new AppError('you can just update your review', 404));
  }
  const review = await Review.create({
    postId: req.params.id,
    userId: req.student.id,
    ...req.body,
  });
  if (!review) {
    return next(new AppError('No review created', 404));
  }
  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.updateRate = catchAsync(async (req, res, next) => {
  const review = await Review.findOne({
    userId: req.student.id,
    postId: req.params.id,
  });

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }
  if (req.body.cleanRate) review.cleanRate = req.body.cleanRate;
  if (req.body.communicationRate)
    review.communicationRate = req.body.communicationRate;
  if (req.body.locationRate) review.locationRate = req.body.locationRate;
  if (req.body.valueRate) review.valueRate = req.body.valueRate;
  await review.save();

  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});
