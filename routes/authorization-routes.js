const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');

const router  = express.Router();

const UserModel = require('../models/user-model.js');

/* Sign-UP USER - Create a new account! */
// Step 1 of Sign-UP
router.get('/sign-up',(req,res, next)=>{
  res.render('authorization-views/sign-up-view.ejs');
});

//Step 2 of Sign-UP
router.post('/sign-up', (req, res, next)=>{
  // Check DB to see if username is already taken
     UserModel.findOne(
       { username: req.body.signupUsername },


       (err, userFromDB)=> {
         if(err){
           next(err);
           return;
         }
         if(userFromDB){  //if username is taken send the user a message
          //  res.locals.messageForUsers = 'Sorry that Username is taken';
           res.render('authorization-views/sign-up-view.ejs');
           return;
         }
         // To encrypt password and save user in the DB
         const salt = bcrypt.genSaltSync(10);
         const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

         const newUser = new UserModel ({
           firstName: req.body.signupFirstName,
           username: req.body.signupUsername,
           birthday: req.body.signupBirthday,
           encryptedPassword: scrambledPassword
         });

         newUser.save((err)=>{
           if(err){
             next(err);
             return;
           }
           // if save/registration is successful - REDIRECT to WELCOME SCREEN
           res.redirect('/login');
         });
       }
     );
});

// LOG IN USER ----------------------------------------------------------
/* LOG-IN Page */
router.get('/login', (req, res, next) => {
  res.render('authorization-views/login-view.ejs');
});


router.post('/login',
    passport.authenticate(
        'local',     //1st argument -> name of stategy (determined by the strategy's npm package)
        {            //2nd argument -> settings object (see passport config)
          successRedirect: '/profile', // where to go if login worked
          failureRedirect: '/login' //where to go if login failed
        }
    )
);

// END LOG IN--------------------------------------


// LOG OUT user
router.get('/logout', (req,res, next)=>{
  // the "req.logout()" function is defined by the passport middleware (app.js line 44/45)
  req.logout();
  res.redirect('/');
});





module.exports = router;
