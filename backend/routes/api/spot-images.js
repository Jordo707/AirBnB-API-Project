const express = require('express');

const { Spot, Booking, User, Review, ReviewImage, SpotImage } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const { Sequelize, Op } = require('sequelize')

// Delete a spot image
router.delete('/:id', async(req,res,next) => {
    const spotImage = await SpotImage.findByPk(req.params.id);

    // Ensure image exists
    if(!spotImage) {
        res.status(404).json({message: `Spot image couldn't be found`})
    }

    // Ensure only the spot owner can delete
    const spot = await Spot.findByPk(spotImage.spotId);
    if(spot.ownerId !== req.user.id) {
        res.status(403).json({error: `Only the spot owner is allowed to delete images for this spot.`})
    }
    // Destroy the spotImage
    await spotImage.destroy();
    res.status(200).json({message:`Successfully deleted`})
})


module.exports = router
