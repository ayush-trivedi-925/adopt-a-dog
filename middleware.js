const { dogSchema, reviewSchema } = require("./schemas/validate");
const AppError = require("./utilities/AppError");
const Dog = require("./models/dog");
const Review = require("./models/review");

const isLoggedIn = function (req, res, next) {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be logged in to do this task");
    res.redirect("/login");
  } else {
    next();
  }
};

const storeReturnTo = function (req, res, next) {
  if (req.session.returnTo) {
    res.locals.returnTo = req.session.returnTo;
    delete req.session.returnTo; // deletes returnTo after storing its value.
  }
  next();
};

const validateDogs = function (req, res, next) {
  const { error } = dogSchema.validate(req.body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 500);
  } else {
    next();
  }
};

const isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const dog = await Dog.findById(id);
  if (!dog.author._id.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit this dog's profile!");
    return res.redirect(`/dogs/${dog._id}`);
  }
  next();
};
const isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author._id.equals(req.user._id)) {
    req.flash("error", "You don't have permission to edit this dog's profile!");
    return res.redirect(`/dogs/${review._id}`);
  }
  next();
};

const validateReview = function (req, res, next) {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 500);
  } else {
    next();
  }
};
module.exports = {
  isLoggedIn,
  storeReturnTo,
  validateDogs,
  isAuthor,
  validateReview,
  isReviewAuthor,
};
