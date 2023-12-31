import { csrfFetch } from "./csrf"

const LOAD_SPOT = 'spots/LOAD_SPOT'
const CREATE_SPOT = 'spots/CREATE_SPOT'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'


export const loadSpot = spot => ({
    type: LOAD_SPOT,
    spot
})

export const createSpotAction = spot => ({
    type: CREATE_SPOT,
    spot
})

export const getSpotDetails = (id) => async (dispatch) => {
    console.log(`id: ${id}`);
    const response = await fetch(`/api/spots/${id}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSpot(spot));
        return spot;
    }
}

export const createSpotImages = (spotImagesData) => async (dispatch) => {
    console.log('spotImagesData',spotImagesData)
    const response = await csrfFetch(`/api/spots/${spotImagesData[0].spotId}/images`, {
        method: 'POST',
        body: JSON.stringify(spotImagesData),
    });

    if (response.ok) {
        console.log('response ok')
        const spotImages = await response.json();
        // dispatch(createSpotImages(spotImages));
        return spotImages
    }
};

export const createSpot = (spotData) => async (dispatch) => {
    const {
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    } = spotData;
    const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify({
            ownerId,
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }),
    });
    const data = await response.json();
    dispatch(createSpotAction(data));
    return data
}

export const updateSpotAction = (spotId, updatedSpot) => ({
    type: UPDATE_SPOT,
    spotId,
    updatedSpot
});

export const updateSpot = (spotId, spotData) => async (dispatch) => {
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    } = spotData;
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'PUT',
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        }),
    });

    if (response.ok) {
        const updatedSpot = await response.json();
        dispatch(updateSpotAction(spotId, updatedSpot));
        return updatedSpot;
    }
};

const initialState = {

}

const spotReducer = (state = initialState, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SPOT:
            newState = Object.assign({}, state)
            newState.spot = action.spot;
            return newState
        case CREATE_SPOT:
            newState = Object.assign({}, state)
            return newState.allSpots = {...state}
        case UPDATE_SPOT:
            newState = { ...state };
            if (newState.spot && newState.spot.id === action.spotId) {
                newState.spot = action.updatedSpot;
            }
            return newState;
        default:
            return state;
    }
}

export default spotReducer;
