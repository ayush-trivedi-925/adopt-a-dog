const BaseJoi = require("joi");

const extension = (Joi) => ({
  type: "string",
  base: Joi.string(),
  messages: {
    "string.escapeHTML": "{{#label}} must not include HTML",
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        const clean = sanitizeHtml(value, {
          allowedTags: [],
          allowedAttributes: {},
        });

        if (clean !== value) {
          return helpers.error("string.escapeHTML", { value }); // `helpers` is passed by the context
        }
        return clean;
      },
    },
  },
});

const Joi = BaseJoi.extend(extension);

const { type, messages, rules } = require("joi-html-input");
const sanitizeHtml = require("sanitize-html");
const escapeHTML = require("escape-html");
const { validate } = require("../models/review");
// const { helpers } = require("@maptiler/sdk");
const SexEnum = ["Male", "Female"];

const dogSchema = Joi.object({
  name: Joi.string().required().escapeHTML(),
  sex: Joi.string()
    .valid(...SexEnum)
    .required(), // Only allows "Male" or "Female",
  age: Joi.number().min(0).max(3).required(),
  color: Joi.string().required().escapeHTML(),
  about: Joi.string().required().escapeHTML(),
  location: Joi.string().required(),
  deleteImages: Joi.array(),
});

const reviewSchema = Joi.object({
  body: Joi.string().required().escapeHTML(),
  rating: Joi.number().min(1).max(5).required(),
});

module.exports = {
  dogSchema,
  reviewSchema,
};
