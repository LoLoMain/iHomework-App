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
router.get('/classes/:Id/assignmentdetails/:assid', (req, res, next)=>{
  ClassModel.findById(
    req.params.Id, //1st Argument -> the Id to find in the DB
    { assignment: { $elemMatch: { _id: req.params.assid } } },
    (err, ClassInfo)=>{ //2nd Argument -> callback
      if (err){
      next(err);
      return;
      }
        console.log('🍟🍟🍟🍟🍟🍟🍟🍟🍟🍟🍟');
        console.log(ClassInfo);
        console.log('');
        res.locals.ClassInfo = ClassInfo;
        res.render('user-views/assignment-details-view.ejs');
      });
});

// // Step 1 UPDATING an ASSIGNMENT
// router.get('/classes/:Id/assignmentdetails/:assid/edit',(req, res, next)=>{
//   ClassModel.findById(
//     req.params.Id, //1st Argument -> the Id to find in the DB
//     { assignment: { $elemMatch: { _id: req.params.assid } } }, //projection
//     (err, ClassInfo)=>{ //2nd Argument -> callback
//       if (err){
//       next(err);
//       return;
//       }
//         res.locals.ClassInfo = ClassInfo;
//         res.render('user-views/edit-assignment-view.ejs');
//   });
// });
//
// // step #2 of form submission for a UPDATING product
// // a POST verb - that we added in the form
//
//
// router.post('/products/:myId/update',(req,res, next)=>{
//     ProductModel.findByIdAndUpdate(
//       req.params.myId,{                 // 1st Argument -> id of document to update
//
//       name: req.body.productName,      //2nd Argument -> object of fields to update
//       price: req.body.productPrice,
//       imageUrl: req.body.productImageUrl,
//       description: req.body.productDescription
//     },
//
//     (err, productFromDb) => {         //3rd Argument -> callback!
//       if (err){
//         //  If there was an error, use next() to skip to the ERROR PAGE
//       next(err);
//       return;
//       }
//       //if saved successfully, redirect to a URL /blahblahblah
//       // Redirect is step #3
//       // you need to include the ID of the product in the URL
//       res.redirect('/products/' +productFromDb._id);
//       // you can ONLY redirect to a URL
//       }
//     );
//   });
//
//
//




module.exports = router;
