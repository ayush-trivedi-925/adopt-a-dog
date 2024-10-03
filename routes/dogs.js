const express = require("express");
const router = express.Router();
const Dog = require("../models/dog");
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

const AppError = require("../utilities/AppError");
const wrapAsync = require("../utilities/wrapAsync");
const {
  isLoggedIn,
  storeReturnTo,
  validateDogs,
  isAuthor,
} = require("../middleware");

const dogs = require("../controllers/dogs");

router
  .route("/")
  .get(wrapAsync(dogs.index))
  .post(
    isLoggedIn,
    upload.array("image"),
    validateDogs,
    wrapAsync(dogs.createDogProfile)
  );
// .post(upload.array("image"), (req, res) => {
//   res.send({ body: req.body, file: req.files });
// });

router.get("/new", isLoggedIn, dogs.renderNewForm);

router
  .route("/:id")
  .get(wrapAsync(dogs.showDetails))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("image"),
    validateDogs,
    wrapAsync(dogs.editDetails)
  )
  .delete(isLoggedIn, isAuthor, wrapAsync(dogs.deleteProfile));

router.get("/:id/edit", isLoggedIn, isAuthor, wrapAsync(dogs.getEditForm));

module.exports = router;
