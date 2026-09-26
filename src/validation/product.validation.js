import Joi from "joi";

const createProductSchema = Joi.object({
  name: Joi.string().max(200).required(),
  shortDescription: Joi.string().max(500).required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).required(),
  discountPrice: Joi.number().min(0),
  stock: Joi.number().integer().min(0).required(),
  sku: Joi.string(),
  category: Joi.string().required(),
  subcategory: Joi.string(),
  brand: Joi.string(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
          return helpers.error("any.invalid");
        }

        return parsed;
      } catch {
        return helpers.error("any.invalid");
      }
    }),
  ),
  featured: Joi.boolean(),
  isActive: Joi.boolean(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().max(200),
  shortDescription: Joi.string().max(500),
  description: Joi.string(),
  price: Joi.number().min(0),
  discountPrice: Joi.number().min(0),
  stock: Joi.number().integer().min(0),
  sku: Joi.string(),
  category: Joi.string(),
  subcategory: Joi.string(),
  brand: Joi.string(),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);

        if (!Array.isArray(parsed)) {
          return helpers.error("any.invalid");
        }

        return parsed;
      } catch {
        return helpers.error("any.invalid");
      }
    }),
  ),
  featured: Joi.boolean(),
  isActive: Joi.boolean(),
  deletedImages: Joi.alternatives().try(
    Joi.string(),
    Joi.array().items(Joi.string()),
  ),
});

export { createProductSchema, updateProductSchema };
