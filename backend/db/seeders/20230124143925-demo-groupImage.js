const groupImage1 = 'https://images.pexels.com/photos/853168/pexels-photo-853168.jpeg';
const groupImage2 = 'https://images.pexels.com/photos/1267697/pexels-photo-1267697.jpeg';
const groupImage3 = 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg';
const groupImage4 = 'https://images.pexels.com/photos/1963622/pexels-photo-1963622.jpeg';
const groupImage5 = 'https://images.pexels.com/photos/2014775/pexels-photo-2014775.jpeg';
const groupImage6 = 'https://images.pexels.com/photos/3046299/pexels-photo-3046299.jpeg';

'use strict';


let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    return queryInterface.bulkInsert(options,[
      {
        groupId: 1,
        url: groupImage1,
        preview: true
      },
      {
        groupId: 2,
        url: groupImage2,
        preview: true
      },
      {
        groupId: 3,
        url: groupImage3,
        preview: true
      },
      {
        groupId: 4,
        url: groupImage4,
        preview: true
      },
      {
        groupId: 5,
        url: groupImage5,
        preview: true
      },
      {
        groupId: 6,
        url: groupImage6,
        preview: true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "GroupImages";

  }
};
