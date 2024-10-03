const mongoose = require("mongoose");
const Dog = require("../models/dog");
const indiaCities = require("./cities");
const imgs = require("./img");
const { descriptors, breeds, colors, age, sex } = require("./seedDogs");

mongoose.connect("mongodb://localhost:27017/adopt-a-dog");

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection error"));
db.once("open", () => {
  console.log("Database connection established");
});

const randEle = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Dog.deleteMany({});
  for (let i = 0; i < 150; i++) {
    const random25 = Math.floor(Math.random() * indiaCities.length);
    const randomImg1 = Math.floor(Math.random() * imgs.length);
    const randomImg2 = Math.floor(Math.random() * imgs.length);
    const newDog = new Dog({
      name: `${randEle(descriptors)} ${randEle(breeds)}`,
      sex: `${randEle(sex)}`,
      age: `${randEle(age)}`,
      color: `${randEle(colors)}`,
      location: `${indiaCities[random25].city}, ${indiaCities[random25].state}`,
      author: "66f90ccd7ade7c323a82766c",
      geometry: {
        type: "Point",
        coordinates: [
          indiaCities[random25].longitude,
          indiaCities[random25].latitude,
        ],
      },
      images: [imgs[randomImg1], imgs[randomImg2]],

      about:
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente explicabo dolorem, alias illum magnam facere molestias numquam distinctio, eaque odio iure nihil itaque in. Excepturi optio nam est magni facere!Lorem, ipsum dolor sit amet consectetur adipisicing elit.",
    });
    await newDog.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
