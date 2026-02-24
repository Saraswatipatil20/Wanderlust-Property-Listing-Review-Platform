const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing.js');
const path = require('path');
const methodOverride = require('method-override');
const ejsmate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema, reviewSchema }= require('./schema.js');
const Review = require('./models/review.js');


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
      .then(() =>
         { console.log('MongoDB connection successful, connected to db'); }
          )
      .catch((err) =>{
         console.log(err);
        });


async function main() {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');
}

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.engine('ejs', ejsmate);
app.use(express.static(path.join(__dirname, '/public')));


//validate listing
const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);
 
  if(error){
    let errMsg = error.details.map(el => el.message).join(",");
  throw new ExpressError(400 , errMsg);
}
else
  {
    next(); 
  }
};

//validate review

const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
 
  if(error){
    let errMsg = error.details.map(el => el.message).join(",");
  throw new ExpressError(400 , errMsg);
}
else
  {
    next(); 
  }
};


//home route
app.get("/", (req, res) => {
    res.send("Welcome to Wanderlust! Explore the world with us.");
   
});


//index route
app.get("/listing",  wrapAsync(async(req, res) => {
   const alllistings = await Listing.find({});
    console.log("All listings:", alllistings);
  res.render("listing/index", { alllistings });

}));


 //   new route
app.get("/listing/new", (req, res) => {
  res.render("listing/new");
});

//show route
app.get("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id).populate("reviews");
  res.render("listing/show", { listing });

}));

// create route

app.post("/listing", validateListing,  wrapAsync (async (req, res , next) => {
    
    console.log("body:" , req.body);
     const newListing = new Listing(req.body.listing);
     console.log(req.body)
     await newListing.save(); 
     console.log("saved:" ,newListing)
    res.redirect("/listing");

})
);


// EDIT route 
app.get("/listing/:id/edit", wrapAsync(async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listing/edit", { listing });
}));


// Update Route
app.put("/listing/:id", validateListing, wrapAsync(async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listing/${id}`);
}));


//delete route
app.delete("/listing/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
  console.log("Deleting:", id, reviewId);
  res.redirect("/listing");
}));

// REVIEW route
//post rout of review 
app.post("/listing/:id/review",validateReview, wrapAsync( async (req, res) => {
 
  let listing = await Listing.findById(req.params.id);
  let newReview = new Review(req.body.review);

   listing.reviews.push(newReview);

   await newReview.save();
   await listing.save();

   console.log("new review saved to db");
   

res.redirect(`/listing/${listing._id}`);
}));


// delete route for review
app.delete ("/listing/:id/reviews/:reviewId",
  wrapAsync(async (req,res)=>
{
   let {id,reviewId} = req.params;
 await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
 await Review.findByIdAndDelete(reviewId);

 //redirect to same page
 res.redirect(`/listing/${id}`);
}
));










app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("error.ejs", { message });

});

app.listen(3000, () => {
    console.log(' listening on port 3000!');
 
});