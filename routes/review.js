const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {reviewSchema}=require("../schema.js");
const {isLoggedIn, isAuthor}=require("../middleware.js");
const reviewController=require("../controllers/review.js");


// review validation
const reviewValidation=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};
    
//create review
router.post("/",isLoggedIn,wrapAsync(reviewController.createReview));


//delete review
router.delete("/:reviewId",isLoggedIn,isAuthor,wrapAsync(reviewController.deleteReview));



module.exports = router;