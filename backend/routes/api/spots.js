const express = require('express');

const { Spot } = require('../../db/models');

const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

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

// Delete a spot image

// Get all spots --Done
router.get('/', async(req,res) => {
    const spots = await Spot.findAll({
        order:[['id']]
    })
    res.json(spots)
})

module.exports = router;
