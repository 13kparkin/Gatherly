'use strict';

let options = {};
if (process.env.NODE_ENV === "production") {
  options.schema = process.env.SCHEMA; // define your schema in options object
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    options.tableName = "Groups";
    return queryInterface.bulkInsert(options, [{
      name: 'demo-group-1',
      about: 'This is the first demo group',
      type: 'Online',
      private: false,
      city: 'New York',
      state: 'NY',
  }, {
      name: 'demo-group-2',
      about: 'This is the second demo group',
      type: 'Online',
      private: true,
      city: 'Los Angeles',
      state: 'CA',
  }], {});
  },

  async down (queryInterface, Sequelize) {
    options.tableName = "Groups";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(
      options,
      {
        name: { [Op.in]: ["demo-group-1", "demo-group-2"] },
      },
      {}
    );
  }
};
