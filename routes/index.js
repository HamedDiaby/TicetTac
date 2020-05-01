const mongoose = require('../models/bddconnect');
var journeyModel = require('../models/journey');
var userModel = require('../models/users');
var express = require('express');
var router = express.Router();
var session = require("express-session")

var charCase = function(string){
 return string.charAt(0).toUpperCase() + string.slice(1);
}


/* GET home page. */
router.get('/', function(req, res, next) {

  if(req.session.user == undefined){
     req.session.user = {id:""};
   }
   
  res.render('index', {user: req.session.user});
});

/* GET login. */
router.get('/login', function(req, res, next) {
  res.render('login', {user: req.session.user});
});

/* GET sign-in. */
router.post('/sign-in', async function(req, res, next) {

  var userExist = await userModel.findOne({email: req.body.email,
  password: req.body.password});

  if(!userExist){
    res.redirect('/login')
  } else {
    req.session.user = {
      id: userExist._id,
      name: userExist.name,
      firstname: userExist.firstName,
      email: userExist.email,
    }
    res.redirect('/');
  }
  
});

/* GET sign-up. */
router.post('/sign-up', async function(req, res, next) {

  var userExist = await userModel.findOne({email: req.body.email});

  if(!userExist){
    var newUser = new userModel({
      name: req.body.name,
      firstName: req.body.firstname,
      email: req.body.email,
      password: req.body.password,
      status: "customer",
    })

    var savedUser = await newUser.save();
    
    req.session.user = {
      id: savedUser._id,
      name: savedUser.name,
      firstname: savedUser.firstName,
      email: savedUser.email,
    }

  res.redirect('/');

  } else {
    res.redirect('/login');
  };
 
});


/* GET Oups. */
router.get('/oups', function(req, res, next) {

  res.render('oups', {user: req.session.user});
});

/* GET logout. */
router.get('/logout', function(req, res, next) {

  req.session.user = {id: ""};

  res.redirect('/');
});


/* GET trips. */
router.post('/trips', async function(req, res, next) {
  
var voyages = await journeyModel.find({departure: charCase(req.body.depart), 
arrival: charCase(req.body.arrivee), 
date: new Date(req.body.date_depart)});

if(voyages.length == 0){
  res.redirect('/oups');
}else{
res.render('trips', {voyages, user: req.session.user});
}
});



/* GET add Trip. */
router.get('/add-trips', async function(req, res, next) {

  var user = await userModel.findOne({_id: req.session.user.id});

  console.log(req.query);

  user.mylasttrips.push({
    departure: req.query.depart,
    arrival: req.query.arrivee,
    date: req.query.date,
    departureTime: req.query.departuretime,
    price: req.query.price,
  });

  var total = 0;

  for(var i=0; i<user.mylasttrips.length; i++){
  total += user.mylasttrips[i].price;
  }

  req.session.user.total = total;

  console.log(total);

  res.render('basket',{mytrips: user.mylasttrips, user: req.session.user})

  // user.basket.push({
  //   journeyId: req.query.id
  // });
  
  // var savedBasket = await user.save();

  // var newJourney = [];

  // for(var i=0; i<savedBasket.basket.length; i++){
  //   var eachJourney = await journeyModel.findById(savedBasket.basket[i].journeyId);

  //   newJourney.push({    
  //     departure: eachJourney.departure,
  //     arrival: eachJourney.arrival,
  //     date: eachJourney.date,
  //     departureTime: eachJourney.departureTime,
  //     price: eachJourney.price,
  //     id: eachJourney._id
  //   })
  //   console.log(eachJourney);
  // }
  // req.session.user.basket = newJourney;

  // console.log(req.session.user);

  //res.redirect('/basket');
});

/* GET basket. */

router.get('/basket', function(req, res, next){

res.render('basket', {user: req.session.user})
})

/* GET gobasket. */
router.get('/gobasket', function(req, res, next) {
  
  req.session.user.id = req.query.userid

  console.log(req.session.user);
  res.redirect('/basket');
});

/* GET trash. */
router.get('/trash', async function(req, res, next) {

  var user = await userModel.findById(req.session.user.id);

    user.mylasttrips.splice(req.query.position, 1);

    console.log(req.query.position);
  
    var total = 0;

    for(var i=0; i<user.mylasttrips.length; i++){
    total += user.mylasttrips[i].price;
    }
  
    req.session.user.total = total;


  res.render('basket', {mytrips: user.mylasttrips, user: req.session.user});
});

/* GET my-last-trips. */
router.get('/my-last-trips', async function(req, res, next) {

  var historic = await userModel.findOne()

  res.render('my-last-trips', {user: req.session.user});
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