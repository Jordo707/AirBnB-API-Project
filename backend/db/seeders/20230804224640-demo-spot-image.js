'use strict';

const { SpotImage } = require('../models')

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up (queryInterface, Sequelize) {
    await SpotImage.bulkCreate([
      {
        spotId:1,
        url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVU1M7ZeTZH1--U6b9I9s7fDhJ84H8Q0oZKA&usqp=CAU",
        preview:true
      },
      {
        spotId:2,
        url:"https://static.rdc.moveaws.com/images/hero/AIDH/mobile-2x.jpg",
        preview:true
      },
      {
        spotId:3,
        url:"https://beautifuldawndesigns.net/wp-content/uploads/2022/12/house-drawings-18.jpg",
        preview:true
      }
    ])
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      spotId: { [Op.in]: [1,2,3] }
    }, {});
  }
};
