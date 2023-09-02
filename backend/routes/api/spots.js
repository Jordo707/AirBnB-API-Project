const express = require('express');

const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const { Sequelize, Op } = require('sequelize')

// Create a spot
router.post('/',async(req,res) => {
  const user = req.user.id;
  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  if (isNaN(req.body.lat) || req.body.lat > 90 || req.body.lat < -90) {
    res.status(400).json({ error: `Latitude is not valid` });
    return;
  }

  if (isNaN(req.body.lng) || req.body.lng > 180 || req.body.lng < -180) {
    res.status(400).json({ error: `Longitude is not valid` });
    return;
  }

  if (name.length > 50) {
    res.status(400).json({ error: `Name must be under 50 characters` });
    return;
  }

  if (isNaN(price) || price <= 0) {
    res.status(400).json({ error: `Price is not valid` });
    return;
  }

  if (typeof address !== 'string' || address.length === 0) {
    res.status(400).json({ error: `Address is invalid` });
    return;
  }

  if (typeof city !== 'string' || city.length === 0) {
    res.status(400).json({ error: `City is invalid` });
    return;
  }

  if (typeof state !== 'string' || state.length === 0) {
    res.status(400).json({ error: `State is invalid` });
    return;
  }

  if (typeof country !== 'string' || country.length === 0) {
    res.status(400).json({ error: `Country is invalid` });
    return;
  }

  if (typeof name !== 'string' || name.length === 0) {
    res.status(400).json({ error: `Name is invalid` });
    return;
  }

  if (typeof description !== 'string' || description.length === 0) {
    res.status(400).json({ error: `Description is invalid` });
    return;
  }

  const newSpot = await Spot.build({
    ownerId: user, address, city, state, country, lat, lng, name, description, price
  });

  await newSpot.save();

  res.status(201).json(newSpot);
})

// Create an image for a spot
router.post('/:id/images', async (req,res,next) => {
  const spot = await Spot.findByPk(req.params.id);

  // Ensure spot exists
  if(!spot) {
    res.status(404).json({message: `Spot couldn't be found`})
  }

  // Enusre current user is the owner of the spot
  if(spot.ownerId !== req.user.id) {
    res.status(403).json({error: `Only the spot owner may add an image`})
  }
  console.log("req.body " ,req.body)

  let imageArray = [];

  req.body.forEach(async image => {

    //create the image
      let newSpotImage = await SpotImage.create({
      spotId:req.params.id,
      url:image.url,
      preview:image.preview
    })
    imageArray.push(newSpotImage)
})

console.log('imageArray ',imageArray)



  res.status(201).json(
    {
      // id: newSpotImage.id,
      // url: newSpotImage.url,
      // preview: newSpotImage.preview,
      imageArray
    }
    )
  })

  // Create a booking from a spot based on the spot id
  router.post('/:id/bookings', async (req, res, next) => {
    try {
      const spotId = req.params.id;
      const spot = await Spot.findByPk(spotId);

      if (!spot) {
        res.status(404).json({ message: `Spot couldn't be found` });
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
        res.status(403).json({ message: 'Sorry, this spot is already booked for the specified dates' });
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
  router.get('/:id', async(req, res) => {
    const spot = await Spot.findByPk(req.params.id, {
      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country',
      'lat', 'lng', 'name', 'description', 'price',
      'createdAt', 'updatedAt'
    ],
    include: [
      {
        model: SpotImage
      },
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName']
      }
    ]
  });

  if (!spot) {
    res.status(404).json({ message:`Spot couldn't be found` });
    return;
  }

  const reviewInfo = await Review.findOne({
    attributes: [
      [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgNumStars'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'numReviews']
    ],
    where: {
      spotId: spot.id
    }
  });

  const responseSpot = {
    ...spot.toJSON(),
    numReviews: reviewInfo.dataValues.numReviews,
    avgNumStars: reviewInfo.dataValues.avgNumStars
  };

  res.json(responseSpot);
});


// Edit a spot
router.put('/:id', async(req,res,next) => {
  const spot = await Spot.findByPk(req.params.id);
  if(!spot) {
    res.status(404).json({message: `Spot couldn't be found`})
  }

  // Ensure only spot owner can edit
  if(spot.ownerId !== req.user.id) {
    res.status(403).json({error: `Only the spot owner is permited to edit this spot.`})
  }

  const { address, city, state, country, lat, lng, name, description, price } = req.body;

  // Ensure body validations
  if (isNaN(lat) || lat > 90 || lat < -90) {
    res.status(400).json({ error: `Latitude is not valid` });
    return;
  }

  if (isNaN(lng) || lng > 180 || lng < -180) {
    res.status(400).json({ error: `Longitude is not valid` });
    return;
  }

  if (name.length > 50) {
    res.status(400).json({ error: `Name must be under 50 characters` });
    return;
  }

  if (isNaN(price) || price <= 0) {
    res.status(400).json({ error: `Price is not valid` });
    return;
  }

  if (typeof address !== 'string' || address.length === 0) {
    res.status(400).json({ error: `Address is invalid` });
    return;
  }

  if (typeof city !== 'string' || city.length === 0) {
    res.status(400).json({ error: `City is invalid` });
    return;
  }

  if (typeof state !== 'string' || state.length === 0) {
    res.status(400).json({ error: `State is invalid` });
    return;
  }

  if (typeof country !== 'string' || country.length === 0) {
    res.status(400).json({ error: `Country is invalid` });
    return;
  }

  if (typeof name !== 'string' || name.length === 0) {
    res.status(400).json({ error: `Name is invalid` });
    return;
  }

  if (typeof description !== 'string' || description.length === 0) {
    res.status(400).json({ error: `Description is invalid` });
    return;
  }

  // Update the spot
  await spot.update({
    address:req.body.address,
    city:req.body.city,
    state:req.body.state,
    country:req.body.country,
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

    res.json({Bookings:filteredBookings});
})


// Create a review for a spot
router.post('/:id/reviews', async(req,res,next) => {

  // get spot
  const spot = await Spot.findByPk(req.params.id);
  if(!spot) {
    return res.status(404).json({ message: `Spot couldn't be found`})
  }

  // check for previous review of spot by user
  const userReview = await Review.findOne({
    where:{
      userId:req.user.id,
      spotId:req.params.id
    }
  })
  if(userReview) {
    return res.status(403).json({ message: `User has already left a review for this spot.`})
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
router.get('/:id/reviews', async(req, res, next) => {
  const spot = await Spot.findByPk(req.params.id);

  if (!spot) {
    res.status(404).json({ message: `Spot couldn't be found` });
    return;
  }

  const reviews = await Review.findAll({
    where: {
      spotId: req.params.id,
    },
    include: [
      {
        model: User,
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: ReviewImage,
        attributes: ['id', 'url'],
      },
    ],
  });

  const formattedReviews = reviews.map((review) => {
    const { id, userId, spotId, review: reviewText, stars, createdAt, updatedAt, User, ReviewImages } = review;

    const user = {
      id: User.id,
      firstName: User.firstName,
      lastName: User.lastName,
    };

    const reviewImages = ReviewImages.map((image) => ({
      id: image.id,
      url: image.url,
    }));

    return {
      id,
      userId,
      spotId,
      review: reviewText,
      stars,
      createdAt,
      updatedAt,
      User: user,
      ReviewImages: reviewImages,
    };
  });

  res.status(200).json({
    Reviews: formattedReviews,
  });
});

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

  // Fetch average ratings for all spots
  const spotIds = spots.map(spot => spot.id);
  const avgRatings = await Review.findAll({
    attributes: [
      'spotId',
      [Sequelize.fn('AVG', Sequelize.col('stars')), 'avgRating'] // Assign an alias 'avgRating'
    ],
    where: {
      spotId: spotIds
    },
    group: ['spotId']
  });

  // Create a mapping of spotId to average rating
  const avgRatingsMap = {};
  avgRatings.forEach(rating => {
    avgRatingsMap[rating.spotId] = rating.dataValues.avgRating; // Use the correct alias here
  });

  // Create the response data
  const responseSpots = spots.map(spot => ({
    ...spot.toJSON(),
    avgRating: avgRatingsMap[spot.id] || null,
    previewImage: spot.SpotImages[0]?.url || null,
    SpotImages: undefined // Remove the SpotImages array from the response
  }));

  res.json({
    Spots: responseSpots,
    page: +page,
    size: +size,
  });
})

// Delete a spot based on spot Id
router.delete('/:id', async(req,res,next) => {
  const doomedSpot = await Spot.findByPk(req.params.id);

  // Ensure spot exists
  if(!doomedSpot) {
    res.status(404).json({message:`Spot couldn't be found`})
  }

  // Ensure only spot owner can delete
  if(doomedSpot.ownerId !== req.user.id) {
    res.status(403).json({error:`Only the spot owner is permitted to delete this spot`})
  }

  // Destroy the spot
  await doomedSpot.destroy();
  res.status(200).json({message:`Successfully deleted`})

})


module.exports = router;
