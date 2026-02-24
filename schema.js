const Joi = require("joi");



 module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required(),
     description: Joi.string()
      .required()
      .messages({
        "string.empty": "Description cannot be empty!",
        "any.required": "Description is required!",
      }),
     price: Joi.number()
      .required()
      .min(0)
      .messages({
        "number.base": "please enter a valid range for price!",
        "number.min": "Price cannot be negative!",
        "any.required": "Price is required!",
      }),

    location: Joi.string().required(),
    country: Joi.string().required(),
    image: Joi.object({
      url: Joi.string().uri().allow("", null),
      filename: Joi.string().allow("", null)
    }).default({})
  }).required()
}); 


module.exports.reviewSchema =Joi.object(
{
  review : Joi.object 
        ({

          rating: Joi.number().required().min(1).max(5),
          comment: Joi.string().required()
                   
        })
        .required()

})