import Joi from 'joi'

 const createOrderValidation = Joi.object({
  shippingAddress: Joi.object({
    fullName: Joi.string().trim().required(),
    phone: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    postalCode: Joi.string().trim().required(),
  }).required(),

  paymentMethod: Joi.string()
    .valid('cash', 'stripe', 'paypal', 'paymob')
    .default('cash'),

  customerNote: Joi.string().max(1000).allow('', null),
})

 const updateOrderStatusValidation = Joi.object({
  status:Joi.string().trim().required().valid('pending', 'confirmed', 'processing', 'shipped','delivered','cancelled','returned')
    .default('pending'),
  adminNote:Joi.string().max(1000).allow('', null),
})

export {createOrderValidation,updateOrderStatusValidation}


