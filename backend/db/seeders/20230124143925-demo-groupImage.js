import groupImage1 from '../../images/groupImages/group1.jpg';
import groupImage2 from '../../images/groupImages/group2.jpg';
import groupImage3 from '../../images/groupImages/group3.jpg';
import groupImage4 from '../../images/groupImages/group4.jpg';
import groupImage5 from '../../images/groupImages/group5.jpg';
import groupImage6 from '../../images/groupImages/group6.jpg';

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
        preview: false
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
        preview: false
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
