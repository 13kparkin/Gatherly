"use strict";
function generateRandomDates() {
  const today = new Date();
  const maxDays = 90;
  const start = new Date(today.getTime() + Math.random() * maxDays * 24 * 60 * 60 * 1000);
  const duration = Math.random() * 30 + 1;
  const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);
  return { startDate: start, endDate: end };
}

const { startDate, endDate } = generateRandomDates();

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Events";
    return queryInterface.bulkInsert(
      options,
      [
        {
          venueId: 1,
          groupId: 1,
          name: "Spring Music Festival",
          description: "Join us for a weekend of live music and fun!",
          type: "in person",
          capacity: 1000,
          price: 75.0,
          startDate: startDate.toLocaleString(),
          endDate: endDate.toLocaleString(),
        },
        {
          venueId: 1,
          groupId: 2,
          name: "Tech Conference 2023",
          description: "The must-attend conference for tech enthusiasts",
          type: "in person",
          capacity: 500,
          price: 250.0,
          startDate: startDate.toLocaleString(),
          endDate: endDate.toLocaleString(),
        },
        {
          venueId: 1,
          groupId: 3,
          name: "Virtual Art Exhibition",
          description: "Experience art from around the world from the comfort of your own home",
          type: "online",
          capacity: 1000,
          price: 20.0,
          startDate: startDate.toLocaleString(),
          endDate: endDate.toLocaleString(),
        },
        {
          venueId: 1,
          groupId: 3,
          name: "Wine Tasting and Pairing",
          description: "Learn about different wines and food pairings with our expert sommeliers",
          type: "in person",
          capacity: 50,
          price: 150.0,
          startDate: startDate.toLocaleString(),
          endDate: endDate.toLocaleString(),
        },
        {
          venueId: 1,
          groupId: 2,
          name: "Entrepreneurship Summit",
          description: "Connect with other entrepreneurs and learn about the latest trends and strategies",
          type: "in person",
          capacity: 500,
          price: 100.0,
          startDate: startDate.toLocaleString(),
          endDate: endDate.toLocaleString(),
        },
        {
          venueId: 1,
          groupId: 1,
          name: "Spring Music Festival",
          description: "Join us for a weekend of live music and fun!",
          type: "in person",
          capacity: 1000,
          price: 75.0,
          startDate: startDate.toLocaleString(),
          endDate: endDate.toLocaleString(),
        },
        {
          venueId: 1,
          groupId: 2,
          name: "Tech Conference 2023",
          description: "The must-attend conference for tech enthusiasts",
          type: "in person",
          capacity: 500,
          price: 250.0,
          startDate: startDate.toLocaleString(),
          endDate: endDate.toLocaleString(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["Demo-Event-1", "Demo-Event-2", "Demo-Event-3"] },
      },
      {}
    );
  },
};
