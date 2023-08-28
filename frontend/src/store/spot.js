const LOAD_SPOT = 'spots/LOAD_SPOT'

export const loadSpot = spot => ({
    type: LOAD_SPOT,
    spot
})

export const getSpot = (id) => async (dispatch) => { // Fix the arrow function syntax here
    const response = await fetch(`/api/spots/${id}`);

    if (response.ok) {
        const spot = await response.json();
        dispatch(loadSpot(spot));
        return spot;
    }
}

const initialState = {
    SpotImages: [],
    Owner: {}
}

const spotReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOT:
            return {...state,SpotImages:[...action.SpotImages],Owner:{...action.Owner}}
        default:
            return state;
    }
}

export default spotReducer;
