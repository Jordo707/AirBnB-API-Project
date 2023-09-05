import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as spotActions from "../../store/spot";
import './NewSpotForm.css'

const defaultImageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSo0nwDRO1dYTQIhm9Sz8sA20Wqk8xaiNyhQg&usqp=CAU";

const NewSpotForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrls, setImageUrls] = useState(["", "", "", "", ""]);
    const [errors,setErrors] = useState({});



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
        if (price.trim() === '') {
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

        if (Object.keys(validationErrors).length === 0) {
            const createdSpot = await dispatch(spotActions.createSpot(payload));
            console.log('Created Spot:', createdSpot)
            if (createdSpot) {
                const spotId = createdSpot.id;
                const spotImagesData = imageUrls.map((imageUrl, index) => ({
                    spotId,
                    url: imageUrl || defaultImageUrl,
                    preview: index === 0
            }));

            console.log('spot images data ', spotImagesData);

            await dispatch(spotActions.createSpotImages(spotImagesData));

            history.push(`/spots/${spotId}`);}
        } else {
            setErrors(validationErrors);
        }
    };

    const handleImageUrlChange = (index, value) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = value;
        setImageUrls(newImageUrls);
    };

    return (
        <div className="form-container">
            <h2>Create a New Spot</h2>
            <form onSubmit={handleSubmit}>
            <h3>Where's Your place located?</h3>
                 <label>Street Address:</label>
                 {errors.address && <p className="error">{errors.address}</p>}
                 <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    />
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
                {/* <label>Tell Us About Your Place:</label> */}
                <p>Mention the best features of your space, any special amentities like
                    fast wifi or parking, and what you love about the neighborhood.</p>
                {errors.description && <p className="error">{errors.description}</p>}
                <textarea
                    placeholder="Please write at least 30 characters"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="description-textarea"
                ></textarea>
                <h3>Give Your Place a Name:</h3>
                {errors.name && <p className="error">{errors.name}</p>}
                <p>Catch guests' attention with a spot title that highlights what makes
                    your place special.</p>
                <input
                    type="text"
                    placeholder="Name of your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                <h3>Set a base price for your spot</h3>
                <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
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
                        {errors.imageUrls && errors.imageUrls[0] && <p className="error">{errors.imageUrls[0]}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrls[1]}
                            onChange={(e) => handleImageUrlChange(1, e.target.value)}
                        />
                        {errors.imageUrls && errors.imageUrls[1] && <p className="error">{errors.imageUrls[1]}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrls[2]}
                            onChange={(e) => handleImageUrlChange(2, e.target.value)}
                        />
                        {errors.imageUrls && errors.imageUrls[2] && <p className="error">{errors.imageUrls[2]}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrls[3]}
                            onChange={(e) => handleImageUrlChange(3, e.target.value)}
                        />
                        {errors.imageUrls && errors.imageUrls[3] && <p className="error">{errors.imageUrls[3]}</p>}
                    </div>
                    <div>
                        <input
                            type="text"
                            placeholder="Image URL"
                            value={imageUrls[4]}
                            onChange={(e) => handleImageUrlChange(4, e.target.value)}
                        />
                        {errors.imageUrls && errors.imageUrls[4] && <p className="error">{errors.imageUrls[4]}</p>}
                    </div>
                <button type="submit">Create Spot</button>
            </form>
        </div>
    );
};

export default NewSpotForm;
