const express = require("express");
const app = express(); // requiring and initializing express

const mongoose = require("mongoose");
const Listing = require("./models/listing.js");

const path = require("path"); //Set up path so that code knows where the views are stored
const methodOverride = require("method-override"); //To use PUT request in edit.ejs

const ejsMate = require("ejs-mate"); //To use ejs as a template engine


const wrapAsync = require("./utils/wrapAsync.js"); //To use async await in express routes
const ExpressError = require("./utils/ExpressError.js"); //To create custom error class for handling errors

const { listingSchema,reviewSchema } = require("./schema.js"); //To validate the data using Joi

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //copied form mongoosejs.com and changed db name to wanderlust

const Review = require("./models/review.js");


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  }); //Confirmation that connection to db is success if any error catch is there to print to console

async function main() {
  await mongoose.connect(MONGO_URL);
} //For DB Wanderlust

app.set("view engine", "ejs"); //Setting up our views engine as ejs
app.set("views", path.join(__dirname, "views")); //joining the path for views directory and views engine
app.use(express.urlencoded({ extended: true })); //This line is to parse the data that we would receive in the request while extracting the id
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate); //To use ejs as a template engine

app.use(express.static(path.join(__dirname, "public"))); //To use the public folder for static files like style.css



app.get("/", (req, res) => {
  res.send("Hi, I am root");
}); //Basic API at ROOT point "/"

const validateListing = (req, res, next) => {
  let {error} = listingSchema.validateAsync(req.body.listing) //Validating the data using Joi
  console.log(req.body.listing); //Printing the data on console

  if(result.error){
    let errMsg = result.error.details.map((el) => el.message).join(", "); //To get the error message in a readable format ,message separated by comma ,

      throw new ExpressError(400, error.message); //If the data is not valid then throw an custom  error
  }else {
      next(); //If the data is valid then move to the next middleware
  }
};


const validateReview = (req, res, next) => {
  let {error} = reviewSchema.validateAsync(req.body)


  if(error){
    let errMsg = error.details.map((el) => el.message).join(", ");

      throw new ExpressError(400, error.message);
  }else {
      next();
  }
}





// ! Index Route
app.get("/listings", wrapAsync( async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// ! New Route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});




// ! Show Route
// app.get("/listings/:id",  wrapAsync(async (req, res) => {
//   let { id } = req.params; //To extract the id

//   const listing = await Listing.findById(id); // To get the data from the id

//   res.render("listings/show.ejs", { listing });
// }));

app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    if (!id) {
      return next(new ExpressError(400, "Listing ID is required!"));
    }
    const listing = await Listing.findById(id).populate("reviews"); // populate is used to get the data from the reviews collection using the id of the reviews in the listing collection
    if (!listing) {
      return next(new ExpressError(404, "Listing not found!"));
    }
    res.render("listings/show.ejs", { listing });
  })
);



// ! Create Route :: To create a new Listing
app.post("/listings", validateListing , wrapAsync(async (req, res, next) => {


  const newListing = new Listing(req.body.listing);

  // req.body.listing returns a JS object with all the values of the newly created listing as key-value pairs

  await newListing.save();    // saves it to the database
  res.redirect("/listings");

}));

//  ! Edit Route
app.get("/listings/:id/edit", wrapAsync( async (req, res) => {
  let { id } = req.params;                   //So that we could show the listing values as placeholders on the edit page
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
}));

//! Update Route
app.put("/listings/:id",validateListing,  wrapAsync(async (req, res) => {
  //PUT request is used by method overriding
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing }); // ...req.body.listing  means we are deconstructing the object

  res.redirect(`/listings/${id}`); //Using `/listings/${id}` we can redirect the page to the same show page of the listing which was being edited
}));

// ! Delete Route
app.delete("/listings/:id",  wrapAsync(async (req, res) => {
  let { id } = req.params;                //extracting id
  let deletedListing = await Listing.findByIdAndDelete(id);     //Printing deleted listing on console
  console.log(deletedListing);
  res.redirect("/listings");
}));

// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample saved");
//   res.send("successful");
// });

// ! Reviews
// * Post Route
app.post("/listings/:id/reviews", validateReview, wrapAsync (async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review); //Creating a new review using the data from the form

    listing.reviews.push(newReview); //Pushing the new review to the listing

    newReview.save(); //Saving the new review to the database
    await listing.save(); //Saving the listing to the database
  res.redirect(`/listings/${listing._id}`); //Redirecting to the show page of the listing
}))



app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!")); //To handle all the routes that are not defined
});


  // Extract status code and message from error object, with default values
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});


app.listen(8080, () => {
  console.log("server is listening to port 8080");
}); //To start the server





























// const express = require("express");
// const app = express(); // requiring and initializing express

// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");

// const path = require("path"); //Set up path so that code knows where the views are stored
// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"; //copied form mongoosejs.com and changed db name to wanderlust

// main()
//   .then(() => {
//     console.log("connected to DB");
//   })
//   .catch((err) => {
//     console.log(err);
//   }); //Confirmation that connection to db is success if any error catch is there to print to console

// async function main() {
//   await mongoose.connect(MONGO_URL);
// } //For DB Wanderlust

// app.set("view engine", "ejs"); //Setting up our views engine as ejs
// app.set("views", path.join(__dirname, "views")); //joining the path for views directory and views engine
// app.use(express.urlencoded({ extended: true })); //This line si to parse the data that we would receive in the request while extracting the id

// app.get("/", (req, res) => {
//   res.send("I am root");
// }); //Basic API at ROOT pont "/"

// //Index Route
// app.get("/listing", async (req, res) => {
//   const alllisting = await Listing.find({});
//   res.render("listing/index.ejs", { alllisting });
// });

// //New Route
// app.get("/listings/new", (req, res) => {
//   res.render("listing/new.ejs");
// });

// //Show Route
// app.get("/listing/:id", async (req, res) => {
//   let { id } = req.params;                    //To extract teh id
//   const listing = await Listing.findById(id.trim()); // To get the data from the id
//   res.render("listing/show.ejs", { listing });
// });

// // app.get("/testListing", async (req, res) => {
// //   let sampleListing = new Listing({
// //     title: "My New Villa",
// //     description: "By the beach",
// //     price: 1200,
// //     location: "Calangute, Goa",
// //     country: "India",
// //   });

// //   await sampleListing.save();
// //   console.log("sample saved");
// //   res.send("successful");
// // });

// app.listen(8080, () => {
//   console.log("Server is listening to port 8080");
// }); //To start the server
