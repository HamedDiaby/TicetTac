const mongoose = require('mongoose');

var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology: true
   };
  

  mongoose.connect('mongodb+srv://admin:pouicto20@cluster0-hzt7b.mongodb.net/ticketac?retryWrites=true&w=majority',
     options,
     function(err) {
      if (err) {
        console.log(`error, failed to connect to the database because --> ${err}`);
      } else {
        console.info('*** Database Ticketac connection : Success ***');
      }
     }
  );

  module.exports = mongoose;
  