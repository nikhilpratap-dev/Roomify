const express=require("express");
const router=express.Router();
const Listing=require("../models/listing.js");
const wrapAsync=require("../utility/wrapAsync.js");
const ExpressError=require("../utility/ExpressError.js");
const {listingSchema}=require("../schema.js");
const {isLoggedIn, isowner}=require("../middleware.js"); 
const listingController=require("../controllers/listing.js");
const multer=require("multer");
const {storage}=require("../cloudConfig.js");
const upload=multer({ storage });



//schema validation
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//index route
router.get("/",wrapAsync(listingController.index));

//create new route
router.get("/new",isLoggedIn,listingController.createNewListing);

//show route
router.get("/:id",wrapAsync(listingController.showListing));

// add new data
router.post("/new/add",isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.addNewListing));


//edit route
router.get("/:id/edit",isLoggedIn, isowner,wrapAsync(listingController.editListingPage));
//update route
router.put("/:id/update",isLoggedIn,isowner,validateListing,wrapAsync(listingController.updatePage));

//DELETE ROUTE
router.delete("/:id/delete",isLoggedIn,isowner,wrapAsync(listingController.deleteListing));

module.exports = router;