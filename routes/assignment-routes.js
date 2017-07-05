const express = require('express');

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
          description: req.body.assignmentDescription

        });

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
router.get('/classes/:Id/assignmentdetails', (req, res, next)=>{
  ClassModel.findById(  req.params.Id, //1st Argument -> the Id to find in the DB
    (err, ClassInfo)=>{ //2nd Argument -> callback
      if (err){
      next(err);
      return;
      }
        res.locals.ClassInfo = ClassInfo;
        res.render('user-views/assignment-details-view.ejs');
      });

});






module.exports = router;
