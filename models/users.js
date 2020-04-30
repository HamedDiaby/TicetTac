const mongoose = require('./bddconnect');

var mytripsSchema = mongoose.Schema({
    name: String,
    firstName: String,
    email: String,
    password: String,
    status: String,
  });

var userSchema = mongoose.Schema({
    name: String,
    firstName: String,
    email: String,
    password: String,
    status: String,
    mylasttrips : [mytripsSchema],
  });
  
  var userModel = mongoose.model('users', userSchema);

  module.exports = userModel;