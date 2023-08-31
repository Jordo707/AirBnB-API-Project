import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/LOAD_SPOTS';
const LOAD_USER_SPOTS = 'spots/LOAD_USER_SPOTS';
const DELETE_USER_SPOT = 'spots/DELETE_USER_SPOT';


export const loadAllSpots = allSpots => ({
    type: LOAD_SPOTS,
    allSpots
});

export const loadUserSpots = userSpots => ({
    type: LOAD_USER_SPOTS,
    userSpots
})

export const getUserSpots = () => async (dispatch) => {
    const response = await fetch(`/api/spots/current`);

    if (response.ok) {
        const getUserSpots = await response.json();
        console.log(getUserSpots)
        const userSpots = getUserSpots
        dispatch(loadUserSpots(userSpots))
    }
}

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots');

    if (response.ok) {
        const getAllSpots = await response.json();
        const allSpots = getAllSpots.Spots
        dispatch(loadAllSpots(allSpots))
    }
}

export const deleteUserSpotAction = (spotId) => ({
    type: DELETE_USER_SPOT,
    spotId,
});

export const deleteUserSpot = (spotId) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
        method: 'DELETE',
    });

    if (response.ok) {
        dispatch(deleteUserSpotAction(spotId));
    }
};


const initialState = {
    spot:{},
    userSpots:[]
}


const allSpotsReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOAD_SPOTS:
            if (!Array.isArray(action.allSpots)) {
                console.error('Invalid allSpots data:', action.allSpots);
                return state;
            }
            const allSpots = {};
            action.allSpots.forEach(spot => {
                allSpots[spot.id] = spot;
            });

            return {
                ...state,
                ...allSpots
            };
            case LOAD_USER_SPOTS:
                if (!Array.isArray(action.userSpots)) {
                    console.error(`Invalid userSpots data ${action.userSpots}`);
                    return state;
                }

                const userSpots = {};
                action.userSpots.forEach(spot => {
                    userSpots[spot.id] = spot;
                });

                return {
                    ...state,
                    ...userSpots
                };
        case DELETE_USER_SPOT:
            const newState = { ...state };
            delete newState[action.spotId];
            return newState;
        default:
            return state;
    }
}

export default allSpotsReducer;
