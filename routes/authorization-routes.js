const express = require('express');
const router  = express.Router();

/* Sign-in Page */
router.get('/sign-in', (req, res, next) => {
  res.render('authorization-views/login-view.ejs');
});



/* Sign-UP Page - Create a new account! */
router.get('/sign-up',(req,res, next)=>{
  res.render('authorization-views/sign-up-view.ejs');
});




module.exports = router;
