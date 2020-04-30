const mongoose = require('../models/bddconnect');
var journeyModel = require('../models/journey');
var userModel = require('../models/users');
var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET login. */
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET sign-in. */
router.get('/sign-in', function(req, res, next) {
  res.render('login', { title: 'Express' });
});

/* GET sign-up. */
router.get('/sign-up', function(req, res, next) {
  res.render('login', { title: 'Express' });
});


/* GET Oups. */
router.get('/oups', function(req, res, next) {
  res.render('oups', { title: 'Express' });
});

/* GET logout. */
router.get('/logout', function(req, res, next) {
  res.render('/', { title: 'Express' });
});


/* GET trips. */
router.post('/trips', async function(req, res, next) {
  
var voyages = await journeyModel.find({ departure: req.body.depart, 
arrival: req.body.arrivee, 
date: new Date(req.body.date_depart)});

console.log(req.body.arrivee);
console.log("===TRIP====",voyages);

  res.render('trips', {voyages});
});

/* GET basket. */
router.get('/basket', function(req, res, next) {
  res.render('basket');
});

/* GET my-last-trips. */
router.get('/my-last-trips', function(req, res, next) {
  res.render('my-last-trips');
});


module.exports = router;

// Remplissage de la base de donnée, une fois suffit
// router.get('/save', async function(req, res, next) {

//   // How many journeys we want
//   var count = 300

//   // Save  ---------------------------------------------------
//     for(var i = 0; i< count; i++){

//     departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
//     arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

//     if(departureCity != arrivalCity){

//       var newUser = new journeyModel ({
//         departure: departureCity , 
//         arrival: arrivalCity, 
//         date: date[Math.floor(Math.random() * Math.floor(date.length))],
//         departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
//         price: Math.floor(Math.random() * Math.floor(125)) + 25,
//       });
       
//        await newUser.save();

//     }

//   }
//   res.render('index', { title: 'Express' });
// });

// var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
// var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]

// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.
// router.get('/result', function(req, res, next) {

//   // Permet de savoir combien de trajets il y a par ville en base
//   for(i=0; i<city.length; i++){

//     journeyModel.find( 
//       { departure: city[i] } , //filtre
  
//       function (err, journey) {

//           console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
//       }
//     )

//   }


//   res.render('index', { title: 'Express' });
// });