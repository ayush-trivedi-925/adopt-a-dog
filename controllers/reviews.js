const Dog = require("../models/dog");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  const dog = await Dog.findById(req.params.id);
  const { body, rating } = req.body;
  const review = new Review({ body, rating });
  review.author = req.user._id;
  dog.reviews.push(review);
  await review.save();
  await dog.save();
  req.flash("success", "Review added successfully!");
  res.redirect(`/dogs/${dog._id}`);
};

module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Dog.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review deleted successfully!");
  res.redirect(`/dogs/${id}`);
};
