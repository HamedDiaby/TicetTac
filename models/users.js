const mongoose = require('./bddconnect');

// var basketSchema = mongoose.Schema({
//   journeyId: [{type: mongoose.Schema.Types.ObjectId, ref: 'journey' }]
// });

var mytripsSchema = mongoose.Schema({  
    departure: String,
    arrival: String,
    date: Date,
    departureTime: String,
    price: Number,
  });

var userSchema = mongoose.Schema({
    name: String,
    firstName: String,
    email: String,
    password: String,
    status: String,
    mylasttrips : [mytripsSchema],
    //basket: [basketSchema]

  });
  
  var userModel = mongoose.model('users', userSchema);

  module.exports = userModel;