const express = require('express');

const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const { Sequelize, Op } = require('sequelize')

// Create a spot
router.post('/',

async(req,res) => {
  const user = req.user.id;
  const { address, city, state, country, lat, lng, name,description,price} = req.body;

  const newSpot = Spot.build({
    ownerId:user, address, city, state, country, lat, lng, name, description ,price
  })

  // Ensure body validations
  if(isNaN(req.body.lat) || req.body.lat>90 || req.body.lat<-90) {
    res.status(400).json({error: `Latitude is not valid`})
  }
  if(isNaN(req.body.lng) || req.body.lng>180 || req.body.lng<-180) {
    res.status(400).json({error: `Longitude is not valid`})
  }
  if(req.body.name.length > 50) {
    res.status(400).json({error:`Name must be under 50 characters`})
  }
  if(isNaN(req.body.price) || req.body.price <= 0) {
    res.status(400).json({error:`Price is not valid`})
  }
  if(!isNaN(req.body.address) || req.body.address.length === 0) {
    res.status(400).json({error:`Address is invalid`})
  }
  if(!isNaN(req.body.city) || req.body.city.length === 0) {
    res.status(400).json({error:`City is invalid`})
  }
  if(!isNaN(req.body.state) || req.body.state.length === 0) {
    res.status(400).json({error:`State is invalid`})
  }
  if(!isNaN(req.body.country) || req.body.coutnry.length === 0) {
    res.status(400).json({error:`Country is invalid`})
  }
  if(!isNaN(req.body.name) || req.body.name.length === 0) {
    res.status(400).json({error:`Name is invalid`})
  }
  if(!isNaN(req.body.description) || req.body.description.length === 0) {
    res.status(400).json({error:`Description is invalid`})
  }


	await newSpot.save()

	res.json(newSpot)
})

// Create an image for a spot
router.post('/:id/images', async (req,res,next) => {
  const spot = await Spot.findByPk(req.params.id);

  // Ensure spot exists
  if(!spot) {
    res.status(404).json({error: `No spot found with id of ${req.params.id}`})
  }

  // Enusre current user is the owner of the spot
  if(spot.ownerId !== req.user.id) {
    res.status(403).json({error: `Only the spot owner may add an image`})
  }

  //create the image
  const newSpotImage = await SpotImage.create({
    spotId:req.params.id,
    url:req.body.url,
    preview:req.body.preview
  })
  res.status(201).json(
    {
      id: newSpotImage.id,
      url: newSpotImage.url,
      preview: newSpotImage.preview,
    }
  )
})

// Create a booking from a spot based on the spot id
router.post('/:id/bookings', async (req, res, next) => {
    try {
      const spotId = req.params.id;
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
        res.status(404).json({ error: `Could not find spot with id ${spotId}` });
        return;
      }

      // Check if the user owns the spot
      if (spot.ownerId === req.user.id) {
        res.status(403).json({ error: 'You cannot create a booking for your own spot.' });
        return;
      }

      const newStartDate = new Date(req.body.startDate);
      const newEndDate = new Date(req.body.endDate);

      // Check if the booking end date is before the start date
      if (newEndDate < newStartDate) {
        res.status(400).json({ error: 'Booking end date cannot be before the start date.' });
        return;
      }

      // Check for existing bookings with overlapping dates
      const overlappingBooking = await Booking.findOne({
        where: {
          spotId: spotId,
          [Op.or]: [
            {
              startDate: { [Op.lte]: newEndDate },
              endDate: { [Op.gte]: newStartDate },
            },
            {
              startDate: { [Op.eq]: newStartDate },
              endDate: { [Op.eq]: newEndDate },
            },
          ],
        },
      });

      if (overlappingBooking) {
        res.status(403).json({ error: 'A booking already exists for the specified dates.' });
        return;
      }

      // Create the booking
      const newBooking = await Booking.create({
        spotId: spotId,
        userId: req.user.id,
        startDate: newStartDate,
        endDate: newEndDate,
      });

      res.status(201).json(newBooking);
    } catch (error) {
      console.error('Error creating booking:', error);
      res.status(500).json({ error: 'An error occurred while creating the booking.' });
    }
});

// Get spots of current user
router.get('/current', async(req, res) => {
    const ownedSpots = await Spot.findAll({
        where: {
            ownerId:req.user.id
        }
    })


    res.json(ownedSpots)
})

// Get details of a spot by id
router.get('/:id', async(req,res) => {
    const spot = await Spot.findByPk(req.params.id, {
      include: [
        {
          model: Review,
          attributes:[
            [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgNumStars'],
          ]
        },
        SpotImage
      ],
      group: ['Spot.id']
    })
    if(!spot) {
      res.status(404).json({error:`No spot found with id of ${req.params.id}`})
    }

    res.json(spot)
})

// Edit a spot
router.put('/:id', async(req,res,next) => {
  const spot = await Spot.findByPk(req.params.id);
  if(!spot) {
    res.status(404).json({error: `no spot found with id of ${req.params.id}`})
  }

  // Ensure only spot owner can edit
  if(spot.ownerId !== req.user.id) {
    res.status(403).json({error: `Only the spot owner is permited to edit this spot.`})
  }

  // Ensure body validations
  if(isNaN(req.body.lat) || req.body.lat>90 || req.body.lat<-90) {
    res.status(400).json({error: `Latitude is not valid`})
  }
  if(isNaN(req.body.lng) || req.body.lng>180 || req.body.lng<-180) {
    res.status(400).json({error: `Longitude is not valid`})
  }
  if(req.body.name.length > 50) {
    res.status(400).json({error:`Name must be under 50 characters`})
  }
  if(isNaN(req.body.price) || req.body.price <= 0) {
    res.status(400).json({error:`Price is not valid`})
  }
  if(!isNaN(req.body.address) || req.body.address.length === 0) {
    res.status(400).json({error:`Address is invalid`})
  }
  if(!isNaN(req.body.city) || req.body.city.length === 0) {
    res.status(400).json({error:`City is invalid`})
  }
  if(!isNaN(req.body.state) || req.body.state.length === 0) {
    res.status(400).json({error:`State is invalid`})
  }
  if(!isNaN(req.body.country) || req.body.coutnry.length === 0) {
    res.status(400).json({error:`Country is invalid`})
  }
  if(!isNaN(req.body.name) || req.body.name.length === 0) {
    res.status(400).json({error:`Name is invalid`})
  }
  if(!isNaN(req.body.description) || req.body.description.length === 0) {
    res.status(400).json({error:`Description is invalid`})
  }

  // Update the spot
  await spot.update({
    address:req.body.address,
    city:req.body.city,
    state:req.body.state,
    coutnry:req.body.country,
    lat:req.body.lat,
    lng:req.body.lng,
    name:req.body.name,
    description:req.body.description,
    price:req.body.price
  })

  res.status(200).json(spot)
})


// Get all bookings for a spot based on the spot id
router.get('/:id/bookings', async(req,res,next) => {
    const spotBookings = await Booking.findAll({
        where: {
            spotId:req.params.id
        },
        include: [
            {
                model:Spot,
                attributes:['ownerId']
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
            },
        ],
    });

    if (!spotBookings || spotBookings.length === 0) {
        return res.status(404).json({ error: `No bookings found for spot with id ${req.params.id}` });
    }

    const isSpotOwner = spotBookings[0].Spot.ownerId === req.user.id;

    const filteredBookings = spotBookings.map((booking) => {
      if (isSpotOwner) {
        return booking;
      } else {
        const { spotId, startDate, endDate } = booking;
        return { spotId, startDate, endDate };
      }
    });

    res.json(filteredBookings);
})


// Create a review for a spot
router.post('/:id/reviews', async(req,res,next) => {

  // get spot
  const spot = await Spot.findByPk(req.params.id);
  if(!spot) {
    return res.status(404).json({ error: `No spot with id of ${req.params.id} found`})
  }

  // check for previous review of spot by user
  const userReview = await Review.findOne({
    where:{
      userId:req.user.id,
      spotId:req.params.id
    }
  })
  if(userReview) {
    return res.status(403).json({ error: `You have already left a review for this spot.`})
  }

  // ensure review and stars body components are valid
  if(req.body.stars > 5 || req.body.stars < 1 || isNaN(req.body.stars) || req.body.stars === null) {
    return res.status(400).json({ error: `Star rating must be between 1 and 5`})
  }
  if(!req.body.review || typeof req.body.review !== 'string' || req.body.review.trim().length === 0) {
    return res.status(400).json({ error: `Review must not be blank`})
  }

  // create new review
  const newReview = await Review.create({
    userId:req.user.id,
    spotId:req.params.id,
    review:req.body.review,
    stars:req.body.stars
  })

  return res.status(201).json(newReview)

})

// Get reviews of a spot based on spotId
router.get('/:id/reviews', async(req,res,next) => {
  const spot = await Spot.findByPk(req.params.id)

  if(!spot) {
    res.status(404).json({ error: `No spot found with id of ${req.params.id}`})
  }

  const reviews = await Review.findAll({
      where:{
        spotId: req.params.id
      },
      include: [
        {
          model:User,
          attributes:['id','firstName','lastName']
        },
        {
          model:ReviewImage,
          attributes:['id','url']
        }
      ]
  })

  res.status(200).json(reviews)
})

// // Get all spots
// router.get('/', async(req,res) => {
//   const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

//   // Validate query parameters
//   if (
//     isNaN(page) || isNaN(size) ||
//     page < 1 || page > 10 ||
//     size < 1 || size > 20 ||
//     (minLat && isNaN(minLat)) ||
//     (maxLat && isNaN(maxLat)) ||
//     (minLng && isNaN(minLng)) ||
//     (maxLng && isNaN(maxLng)) ||
//     (minPrice && isNaN(minPrice)) ||
//     (maxPrice && isNaN(maxPrice))
//   ) {
//     res.status(400).json({ error: 'Invalid query parameters' });
//     return;
//   }

//   // Build filters based on query parameters
//   const filters = {};
//   if (minLat || maxLat) {
//     filters.lat = {};
//     if (minLat) filters.lat[Op.gte] = minLat;
//     if (maxLat) filters.lat[Op.lte] = maxLat;
//   }
//   if (minLng || maxLng) {
//     filters.lng = {};
//     if (minLng) filters.lng[Op.gte] = minLng;
//     if (maxLng) filters.lng[Op.lte] = maxLng;
//   }
//   if (minPrice || maxPrice) {
//     filters.price = {};
//     if (minPrice) filters.price[Op.gte] = minPrice;
//     if (maxPrice) filters.price[Op.lte] = maxPrice;
//   }

//   // Apply querry filters
//   const spots = await Spot.findAll({
//     where: filters,
//     order: [['id']],
//     limit: +size,
//     offset: (+page - 1) * +size,
//     attributes: [
//       'id', 'ownerId', 'address', 'city', 'state', 'country',
//       'lat', 'lng', 'name', 'description', 'price',
//       'createdAt', 'updatedAt'
//     ],
//     include: [
//       {
//         model: SpotImage,
//         attributes: ['url'],
//         where: {
//           preview: true
//         },
//         required: false
//       }
//     ]
//   });
//   res.json(spots);
// })

// Get all spots
router.get('/', async(req,res) => {
  const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice, maxPrice } = req.query;

  // Validate query parameters
  if (
    isNaN(page) || isNaN(size) ||
    page < 1 || page > 10 ||
    size < 1 || size > 20 ||
    (minLat && isNaN(minLat)) ||
    (maxLat && isNaN(maxLat)) ||
    (minLng && isNaN(minLng)) ||
    (maxLng && isNaN(maxLng)) ||
    (minPrice && isNaN(minPrice)) ||
    (maxPrice && isNaN(maxPrice))
  ) {
    res.status(400).json({ error: 'Invalid query parameters' });
    return;
  }

  // Build filters based on query parameters
  const filters = {};
  if (minLat || maxLat) {
    filters.lat = {};
    if (minLat) filters.lat[Op.gte] = minLat;
    if (maxLat) filters.lat[Op.lte] = maxLat;
  }
  if (minLng || maxLng) {
    filters.lng = {};
    if (minLng) filters.lng[Op.gte] = minLng;
    if (maxLng) filters.lng[Op.lte] = maxLng;
  }
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price[Op.gte] = minPrice;
    if (maxPrice) filters.price[Op.lte] = maxPrice;
  }

  // Apply querry filters
  const spots = await Spot.findAll({
    where: filters,
    order: [['id']],
    limit: +size,
    offset: (+page - 1) * +size,
    attributes: [
      'id', 'ownerId', 'address', 'city', 'state', 'country',
      'lat', 'lng', 'name', 'description', 'price',
      'createdAt', 'updatedAt'
    ],
    include: [
      {
        model: SpotImage,
        attributes: ['url'],
        where: {
          preview: true
        },
        required: false
      }
    ]
  });

  const responseSpots = spots.map(spot => ({
    ...spot.toJSON(),
    previewImage: spot.SpotImages[0]?.url || null,
    SpotImages: undefined // Remove the SpotImages array from the response
  }));

  res.json({
    Spots: responseSpots,
    page: +page,
    size: +size,
  });
})



module.exports = router;
