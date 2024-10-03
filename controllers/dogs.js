const { query } = require("express");
const { cloudinary } = require("../cloudinary");
const Dog = require("../models/dog");
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async (req, res) => {
  const dogs = await Dog.find({});
  res.render("dogs/allDogs", { dogs });
};

module.exports.renderNewForm = (req, res) => {
  res.render("dogs/new");
};

module.exports.createDogProfile = async (req, res) => {
  const { name, location, color, sex, about, age } = req.body;
  const geoData = await maptilerClient.geocoding.forward(req.body.location, {
    limit: 1,
  });
  const newDog = new Dog({ name, location, color, sex, about, age });
  newDog.geometry = geoData.features[0].geometry;

  newDog.images = req.files.map((fn) => ({
    url: fn.path,
    filename: fn.filename,
  }));
  newDog.author = req.user._id;
  await newDog.save();
  console.log(newDog);

  req.flash("success", "Welcome to the pack! Dog added successfully!");
  res.redirect(`/dogs/${newDog._id}`);
};

module.exports.showDetails = async (req, res) => {
  // const response = await fetch("https://dog.ceo/api/breeds/image/random");
  // const data = await response.json();

  // // Get the image URL from the JSON response
  // const imageUrl = data.message;

  const { id } = req.params;
  const dog = await Dog.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  if (dog) {
    res.render("dogs/show", { dog, id });
  } else {
    req.flash("error", "Dog profile not found!");
    res.redirect("/dogs");
  }
};

module.exports.getEditForm = async (req, res) => {
  const { id } = req.params;
  const foundDog = await Dog.findById(id);
  if (!foundDog) {
    req.flash("error", "Dog profile not found!");
    return res.redirect("/dogs");
  }
  res.render("dogs/edit", { foundDog });
};

module.exports.editDetails = async (req, res) => {
  const { id } = req.params;

  const { name, location, color, sex, age, about } = req.body;

  const updatedDog = await Dog.findByIdAndUpdate(id, {
    name,
    location,
    color,
    sex,
    age,
    about,
  });
  const geoData = await maptilerClient.geocoding.forward(req.body.location, {
    limit: 1,
  });
  updatedDog.geometry = geoData.features[0].geometry;
  const imgs = req.files.map((fn) => ({
    url: fn.path,
    filename: fn.filename,
  }));
  updatedDog.images.push(...imgs);
  await updatedDog.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await updatedDog.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }
  req.flash("success", "Dog information updated!");
  res.redirect(`/dogs/${id}`);
};

module.exports.deleteProfile = async (req, res) => {
  const { id } = req.params;
  const dog = await Dog.findByIdAndDelete(id);
  for (let image of dog.images) {
    await cloudinary.uploader.destroy(image.filename);
  }
  req.flash("success", "Dog's profile has been successfully removed!");
  res.redirect("/dogs");
};
