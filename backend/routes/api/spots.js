const express = require('express');

const { Spot, Booking, User } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const { Op } = require('sequelize')

// Create a spot
router.post('/',

async(req,res) => {
    const user = req.user.id;
    const { address, city, state, country, lat, lng, name,description,price} = req.body;

    const newSpot = Spot.build({
        ownerId:user, address, city, state, country, lat, lng, name, description ,price
    })

    newSpot.validate()

	await newSpot.save()

	res.json(newSpot)
})

// Create an image for a spot

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

// Get spots of current user --Done
router.get('/current', async(req, res) => {
    const ownedSpots = await Spot.findAll({
        where: {
            ownerId:req.user.id
        }
    })


    res.json(ownedSpots)
})

// Get details of a spot by id --Done
router.get('/:id', async(req,res) => {
    const spot = await Spot.findByPk(req.params.id)
    if(!spot) throw new Error(`no spot with id of ${req.params.id}`)

    res.json(spot)
})

// Edit a spot


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

// Delete a spot image

// Get all spots --Done
router.get('/', async(req,res) => {
    const spots = await Spot.findAll({
        order:[['id']]
    })
    res.json(spots)
})

module.exports = router;