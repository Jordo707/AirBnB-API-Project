const express = require('express');

const { Booking, Spot, User } = require('../../db/models');

const { Op } = require('sequelize');

const router = express.Router()

// Delete a booking
router.delete('/:id', async(req, res, next) => {
    const doomedBooking = await Booking.findByPk(req.params.id);

    // Ensure booking exists
    if(doomedBooking) {
        // Ensure current user is either booking owner or spot owner
        if(doomedBooking.userId === req.user.id || doomedBooking.ownerId === req.user.id) {
            const currentDate = new Date();
            const bookingStartDate = new Date(doomedBooking.startDate);
            // Ensure current date is not after booking start date
            if(currentDate < bookingStartDate) {
                await doomedBooking.destroy()
                res.status(200).json({message:`Successfully deleted`})
            } else {
                res.status(400).json({message:`Bookings that have started can't be deleted`})
            }
        } else {
            res.status(403).json({message:`Only the booking owner or spot owner may delete a booking`})
        }

    } else {
        const err = new Error(`Could not find booking with id of ${req.params.id}`)
        err.statusCode = 404
        return next(err)
    }
})

// Get all the current user's bookings --Done
router.get('/current', async(req, res) => {
    const currentBookings = await Booking.findAll({
        where: {
            userId:req.user.id
        },
        include: [Spot]
    })
    res.json(currentBookings)
})

// Edit a booking
router.put('/:id', async(req,res) =>{
    const booking = await Booking.findByPk(req.params.id, {
        include: {
          model: User,
          attributes: ['id'],
        },
      });

      if (!booking) {
        return res.status(404).json({ message: `Booking couldn't be found` });
      }

      if (booking.User.id !== req.user.id) {
        return res.status(403).json({ error: 'Only the booking owner can edit the booking.' });
      }

      const currentDate = new Date();
      const bookingEndDate = new Date(booking.endDate);

      const newStartDate = new Date(req.body.startDate);
      const newEndDate = new Date(req.body.endDate);

      // Check if the booking end date is before the start date
      if (newEndDate < newStartDate) {
        res.status(400).json({ error: 'Booking end date cannot be before the start date.' });
        return;
      }

      if (currentDate > bookingEndDate) {
        return res.status(400).json({ message: `Past bookings cannot be modified`});
      }

      const overlappingBooking = await Booking.findOne({
        where: {
          spotId: booking.spotId,
          startDate: {
            [Op.lte]: req.body.endDate,
          },
          endDate: {
            [Op.gte]: req.body.startDate,
          },
          id: {
            [Op.not]: req.params.id,
          },
        },
      });

      if (overlappingBooking) {
        return res.status(403).json({ message: `Sorry, this spot is already booked for the specified dates`});
      }

      await booking.update({
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      });

      res.json({
        id: booking.id,
        userId: booking.userId,
        spotId: booking.spotId,
        startDate: booking.startDate,
        endDate: booking.endDate,
        createdAt: booking.createdAt,
        updatedAt: booking.updatedAt,
      });
    });



module.exports = router;
