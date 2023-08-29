const LOAD_SPOTS = 'spots/LOAD_SPOTS'

export const loadAllSpots = allSpots => ({
    type: LOAD_SPOTS,
    allSpots
});

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots');

    if (response.ok) {
        const getAllSpots = await response.json();
        const allSpots = getAllSpots.Spots
        dispatch(loadAllSpots(allSpots))
    }
}

const initialState = {
    list:[],
}

const sortList = (list) => {
    return list.sort((SpotA, SpotB) => {
        return SpotA.id - SpotB.id;
    }).map((spot) => spot.id)
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
                ...allSpots,
                ...state,
                list: sortList(action.allSpots)
            };
        default:
            return state;
    }
}

export default allSpotsReducer;
