const { number } = require("joi");
const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const listingSchema = new mongoose.Schema({
  title: 
       {type: String,
       required: true},
       
  description: String,
  price: Number,
  location: String,
  country: String,
  image: {
    url: {
     type: String,
    set: (v) => v && v.trim() !== "" 
      ? v 
      : "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    default: "https://images.unsplash.com/photo-1506744038136-46273834b3fb"
         },
   filename: {
           type: String,
           default: "defaultImage"
         }
         },

        //  price : Number,
        //  location : String,
        //   country : String,
          reviews: [
            {
              type: Schema.Types.ObjectId,
              ref: "Review"
            }
          ],
          default:[]
        });
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
