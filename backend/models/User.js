const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
  });
  UserSchema.plugin(passportLocalMongoose);
  const User = mongoose.model('user', UserSchema);
  User.createIndexes();
  module.exports = User;