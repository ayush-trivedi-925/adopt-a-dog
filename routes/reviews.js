const express = require("express");
const router = express.Router({ mergeParams: true });

const Dog = require("../models/dog");
const Review = require("../models/review");

const { reviewSchema } = require("../schemas/validate");
const AppError = require("../utilities/AppError");
const wrapAsync = require("../utilities/wrapAsync");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware");

const reviews = require("../controllers/reviews");

router.post("/", isLoggedIn, validateReview, wrapAsync(reviews.createReview));

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(reviews.deleteReview)
);

module.exports = router;
