const express = require('express');

const { Review, ReviewImage } = require('../../db/models')

const { Op } = require('sequelize');

const router = express.Router()

// Delete an image for a review
router.delete('/:id', async(req,res,next) => {
    const doomedImage = await ReviewImage.findByPk(req.params.id);
    if(!doomedImage) {
        res.status(404).json({message:`Review image couldn't be found`})
    }
    const review = await Review.findByPk(doomedImage.reviewId)

    // Ensure current user is the review owner
    if(review.userId !== req.user.id) {
        res.status(403).json({error:`Only the review owner is allowed to delete this image.`})
    }

    // Delete the image
    await doomedImage.destroy();
    res.status(200).json({message:`Successfully deleted`})
})


module.exports = router;
