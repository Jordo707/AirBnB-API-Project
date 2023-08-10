const express = require('express');

const { Review, ReviewImage, User, Spot } = require('../../db/models')

const { Op } = require('sequelize');

const router = express.Router()

// Create an image for a review
router.post('/:id/images', async(req, res, next) => {
    const userId = req.user.id;
    const review = await Review.findByPk(req.params.id);

    if(!review) {
        res.status(404).json({ error: `No review exists with id of ${req.params.id}`})
    }

    // Ensure the current user is the review owner
    if(review.userId !== userId) {
        throw new Error(`Only the review owner may add an image.`)
    }

    // Don't allow more than 10 images to exist for a review
    const reviewImages = await ReviewImage.findAll({
        where: {
            reviewId:req.params.id
        }
    })
    if(reviewImages.length >= 10) {
        res.status(403).json({error: `Maximum number of images reached for this review`})
    }

    const newReviewImage = await ReviewImage.create({
        reviewId:req.params.id,
        url:req.body.url
    })
    res.status(201).json(newReviewImage)
})

// Get all the reviews from the current user
router.get('/current', async(req, res, next) => {
    const userReviews = await Review.findAll({
        where:{
            userId:req.user.id
        },
        include: [{
            model:User,
            attributes:['id','firstName','lastName']
        }, {
            model:Spot,
            attributes:['id',
                'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name',
                'price']
        }, {
            model:ReviewImage,
            attributes:['id','url']
        }]
    })
    res.status(200).json(userReviews)
})

// Edit a review
router.put('/:id', async(req,res,next) => {
    const review = await Review.findByPk(req.params.id);

    // ensure review exists
    if(!review) {
        res.status(404).json({error:`No review found with id of ${req.params.id}`})
    }

    // Ensure only the owner can edit
    if(review.userId !== req.user.id) {
        res.status(403).json({error:`Only the review owner may edit this review.`})
    }

    // ensure review and stars body components are valid
    if(req.body.stars > 5 || req.body.stars < 1 || isNaN(req.body.stars) || req.body.stars === null) {
        res.status(400).json({ error: `Star rating must be between 1 and 5`})
    }
    if(!req.body.review || typeof req.body.review !== 'string' || req.body.review.trim().length === 0) {
        res.status(400).json({ error: `Review must not be blank`})
    }

    // update review
    await review.update({
        review:req.body.review,
        stars:req.body.stars
    })
    res.status(200).json(review)

})

// Delete a review
router.delete('/:id', async(req,res,next) => {
    // Find the review
    const doomedReview = await Review.findByPk(req.params.id)
    if(!doomedReview) {
        return res.status(404).json({ error:`No review exists with id of ${req.params.id}`})
    }
    if(doomedReview.userId !== req.user.id) {
        throw new Error(`only the review owner may delete this review.`)
    }
    await doomedReview.destroy()
    res.status(200).json({ message:`Successfully deleted review with id of ${req.params.id}`})
})

module.exports = router;
