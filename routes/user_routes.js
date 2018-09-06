const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const passport = require('passport');
const router = express.Router();

// Load Users model
const Users = require('../models/users');

// Login route

router.post('/login', (req, res, next) => {

  const emailAddress = req.body.email;
  const password = req.body.password;
  if(emailAddress == null){
  	 res.status(400).end();

  }
  if(password == null){
  	return res.status(400).end();
  }

  Users.getUserByEmail(emailAddress, (err, user) => {
    if (err) {
    	throw err
    };
    if (!user) {
      res.status(400).end();
    }

    Users.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      if (isMatch) {
        const token = jwt.sign({data: user}, keys.secret, {
          expiresIn: 604800  // 1 week
        });
        res.json({
          success: true,
          token: token,  // 'bearer'
          user: user
        });
        res.status(201).end();
      } else {
        res.status(400).end();
      }
    })
  });
});

// Logout route
router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Register form POST

router.post('/register', (req, res, next) => {
  if(req.body.email != null && req.body.password != null){
  	let newUser = new Users({
	    name: req.body.name,
	    email: req.body.email,
	    password: req.body.password
	  });
	  Users.findOne({email: req.body.email})
	    .then(user => {
	      if (user) {
	        res.status(400).end();
	      } else {
	        const salt = bcrypt.genSaltSync(10);
	        const hash = bcrypt.hashSync(newUser.password, salt);
	        newUser.password = hash;
	        newUser.save(function(err, user) {
	          if (err) {
	            console.log('newUser err =', err);
	            res.status(400).end();
	          }
	          const token = jwt.sign({data: user}, keys.secret, {
			          expiresIn: 604800  // 1 week
			        });	        
		        res.status(201).json({
		          success: true,
		          token: token,  // 'bearer'
		          user: user
		        }).end(); 
	        });
	      }
	    })
	    .catch(err => {
	      console.log('error =', err);
	      res.status(400).end();
	    });
	} else {
		res.status(400).end();
	}
});

//Profile route
router.get('/profile', passport.authenticate('jwt', {session: false}), (req, res, next) => {
  res.json({user: req.user, email: req.user.email});
  res.status(200).end();
});




module.exports = router;