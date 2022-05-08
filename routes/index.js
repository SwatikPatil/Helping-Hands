const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../config/auth');
const User = require('../models/User');
const Donate = require('../models/Donate');
const Need = require('../models/Need');

//Welcome Route
router.get('/',function(req, res){
    res.render('welcome', {currentUser : req.user});
});

//Profile route
router.get('/profile', ensureAuthenticated, function(req, res){
  Donate.aggregate([{
    $group: {
      _id: '$email',
      books: { $sum: '$books' },
      clothes: { $sum: '$clothes' },
      stationary: { $sum: '$stationary' },
      money: { $sum: '$money'}
    }
  }
 ], function (err, result) {
  if(err)
    return next(err)
  else {
    var i = 0;
    var userdonation = {}
    while (result[i]){
      if(result[i]._id === req.user.email){
        userdonation = result[i];
      }
      i = i + 1;
    }
    Need.aggregate([{
      $group: {
        _id: '$email',
        books: { $sum: '$books' },
        clothes: { $sum: '$clothes' },
        stationary: { $sum: '$stationary' },
        money: { $sum: '$money'}
      }
    }
   ], function(err, result){
    if(err){
      console.log(err);
    } else {
      var i = 0;
      var userRequests = {}
      while (result[i]){
        if(result[i]._id === req.user.email){
          userRequests = result[i];
        }
        i = i + 1;
      }
      res.render('profile', {currentUser: req.user, userdonations : userdonation, userRequests : userRequests});
      }
   });
  }
  })
});

//Dashboard Route
router.get('/dashboard', function(req, res){
    Donate.aggregate([{
        $group: {
          _id: '',
          books: { $sum: '$books' },
          clothes: { $sum: '$clothes' },
          stationary: { $sum: '$stationary' },
          money: { $sum: '$money'}
        }
      }
     ], function (err, result) {
      if(err)
        return next(err)
      else {
        res.render('dashboard', {currentUser: req.user, result: result[0]})
      }
      })
});

//Donate Route
router.get('/donate', ensureAuthenticated, (req, res) => res.render('donate', {currentUser : req.user}));

router.post('/donate', function(req, res){

  const donate = new Donate({
    email : req.user.email,
    books : req.body.book,
    clothes : req.body.clothes,
    stationary : req.body.stationary,
    money : req.body.money
  });

  donate.save()
    .then(donate => {
        req.flash('success_msg', 'Thankyou for donating');
        res.redirect('/donate');
    })
    .catch(err => console.log(err));
});

//Get Route
router.get('/get', ensureAuthenticated, (req, res) => res.render('need', {currentUser : req.user}));

//Get Route
//router.get('/details', ensureAuthenticated, (req, res) => res.render('details', {currentUser : req.user}));
router.get('/detail', ensureAuthenticated ,function(req,res){
  res.render('details', {currentUser : req.user})
});

router.post('/get', function(req, res){
  const need = new Need({
    email : req.user.email,
    books : req.body.book,
    clothes : req.body.clothes,
    stationary : req.body.stationary,
    money : req.body.money
  });

  need.save()
    .then(need => {
        req.flash('success_msg', 'Your request is in process');
        res.redirect('/get');
    })
    .catch(err => console.log(err));
});

module.exports = router;