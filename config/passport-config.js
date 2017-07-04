//we are configuring passport in a separate file to avoid making a mess in app.js
//This MUST be connected to app.js

const passport = require('passport');
const bcrypt = require('bcrypt');

const UserModel = require('../models/user-model.js');

// serializeUser (control what goes inside the "bowl"- save just the user's ID from the DB - happens ONLY when you log in)
//userFromDB from successful login (see below)
passport.serializeUser((userFromDB, next)=>{
  next(null, userFromDB._id);
//      |
// null in 1st argument means no Error :)
});


// deserializeUser (controls what you get when you check the "bowl" - DB query to get rest of user info, happens
// everytime you visit any page on the site after logging in)
passport.deserializeUser((idFromBowl, next)=>{
  UserModel.findById(
    idFromBowl,

    (err, userFromDB) => {
      if(err) {
        next(err);
        return;
      }
      //Tell passport that we got the user's info from the DB
      next(null, userFromDB);
      // null in 1st argument means no Error :)
    }
  );
});



// STRATEGIES------------------------------------------------------------------
//      the different ways we can log into our app
//SETUP passport-local (log in with username and password from a form)
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  {                   // 1st Argument -> settings object connection between form
  usernameField: 'loginUsername', //this has to match up with the form <input name="loginUsername">
  passwordField: 'loginPassword'
           //          |
           //    these will get passed into formUsername/formPassword below
  },
  (formUsername, formPassword, next)=>{       // 2nd Argument -> callback (will be called when a user tries to log in)
    // #1 is there an account with the provided username (in the database)?

    UserModel.findOne(
      { username: formUsername },
      (err, userFromDB) =>{
        if(err){
          next(err);
          // error in 1st argument means something unforseen happened
          return;
        }
        // If the username doesn't exist, the userFromDB will be empty(null)
        // check if 'userFromDB' is empty
        if (userFromDB === null){
          //in Passport, if you call next() with "false" in second spot - Login FAILED
          next(null,false);
          //      |
          // null in 1st argument means no Error :)
          return;
         }

           // #2 IF there is a user with that username, is the PASSWORD correct?
         if(bcrypt.compareSync( formPassword, userFromDB.encryptedPassword ) === false){
           //in Passport, if you call next() with "false" in second spot - Login FAILED
           next(null,false);
           //      |
           // null in 1st argument means no Error :)
           return;
         }

         //If we pass those if statements, LOGIN successful
         //in Passport, if you call next() with a user in second spot - Login SUCCESS!!!!!!!!
         //will call serializeUser - passport will now save user info in the "bowl" - (see above)
         next(null, userFromDB);
         //      |
         // null in 1st argument means no Error :)
      }
    );
  }
));
