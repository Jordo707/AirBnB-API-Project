import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import * as spotActions from "../../store/spot";

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

    const handleSubmit = async (e) => {
        e.preventDefault();

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

        history.push(`/spots/${spotId}`);
    }
    };

    const handleImageUrlChange = (index, value) => {
        const newImageUrls = [...imageUrls];
        newImageUrls[index] = value;
        setImageUrls(newImageUrls);
    };

    return (
        <div>
            <h2>Create a New Spot</h2>
            <form onSubmit={handleSubmit}>
            <h3>Where's Your place located?</h3>
                 <label>Street Address:</label>
                 <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    />
                <label>City:</label>
                <input
                    type="text"
                    placeholder="City"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    />
                <label>State:</label>
                <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    />
                <label>Country:</label>
                <input
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    />
            <h3>Describe your place to guests</h3>
                <label>Tell Us About Your Place:</label>
                <p>Be sure to highlight all the best parts of your spot and the local area around it. Let everyone know why it's a great place to stay.</p>
                <input
                    type="text"
                    placeholder="Tell us about your spot"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <label>Give Your Place a Name:</label>
                <p></p>
                <input
                    type="text"
                    placeholder="Name your spot"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                <label>What is the Nightly Price You'd Like to Set?:</label>
                <p>Competative pricing will help your spot stand out.</p>
                <input
                    type="text"
                    placeholder="Price per night (USD)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                />
                <h3>Add Images (up to 5)</h3>
                {imageUrls.map((imageUrl, index) => (
                    <div key={index}>
                        <label>Image URL {index + 1}:</label>
                        <input
                            type="text"
                            placeholder={`Image URL ${index + 1}`}
                            value={imageUrl}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                        />
                    </div>
                ))}
                <button type="submit">Create Spot</button>
            </form>
        </div>
    );
};

export default NewSpotForm;
