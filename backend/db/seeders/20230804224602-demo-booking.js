'use strict';

const { Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}


module.exports = {
  async up (queryInterface, Sequelize) {
    await Booking.bulkCreate([
      {
        spotId:1,
        userId:2,
        startDate:new Date('2023-09-09'),
        endDate:new Date('2023-10-01'),
      },
      {
        spotId:1,
        userId:3,
        startDate:new Date('2023-11-11'),
        endDate:new Date('2024-01-01'),
      },
      {
        spotId:2,
        userId:1,
        startDate:new Date('2023-09-13'),
        endDate:new Date('2023-11-19'),
      },
    ], { validate: true })
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Bookings';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2] }
    }, {});
  }
};
