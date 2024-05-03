const mongoose = require('mongoose');
const slugify = require('slugify');
// const validator = require('validator');

const postSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A post must have a name'],
      trim: true,
      minlength: [10, 'A post name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'post name must only contain characters']
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    slug: String,
    userId: String,
    address: {
      type: String,
      required: [true, 'post should have an address'],
    },
    services: [String],
    postType: {
      type: String,
      enum: ['apartment', 'room', 'mixedRoom'],
    },
    postGender: {
      type: String,
      enum: ['male', 'female'],
      required: [true, 'you should submit gender'],
    },
    cleanOverall: {
      type: Number,
      default: 1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    cleanQuantity: {
      type: Number,
      default: 0,
    },
    communicationOverall: {
      type: Number,
      default: 1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    communicationQuantity: {
      type: Number,
      default: 0,
    },
    locationOverall: {
      type: Number,
      default: 1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    locationQuantity: {
      type: Number,
      default: 0,
    },
    valueOverall: {
      type: Number,
      default: 1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    valueQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      default: 1,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    bedrooms: {
      type: Number,
      required: [true, 'you should submit number of bedrooms'],
    },
    beds: {
      type: Number,
      required: [true, 'you should submit number of beds'],
    },
    bathrooms: {
      type: Number,
      required: [true, 'you should submit number of bathrooms'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A post must have a price'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A post must have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A post must have a cover image'],
    },
    imageCoverUrl: String,
    images: [String],
    imagesUrl: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
postSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// postSchema.pre('save', function(next) {
//   console.log('Will save document...');
//   next();
// });

// postSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

// QUERY MIDDLEWARE
// postSchema.pre('find', function(next) {

// postSchema.post(/^find/, function (docs, next) {
//   console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//   next();
// });

// AGGREGATION MIDDLEWARE

const Post = mongoose.model('Post', postSchema);

// postSchema.virtual('imagesUrl').get(function () {
//   return this.images.map((img) => `${process.env.BASE_URL}/posts/${img}`);
//   // return ${process.env.BASE_URL}/posts/${this.imageCover};
// });

// postSchema.virtual('imageCoverUrl').get(function () {
//   return `${process.env.BASE_URL}/posts/${this.imageCover}`;
// });

module.exports = Post;
