const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name!'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    gender: {
      type: String,
      enum: ['male', 'female'],
      required: [
        function () {
          return this.role === 'student';
        },
        'you should submit your gender',
      ],
    },
    nationalId: String,
    faculty: String,
    phone: {
      type: String,
      required: [
        function () {
          return this.role === 'owner';
        },
        'you should submit your phonenumber',
      ],
    },
    photo: String,
    photoUrl: {
      type: String,
      default:
        'https://firebasestorage.googleapis.com/v0/b/sakanify-upload.appspot.com/o/default.jpg?alt=media&token=d8956b4a-5731-4e36-9f1b-aeedce3e587f',
    },

    role: {
      type: String,
      enum: ['student', 'owner'],
      required: [true, 'you must submit your role'],
    },
    favourites: [String],
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

studentSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

studentSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

studentSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

studentSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

studentSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

studentSchema.methods.createPasswordResetToken = function () {
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const student = mongoose.model('student', studentSchema);

// studentSchema.virtual('photoUrl').get(function () {
//   return `${process.env.BASE_URL}/users/${this.photo}`;
// });

module.exports = student;
