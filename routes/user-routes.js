const express = require('express');

const router  = express.Router();

const ClassModel = require('../models/class-model.js');
const AssignmentModel = require('../models/assignment-model.js');



//LOGGED IN USER PROFILE VIEW
router.get('/profile', (req,res,next)=>{
  ClassModel.find((err, classList) => {
    if (err){
    next(err);
    return;
    }

    res.locals.classList = classList;
    res.render('user-views/user-profile-view.ejs');
  });
});



//CLASSES ----------------------------------------------------------

//ADD A CLASS
//Step 1
router.get('/newclass',(req,res, next)=>{
  res.render('user-views/new-class-view.ejs');
});

//Step 2
router.post('/newclass',(req,res, next)=>{
    const addedClass= new ClassModel({
      className: req.body.className,
      subject: req.body.subjectName,
      gradeLevel: req.body.gradeLevel,
    });

     // SAVE to DATABASE
    addedClass.save((err)=>{
      // If there was an error that was NOT a validation error...
      if (err && addedClass.errors === undefined){
        //  If there was an error, use next() to skip to the ERROR PAGE
      next(err);
      return;
      }
      // If there was error and THERE WERE valiation errors
      if(err && addedClass.errors){
        // Create view variables with the error messages
        res.locals.nameValidationError = addedClass.errors.className;
       //Display form to correct errors
        res.render('user-views/new-class-view.ejs');
        return;
      }
      //Step 3 - Save successful
      res.redirect('/profile');
    });
  });


// VIEW INDIVIDUAL CLASS Information
router.get('/classes/:Id', (req,res,next)=>{
    ClassModel.findById(
      req.params.Id, //1st Argument -> the Id to find in the DB
      (err, ClassInfo)=>{ //2nd Argument -> callback
        if (err){
        next(err);
        return;
        }
        res.locals.ClassInfo = ClassInfo;
        res.render('user-views/class-view.ejs');
      }
    );
});

// DELETE A CLASS
router.post('/classes/:Id/removeclass', (req,res,next)=>{
  ClassModel.findByIdAndRemove(
    req.params.Id,                  // 1st Argument -> id of Class to delete

    (err, ClassInfo) => {         //2nd Argument -> callback!
      if (err){
      next(err);
      return;
      }
      // Removed successfully
      res.redirect('/profile');
    }
  );
});
//------------------------------------------------------------------
module.exports = router;
