"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Groups";
    return queryInterface.bulkInsert(
      options,
      [
  {
    organizerId: 1,
    name: "Tech Entrepreneurs NYC",
    about: "We're a group of tech entrepreneurs in New York City who meet regularly to share ideas, network, and help each other grow our businesses.",
    type: "in person",
    isPrivate: false,
    city: "New York",
    state: "NY",
  },
  {
    organizerId: 2,
    name: "LA Outdoor Adventures",
    about: "We're a community of outdoor enthusiasts in Los Angeles who love hiking, camping, and exploring the great outdoors. Join us for our next adventure!",
    type: "in person",
    isPrivate: true,
    city: "Los Angeles",
    state: "CA",
  },
  {
    organizerId: 3,
    name: "Virtual Book Club",
    about: "Our book club meets online every month to discuss the latest bestsellers and discover new authors. Join us for lively discussions and great company!",
    type: "online",
    isPrivate: false,
    city: "New York",
    state: "NY",
  },
  {
    organizerId: 1,
    name: "Women in Business LA",
    about: "We're a group of successful women entrepreneurs in Los Angeles who support each other in business and in life. Join us for our next networking event!",
    type: "in person",
    isPrivate: true,
    city: "Los Angeles",
    state: "CA",
  },
  {
    organizerId: 1,
    name: "NYC Foodies",
    about: "We're a group of food lovers in New York City who love trying new restaurants, sharing our favorite recipes, and exploring the local food scene. Come join us!",
    type: "in person",
    isPrivate: false,
    city: "New York",
    state: "NY",
  },
  {
    organizerId: 2,
    name: "Virtual Yoga Classes",
    about: "Join our online yoga community for daily classes, personalized instruction, and a supportive community. All levels welcome!",
    type: "online",
    isPrivate: false,
    city: "New York",
    state: "NY",
  }
],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["demo-group-1", "demo-group-2"] },
      },
      {}
    );
  },
};
