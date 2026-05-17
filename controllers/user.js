const User=require("../models/user.js");


//sign up page
module.exports.signupPage=(req,res)=>{
    res.render("users/signup");
};

//sign up
module.exports.signup=async (req,res)=>{
    try{
        let {username, email, password}=req.body;
        const newUser=new User({email, username});
        const registeredUser= await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
        req.flash("success","Welcome to Roomify");
        res.redirect("/listing");
        });
    } catch(er){
            req.flash("error",er.message);
            res.redirect("/user/signup"); 
        }

}

// render Login page
module.exports.loginPage=(req,res)=>{
    res.render("users/login");
}

//Login 
module.exports.login=async(req,res)=>{
    req.flash("success","welcome to Roomify");
    let redirectUrl=res.locals.redirectUrl || ("/listing");
    res.redirect(redirectUrl);
}

//log out
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","successfully logged out");
        res.redirect("/listing");
    });
}