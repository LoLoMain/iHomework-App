const express = require('express');
// const client  = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const router  = express.Router();

const ClassModel = require('../models/class-model.js');
const AssignmentModel = require('../models/assignment-model.js');


//Assignments
//Add an Assignment for a specific class
router.get('/classes/:Id/newassignment', (req, res, next)=>{
  ClassModel.findById(  req.params.Id, //1st Argument -> the Id to find in the DB
    (err, ClassInfo)=>{ //2nd Argument -> callback
      if (err){
      next(err);
      return;
      }
        res.locals.ClassInfo = ClassInfo;
        res.render('user-views/new-assignment-view.ejs');
      });

});

// ROUTE #2 -> receive that form submission and do database stuff
router.post('/classes/:Id/newassignment', (req, res, next)=>{
    ClassModel.findById(
      req.params.Id,
      (err, ClassInfo)=> { //ClassInfo = class object from DB
        if (err){
          next(err);
          return;
        }
        const newAssignment = new AssignmentModel({
          assignmentName: req.body.assignmentName,
          dateAssigned: req.body.dateAssigned,
          dateDue: req.body.dateDue,
          assignmentType: req.body.assignmentType,
          description: req.body.assignmentDescription,
          isImportant: req.body.assignmentImportance

        });

        console.log(newAssignment);

        // Adding the Assignment to assignment array in class model
        ClassInfo.assignment.push(newAssignment);
        // Save Class with New Assignment
        ClassInfo.save((err)=>{
          if (err){
            next(err);
            return;
          }
          res.redirect('/classes/' +  ClassInfo._id);
        });
      }
    );
});

//View Assignment Details
router.get('/classes/:Id/assignmentdetails/:assid', (req, res, next)=>{
  ClassModel.findById(
    req.params.Id, //1st Argument -> the Id to find in the DB
    { assignment: { $elemMatch: { _id: req.params.assid } } },
    (err, ClassInfo)=>{ //2nd Argument -> callback
      if (err){
      next(err);
      return;
      }
        console.log(ClassInfo);
        res.locals.ClassInfo = ClassInfo;
        res.render('user-views/assignment-details-view.ejs');
      });
});

// Step 1 UPDATING an ASSIGNMENT
router.get('/classes/:Id/assignmentdetails/:assid/edit',(req, res, next)=>{
  ClassModel.findById(
    req.params.Id, //1st Argument -> the Id to find in the DB
    { assignment: { $elemMatch: { _id: req.params.assid } } }, //projection
    (err, ClassInfo)=>{ //2nd Argument -> callback
      if (err){
      next(err);
      return;
      }
        res.locals.ClassInfo = ClassInfo;
        res.locals.assignment = ClassInfo.assignment[0];

        res.render('user-views/edit-assignment-view.ejs');
  });
});

// Step 2 UPDATING an ASSIGNMENT

router.post('/classes/:Id/assignmentdetails/:assid/edit',(req,res, next)=>{
    ClassModel.findOneAndUpdate(
      { _id: req.params.Id, 'assignment._id': req.params.assid }, //projection

      {      //2nd Argument -> object of fields to update
        'assignment.$.assignmentName': req.body.assignmentName,
        'assignment.$.dateAssigned': req.body.dateAssigned,
        'assignment.$.dateDue': req.body.dateDue,
        'assignment.$.assignmentType': req.body.assignmentType,
        'assignment.$.description': req.body.assignmentDescription
          //        |
          // dollar sign means "the ones you matched in the criteria"
      },

    (err, ClassInfo) => { //3rd Argument -> callback!
      if (err){
      next(err);
      return;
      }
      //Update Successful - Redirect to Class Page
      res.redirect('/classes/' +  ClassInfo._id);
      // you can ONLY redirect to a URL
      }
    );
  });

  // DELETE AN ASSIGNMENT  - Mongoose pull object from an array
  router.post('/classes/:Id/assignmentdetails/:assid/delete', (req,res,next)=>{
    ClassModel.findOneAndRemove(
      req.params.Id,                  // 1st Argument -> id of Class to delete
      { $pull: { 'assignment._id' : assid } },

      (err, ClassInfo) => {         //2nd Argument -> callback!
        if (err){
        next(err);
        return;
        }
        // Removed successfully
        res.locals.ClassInfo = ClassInfo;
        res.redirect('/profile');
      }
    );
  });


module.exports = router;
