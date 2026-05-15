const express=require("express");
const wrapAsync = require("../utility/wrapAsync.js");
const router=express.Router();
const User=require("../models/user.js");
const passport = require("passport");


// signUp
router.get("/signup",(req,res)=>{
    res.render("users/signup");
});


router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({email, username});
        const registeredUser= await User.register(newUser, password);
        req.flash("success","Welcome to Roomify");
        res.redirect("/listing"); 
    } catch(er){
            req.flash("error",er.message);
            res.redirect("/user/signup"); 
        }

}));

// Login
router.get("/login",(req,res)=>{
    res.render("users/login");
});

router.post("/login",
    passport.authenticate("local",{failureRedirect:"/user/login", failureFlash:true}),
    async(req,res)=>{
    req.flash("success","welcome to Roomify");
    res.redirect("/listing");
});

//logout
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","successfully logged out");
        res.redirect("/listing");
    });
});
module.exports=router;