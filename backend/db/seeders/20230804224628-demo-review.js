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
        userId:1,
        review:"I'm the owner and I think I run a pretty good spot",
        stars:5
      },
      {
        spotId:1,
        userId:2,
        review:"It was ok. If anything, the price was a bit much",
        stars:3
      },
      {
        spotId:3,
        userId:2,
        review:"Supper friendly host! Would definitely recomend if you ever find yourself in the area.",
        stars:5
      },
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
