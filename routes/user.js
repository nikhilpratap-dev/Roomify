const express=require("express");
const wrapAsync = require("../utility/wrapAsync.js");
const router=express.Router();
const User=require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");

//signUp
router.route("/signup")
.get(userController.signupPage)
.post(wrapAsync(userController.signup));


// Login
router.route("/login")
.get(userController.loginPage)
.post(saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/user/login", failureFlash:true}),
    userController.login);


//logout
router.get("/logout",userController.logout);


module.exports=router;