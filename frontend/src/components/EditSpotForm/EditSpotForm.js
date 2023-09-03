import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import * as spotActions from "../../store/spot";

const EditSpotForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { spotId } = useParams();
    const spot = useSelector(state => state.spots.singleSpot);
    const currentUserId = useSelector(state => state.session.user.id)
    const currentUserName = useSelector(state => state.session.user.firstName)
    const spotOwnerId = spot.ownerId

    console.log("Spot, ",spot)
    console.log("You are the spot owner: ", spotOwnerId === currentUserId)


    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrls, setImageUrls] = useState([]);
    const [errors,setErrors] = useState({});

    useEffect(() => {
        if (!spot.id || spot.id !== +spotId) {
            dispatch(spotActions.getSpotDetails(spotId));
        } else {
            setAddress(spot.address);
            setCity(spot.city);
            setState(spot.state);
            setCountry(spot.country);
            setName(spot.name);
            setDescription(spot.description);
            setPrice(spot.price);
            setImageUrls(spot.SpotImages.map(image => image.url));
        }
    }, [dispatch, spot, spotId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields
        const validationErrors = {};
        if (address.trim() === '') {
            validationErrors.address = "Address is required"
        }
        if (city.trim() === '') {
            validationErrors.city = "City is required"
        }
        if (state.trim() === '') {
            validationErrors.state = "State is required"
        }
        if (country.trim() === '') {
            validationErrors.country = "Country is required"
        }
        if (description.length < 30) {
            validationErrors.description = "Description needs a minimum of 30 characters"
        }
        if (name.trim() === '') {
            validationErrors.name = 'Name is required'
        }
        if (price.toString().trim() === '') {
            validationErrors.price = 'Price is required';
        } else if (!/^\d+(\.\d{1,2})?$/.test(price)) {
            validationErrors.price = 'Price must be a number';
        } else if (price <= 0) {
            validationErrors.price = 'Price is too low';
        }

        validationErrors.imageUrls = [];

        if (imageUrls[0].trim() === "") {
            validationErrors.imageUrls[0] = 'Preview image is required';
        } else if (!/\.(jpg|jpeg|png)$/i.test(imageUrls[0])) {
            validationErrors.imageUrls[0] = 'Preview image must end with .jpg, .jpeg, or .png';
        }

        for (let i = 1; i < imageUrls.length; i++) {
            const imageUrl = imageUrls[i];

            if (imageUrl.trim() !== "" && !/\.(jpg|jpeg|png)$/i.test(imageUrl)) {
                validationErrors.imageUrls[i] = `Image url must end with .jpg, .jpeg, or .png`;
            }
        }
        if (validationErrors.imageUrls.length === 0) {
            delete validationErrors.imageUrls
        }

        console.log('validationErrors: ', validationErrors)

        const payload = {
            address,
            city,
            state,
            country,
            lat: 1,
            lng: 1,
            name,
            description,
            price: parseFloat(price),
            imageUrls: imageUrls.filter(url => url.trim() !== "")
        };

        if(Object.keys(validationErrors).length === 0) {
            await dispatch(spotActions.updateSpot(spotId, payload));

            history.push(`/spots/${spotId}`);
        } else {
            setErrors(validationErrors);
        }
    }

    const handleImageUrlChange = (index, value) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = value;
        setImageUrls(newImageUrls);
    };

    // Kick out anyone who doesn't own the spot
    if (currentUserId !== spotOwnerId) {
        alert(`You're not supposed to be in here, ${currentUserName}`)

        history.push('/')
    }


    return (
        <div>
            <h2>Edit Spot</h2>
            <form onSubmit={handleSubmit}>
            <h3>Where's Your place located?</h3>
            <div>
                <label>Street Address:</label>
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    />
                {errors.address && <p className="error">{errors.address}</p>}
            </div>
                <label>City:</label>
                {errors.city && <p className="error">{errors.city}</p>}
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />
                <label>State:</label>
                {errors.state && <p className="error">{errors.state}</p>}
                <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    />
                <label>Country:</label>
                {errors.country && <p className="error">{errors.country}</p>}
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    />
            <h3>Describe your place to guests</h3>
                <label>Tell Us About Your Place:</label>
                <p>Be sure to highlight all the best parts of your spot and the local area around it. Let everyone know why it's a great place to stay.</p>
                {errors.description && <p className="error">{errors.description}</p>}
                <input
                    type="text"
                    placeholder="Tell us about your spot"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                <label>Give Your Place a Name:</label>
                {errors.name && <p className="error">{errors.name}</p>}
                <p></p>
                <input
                    type="text"
                    placeholder="Name your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                <label>What is the Nightly Price You'd Like to Set?:</label>
                <p>Competative pricing will help your spot stand out.</p>
                {errors.price && <p className="error">{errors.price}</p>}
                <input
                    type="text"
                    placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <h3>Liven up your spot with photos</h3>
                <p>Submit a link to at least one photo to publish your spot</p>
                    <div>
                        <input
                            type="text"
                            placeholder="Preview Image URL"
                            value={imageUrls[0]}
                            onChange={(e) => handleImageUrlChange(0, e.target.value)}
                        />
                        {errors.imageUrls && errors.imageUrls[0] && <p>{errors.imageUrls[0]}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Image URL 2"
                            value={imageUrls[1]}
                            onChange={(e) => handleImageUrlChange(1, e.target.value)}
                        />
                        {errors.imageUrls && errors.imageUrls[1] && <p>{errors.imageUrls[1]}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Image URL 3"
                            value={imageUrls[2]}
                            onChange={(e) => handleImageUrlChange(2, e.target.value)}
                        />
                        {errors.imageUrls && errors.imageUrls[2] && <p>{errors.imageUrls[2]}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Image URL 4"
                            value={imageUrls[3]}
                            onChange={(e) => handleImageUrlChange(3, e.target.value)}
                        />
                        {errors.imageUrls && errors.imageUrls[3] && <p>{errors.imageUrls[3]}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Image URL 5"
                            value={imageUrls[4]}
                            onChange={(e) => handleImageUrlChange(4, e.target.value)}
                        />
                        {errors.imageUrls && errors.imageUrls[4] && <p>{errors.imageUrls[4]}</p>}
                    </div>
                <button type="submit">Update Spot</button>
            </form>
        </div>
    );
};

export default EditSpotForm;
