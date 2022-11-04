const { Tag } = require("../models");
//seed data that is importted into mysql through the package.json file via the index.js file when you run nmp run seed in the terminal
const tagData = [
  {
    tag_name: "rock music",
  },
  {
    tag_name: "pop music",
  },
  {
    tag_name: "blue",
  },
  {
    tag_name: "red",
  },
  {
    tag_name: "green",
  },
  {
    tag_name: "white",
  },
  {
    tag_name: "gold",
  },
  {
    tag_name: "pop culture",
  },
];

const seedTags = () => Tag.bulkCreate(tagData);

module.exports = seedTags;
