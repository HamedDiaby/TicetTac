const mongoose = require('./bddconnect');

var tripSchema = mongoose.Schema({
    journeyId: String,
});

var basketSchema = mongoose.Schema({
    userId: String,
    total : Number,
    status_basket: Boolean,
    items: [tripSchema],
  });
  
  var basketModel = mongoose.model('baskets', basketSchema);

  module.exports = basketModel;