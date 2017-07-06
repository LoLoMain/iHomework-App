const express = require('express');
const router  = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index');
});



// router.get('/profile', (req,res, next)=>{
//   if(req.user){
//   res.render('user-views/user-profile-view.ejs');
//   }
//   //if not logged in, redirect to log in page.
//   else{
//     res.redirect('/login');
//   }
// });

module.exports = router;
