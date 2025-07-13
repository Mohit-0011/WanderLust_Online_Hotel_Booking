const { ref } = require("joi");
const mongoose = require("mongoose");

const Schema = mongoose.Schema; // Shortform for mongoose.Schema for further use , Schema is the basic structure , similar to heading in table dbs

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v,
  }, // Ternary operator(if-else) is used to set the default value in case the image section is left empty while filling details
  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    }
  ]

});

const Listing = mongoose.model("Listing", listingSchema); // Creating a new document using the schema
module.exports = Listing; // is used to export the document so that it could be used in other files of the project
