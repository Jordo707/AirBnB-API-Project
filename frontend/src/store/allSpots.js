const LOAD_SPOTS = 'spots/LOAD_SPOTS'

export const loadAllSpots = allSpots => ({
    type: LOAD_SPOTS,
    allSpots
});

export const getAllSpots = () => async dispatch => {
    const response = await fetch('/api/spots');

    if (response.ok) {
        const allSpots = await response.json();
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
            const allSpots = {};
            action.allSpots.forEach(spot => {
                allSpots[spot.id] = spot;
            });
            console.log('All Spots: ', allSpots)
            return {
                ...allSpots,
                ...state,
                list: sortList(action.allSpots)
            };
        default:
            return state
    }
}

export default allSpotsReducer;
