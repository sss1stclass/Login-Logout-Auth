var express = require("express");
var router = express.Router();
var Register = require("../model/user");

/* GET users listing. */
router.get("/", (req, res, next) => {
  console.log(req.session);
  res.render("users");
});

router.get("/register", (req, res, next) => {
  res.render("register");
});
router.post("/register", (req, res, next) => {
  Register.create(req.body, (err, created) => {
    if (err) return next(err);
    console.log(created);
    res.redirect("/users/login");
  });
});
router.get("/login", (req, res, next) => {
// console.log(req.flash());
var error = req.flash('error')[0];
  res.render("login",{error});
});

router.get('/logout',(req,res,next)=>{
  req.session.destroy();
  res.clearCookie('connect.sid')
  res.redirect('/users/login');
})


router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error','Email/Password is required');
    return res.redirect("/users/login");
  }
  Register.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error','Email is not registered');
      return res.redirect("/users/login");
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error','Password is not Valid');
        return res.redirect("/users/login");
      }

      req.session.userId = user.id;
      res.redirect("/users");
    });
  });
});
module.exports = router;
