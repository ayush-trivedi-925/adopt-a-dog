const mongoose = require("mongoose");
const Review = require("./review");
const { coordinates } = require("@maptiler/client");

const Schema = mongoose.Schema;
const opts = { toJSON: { virtuals: true } };
const dogSchema = new Schema(
  {
    name: String,
    images: [
      {
        url: String,
        filename: String,
      },
    ],
    sex: String,
    age: Number,
    color: String,
    about: String,
    geometry: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    location: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  opts
);

dogSchema.virtual("properties.popUpMarkUp").get(function () {
  return `<strong><a href=dogs/${this._id}>${this.name}</a></strong>
  <p>${this.about.substring(0, 20)}...</p>`;
});

dogSchema.post("findOneAndDelete", async (dog) => {
  if (dog.reviews.length) {
    await Review.deleteMany({ _id: { $in: dog.reviews } });
  }
});

module.exports = mongoose.model("Dog", dogSchema);
