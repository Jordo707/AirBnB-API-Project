'use strict';

const { Review } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await Review.bulkCreate([
      {
        spotId:1,
        userId:3,
        review:"It's well worth every penny. Had an absolutely fantastic time here!",
        stars:5
      },
      {
        spotId:1,
        userId:2,
        review:"It was ok. If anything, the price was a bit much",
        stars:3
      },
      {
        spotId:2,
        userId:3,
        review:"It was pretty good, but it always felt like something was missing.",
        stars:4
      },
      {
        spotId:3,
        userId:1,
        review:"I had an absolutely wonderful time here! Denial is my favorite state to be in. :-)",
        stars:5
      },
      {
        spotId:3,
        userId:2,
        review:"The host promised me that They'd give me a discount if I gave them 5 stars, I'd have done it for free though.",
        stars:5
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Reviews';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,3] }
    }, {});
  }
};
