const express = require('express');

const router  = express.Router();

const ClassModel = require('../models/class-model.js');
const AssignmentModel = require('../models/assignment-model.js');


// router.get('/profile',(req,res, next)=>{
//   res.render('user-views/user-home-view.ejs');
// });

router.get('/profile', (req,res,next)=>{
  ClassModel.find((err, classList) => {
    if (err){
    next(err);
    return;
    }

    res.locals.classList = classList;
    res.render('user-views/user-home-view.ejs');
  });
});



//CLASSES ----------------------------------------------------------
//Add a class
router.get('/newclass',(req,res, next)=>{
  res.render('user-views/new-class-view.ejs');
});

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
        res.locals.nameValidationError = addedProduct.errors.name;
        res.locals.priceValidationError = addedProduct.errors.price;
        // and display the form again
        res.render('product-views/new-product-view.ejs');
        return;
      }
      //if saved successfully, redirect to a URL /blahblahblah
      // Redirect is step #3
      res.redirect('/profile');
      // you can ONLY redirect to a URL
      //  If you don't redirect, you can refresh and dublicate data! Oh No!
      // you render a view
    });
  });

//------------------------------------------------------------------

router.get('/classes/:myId',(req,res,next)=>{
  // from products-list-view.ejs
  // <a href="/products/details?myId=<%= oneProduct._id %>">
  //  /products/details?myId=5951744067310a0e67d4934c"
    ProductModel.findById(
      req.params.myId, //1st Argument -> the Id to find in the DB
      (err, productFromDb)=>{ //2nd Argument -> callback
        if (err){
          //  If there was an error, use next() to skip to the ERROR PAGE
        next(err);
        return;
        }
        // res.locals.productDetails = theProduct; other possibility
        res.render('product-views/product-details-view.ejs',
        { productDetails: productFromDb});
      }
    );
});


module.exports = router;
