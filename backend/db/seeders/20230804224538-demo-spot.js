'use strict';

const { Spot } = require('../models');
// const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Spot.bulkCreate([
      {
        ownerId:1,
        address:'118 Ravenrock Road',
        city:'Albertsville',
        state:'Ontario',
        country:'Canada',
        lat:42,
        lng:42,
        name:"Joe's Bed and Breakfast",
        description:'A cozy lodge to rest up after all your adventures in scenic Ontario.',
        price:89.99
      },
      {
        ownerId:1,
        address:'320 Rockraven Street',
        city:'Saskatoonston',
        state:'Ontario',
        country:'Canada',
        lat:44,
        lng:44,
        name:'The Flophouse',
        description:"Let's be real; you're poor and you're not getting a better offer for a place to crash.",
        price:10
      },
      {
        ownerId:2,
        address:'401 Visionary Way',
        city:'Townsville',
        state:'Denial',
        country:'Roads',
        lat:51,
        lng:20,
        name:'Home Stay',
        description:'Come and sleep over like an old friend. No Smoking.',
        price:40.50
      },
    ], {validate:true})
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Joe's Bed and Breakfast", 'The Flophouse', 'Home Stay'] }
    }, {});
  }
};
