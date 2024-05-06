const fs = require('fs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Post = require('./../../models/postModel');
const student = require('./../../models/studentModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('DB connection successful!'));

// READ JSON FILE
// const posts = JSON.parse(
//   fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
// );

// IMPORT DATA INTO DB
const importData = async () => {
  try {
    await Post.create(posts);
    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// DELETE ALL DATA FROM DB
const deleteData = async () => {
  try {
    await student.deleteMany();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}
