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

  user.mylasttrips.push({
    departure: req.query.depart,
    arrival: req.query.arrivee,
    date: req.query.date,
    departureTime: req.query.departuretime,
    price: req.query.price,
  });

  await user.save()

  var total = 0;

  for(var i=0; i<user.mylasttrips.length; i++){
  total += user.mylasttrips[i].price;
  }

  req.session.user.total = total;

  req.session.user.basket = user.mylasttrips

  res.render('basket',{mytrips: user.mylasttrips, user: req.session.user})

});

/* GET basket. */

router.get('/basket', async function(req, res, next){

  var user = await userModel.findById(req.session.user.id)

  console.log(user.mylasttrips);
res.render('basket', {user: req.session.user, mytrips: user.mylasttrips})
})

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

  var historic = await userModel.findById(req.session.user.id)

  res.render('my-last-trips', {user: req.session.user, historic});
});


module.exports = router;