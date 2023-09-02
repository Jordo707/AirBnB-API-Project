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
        spotId:1,
        url:"https://cdn.discordapp.com/attachments/880221705191161867/1147335597812355142/images.png",
        preview:false
      },
      {
        spotId:1,
        url:"https://cdn.discordapp.com/attachments/880221705191161867/1147335597812355142/images.png",
        preview:false
      },
      {
        spotId:1,
        url:"https://cdn.discordapp.com/attachments/880221705191161867/1147335829912563763/images.png",
        preview:false
      },
      {
        spotId:1,
        url:"https://cdn.discordapp.com/attachments/880221705191161867/1147335597812355142/images.png",
        preview:false
      },
      {
        spotId:2,
        url:"https://static.rdc.moveaws.com/images/hero/AIDH/mobile-2x.jpg",
        preview:true
      },
      {
        spotId:2,
        url:"https://cdn.discordapp.com/attachments/880221705191161867/1147336335057760356/image.png",
        preview:false
      },
      {
        spotId:2,
        url:"https://cdn.discordapp.com/attachments/880221705191161867/1147336537642635414/images.png",
        preview:false
      },
      {
        spotId:2,
        url:"https://cdn.discordapp.com/attachments/880221705191161867/1147336843331907664/1000_F_557284921_FVVjuSF7ihIrAlOlkRliBP6DhEDzM4Yo.png",
        preview:false
      },
      {
        spotId:2,
        url:"https://cdn.discordapp.com/attachments/880221705191161867/1147337056348028988/images.png",
        preview:false
      },
      {
        spotId:3,
        url:"https://www.bhg.com/thmb/H9VV9JNnKl-H1faFXnPlQfNprYw=/1799x0/filters:no_upscale():strip_icc()/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
        preview:true
      },
      {
        spotId:3,
        url:"https://cdn-bnokp.nitrocdn.com/QNoeDwCprhACHQcnEmHgXDhDpbEOlRHH/assets/images/optimized/rev-a642abc/www.decorilla.com/online-decorating/wp-content/uploads/2020/07/House-interior-design-of-a-chic-living-room.jpeg",
        preview:false
      },
      {
        spotId:3,
        url:"https://www.mydomaine.com/thmb/pv5siwAW2ETD7GVNTmlUjew7KnE=/700x0/filters:no_upscale():strip_icc()/cdn.cliqueinc.com__cache__posts__87585__first-home-decorating-ideas-87585-1515441655476-main.700x0c-cca23779528546f08201f8b867c805bb.jpg",
        preview:false
      },
      {
        spotId:3,
        url:"https://media.architecturaldigest.com/photos/5eac5fa22105f13b72dede45/4:3/w_1420,h_1065,c_limit/111LexowAve_Aug18-1074.jpg",
        preview:false
      },
      {
        spotId:3,
        url:"https://www.thespruce.com/thmb/o_zAsNy0xWNWeq9xfWwAo6fhueo=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/SPR-luxury-kitchens-5211364-hero-688d716970544978bc12abdf17ce6f83.jpg",
        preview:false
      },
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
