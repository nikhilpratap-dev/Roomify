const express=require("express");
const app=express();
const mongoose=require("mongoose");
// const Listing=require("./models/listing.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
// const wrapAsync=require("./utility/wrapAsync.js");
const ExpressError=require("./utility/ExpressError.js");
const listing=require("./routes/listing.js");
const review=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));
app.use(express.json());

const url='mongodb://127.0.0.1:27017/roomify';

//database connection
async function main() {
  await mongoose.connect(url);
  console.log("mongo are working");
};

main().catch(err => console.log(err));



app.listen(8080,()=>{
    console.log("all fine 1");
});

app.get("/",(req,res)=>{
    console.log("all fine");
});

//express session
const sessionOptions={
    secret:"itsSecretCode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    next();
});

app.use("/listing",listing);
app.use("/listing/:id/reviews",review);




// error handling

app.use((req,res,next) => {
    next(new ExpressError(404,"page not found"));
});

app.use((err,req,res,next) => {
    let {status=400, message="something went wrong"}=err;
    res.render("error.ejs",{message});
    // res.status(status).send(message);
});