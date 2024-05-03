const mongoose = require('mongoose');
const Post = require('./postModel');

const reviewSchema = new mongoose.Schema({
  postId: String,
  userId: String,
  cleanRate: {
    type: Number,
    default: 0,
  },
  communicationRate: {
    type: Number,
    default: 0,
  },
  locationRate: {
    type: Number,
    default: 0,
  },
  valueRate: {
    type: Number,
    default: 0,
  },
});

reviewSchema.statics.calcAverageRatings = async function (postId) {
  const rates = await this.aggregate([
    {
      $match: { postId: postId },
    },
    {
      $group: {
        _id: '$postId',
        nRating: { $sum: 1 },
        cleanRating: { $avg: '$cleanRate' },
        comRating: { $avg: '$communicationRate' },
        locRating: { $avg: '$locationRate' },
        valRating: { $avg: '$valueRate' },
      },
    },
  ]);
  console.log(rates);

  if (rates.length > 0) {
    const post = await Post.findByIdAndUpdate(postId);
    post.ratingsQuantity = rates[0].nRating;
    post.cleanOverall = rates[0].cleanRating;
    post.communicationOverall = rates[0].comRating;
    post.locationOverall = rates[0].locRating;
    post.valueOverall = rates[0].valRating;
    post.ratingsAverage =
      (post.cleanOverall +
        post.communicationOverall +
        post.locationOverall +
        post.valueOverall) /
      4;
    await post.save();
  }
  //  else {
  //   await Post.findByIdAndUpdate(postId, {
  //     ratingsQuantity: 0,
  //     cleanOverall: 1,
  //     communicationOverall: 1,
  //     locationOverall: 1,
  //     valueOverall: 1,
  //   });
  // }
};

reviewSchema.post('save', function () {
  // this points to current review
  this.constructor.calcAverageRatings(this.postId);
});
// reviewSchema.methods.updatePostRates = async function () {
// reviewSchema.pre('save', async function (next) {
//   const post = await Post.findById(this.postId);
//   if (this.cleanRate) {
//     cleanQuantity = post.cleanQuantity++;
//     post.cleanOverall =
//       (post.cleanOverall + this.cleanRate) / post.cleanQuantity;
//     // (post.cleanOverall + this.cleanRate) / post.cleanQuantity;
//     console.log(cleanQuantity);
//   }
//   if (this.communicationRate) {
//     post.communicationQuantity++;
//     post.communicationOverall =
//       (post.communicationOverall + this.communicationRate) /
//       post.communicationQuantity;
//   }
//   if (this.locationRate) {
//     post.locationQuantity++;
//     post.locationOverall =
//       (post.locationOverall + this.locationRate) / post.locationQuantity;
//   }
//   if (this.valueRate) {
//     post.valueQuantity++;
//     post.valueOverall =
//       (post.valueOverall + this.valueRate) / post.valueQuantity;
//   }
//   console.log(
//     post.locationOverall,
//     post.valueOverall,
//     post.communicationOverall
//   );
//   post.ratingsAverage =
//     (post.cleanOverall +
//       post.communicationOverall +
//       post.locationOverall +
//       post.valueOverall) /
//     4;
//   post.ratingsQuantity++;
//   await post.save({ validateBeforeSave: true });
//   next();
// });

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
