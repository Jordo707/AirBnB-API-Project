import { csrfFetch } from "./csrf";

// Types
const LOAD_SPOTS = "spots/LOAD_SPOTS";
const LOAD_USER_SPOTS = "spots/LOAD_USER_SPOTS";
const DELETE_USER_SPOT = "spots/DELETE_USER_SPOT";
const LOAD_SPOT = "spots/LOAD_SPOT";
const CREATE_SPOT = "spots/CREATE_SPOT";
const UPDATE_SPOT = "spots/UPDATE_SPOT";
const RESET_SPOT = 'spots/RESET_SPOTS';


//Action Creators
export const loadSpot = (spot) => ({
  type: LOAD_SPOT,
  spot,
});

export const createSpotAction = (spot) => ({
  type: CREATE_SPOT,
  spot,
});

export const loadAllSpots = (allSpots) => ({
  type: LOAD_SPOTS,
  allSpots,
});

export const loadUserSpots = (userSpots) => ({
  type: LOAD_USER_SPOTS,
  userSpots,
});

export const updateSpotAction = (spotId, updatedSpot) => ({
  type: UPDATE_SPOT,
  spotId,
  updatedSpot,
})

export const resetSingleSpotAction = () => ({
  type: RESET_SPOT
})

// Thunks
export const getSpotDetails = (id) => async (dispatch) => {
  console.log(`id: ${id}`);
  const response = await fetch(`/api/spots/${id}`);

  if (response.ok) {
    const spot = await response.json();
    dispatch(loadSpot(spot));
    return spot;
  }
};

export const createSpotImages = (spotImagesData) => async (dispatch) => {
  console.log("spotImagesData", spotImagesData);
  const response = await csrfFetch(
    `/api/spots/${spotImagesData[0].spotId}/images`,
    {
      method: "POST",
      body: JSON.stringify(spotImagesData),
    }
  );

  if (response.ok) {
    console.log("response ok");
    const spotImages = await response.json();
    // dispatch(createSpotImages(spotImages));
    return spotImages;
  }
};

export const createSpot = (spotData) => async (dispatch) => {
  const response = await csrfFetch("/api/spots", {
    method: "POST",
    body: JSON.stringify(spotData),
  });
  const data = await response.json();
  dispatch(createSpotAction(data));
  return data;
};

export const updateSpot = (spotId, spotData) => async (dispatch) => {
  const { address, city, state, country, lat, lng, name, description, price } =
    spotData;
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    }),
  });

  if (response.ok) {
    const updatedSpot = await response.json();
    dispatch(updateSpotAction(spotId, updatedSpot));
    return updatedSpot;
  }
};
export const getUserSpots = () => async (dispatch, getState) => {
  const state = getState();
  const user = state.session.user;
  const response = await fetch(`/api/spots`);

  if (response.ok) {
    const allSpots = await response.json();
    console.log("thunk userSpots ", allSpots);
    const userSpots = allSpots.Spots.filter((spot) => spot.ownerId === user.id);
    dispatch(loadUserSpots(userSpots));
  }
};

export const getAllSpots = () => async (dispatch) => {
  const response = await fetch("/api/spots");
  // console.log('response ',response)

  if (response.ok) {
    const getAllSpots = await response.json();
    const allSpots = getAllSpots.Spots;
    console.log("fetched allSpots: ", allSpots)
    dispatch(loadAllSpots(allSpots));
  } else console.log("error, could not fetch spots")
};

export const deleteUserSpotAction = (spotId) => ({
  type: DELETE_USER_SPOT,
  spotId,
});

export const deleteUserSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
  });

  if (response.ok) {
    dispatch(deleteUserSpotAction(spotId));
  }
};

const initialState = {
    allSpots: {},
    singleSpot: {}
};

const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_SPOTS:
      console.log(`made it to spot reducer`)
      if (!Array.isArray(action.allSpots)) {
        console.error("Invalid allSpots data:", action.allSpots);
        return state;
      }
      const allSpots = {};
      action.allSpots.forEach((spot) => {
        allSpots[spot.id] = spot;
      });

      return {
        ...state,
        allSpots: {
          ...state.allSpots,
          ...allSpots,
        },
      };
    case LOAD_USER_SPOTS:
      console.log('made it to load user spots reducer');
      const userSpots = {};
      action.userSpots.forEach((spot) => {
        userSpots[spot.id] = spot;
      })
      return {
        ...state,
        allSpots: {
          ...userSpots
        }
      };
    case DELETE_USER_SPOT:
      newState = { ...state };
      const updatedAllSpots = { ...newState.allSpots };
      delete updatedAllSpots[action.spotId];
      newState.allSpots = updatedAllSpots;
      return newState;
    case LOAD_SPOT:
      newState = Object.assign({}, state);
      newState.singleSpot = action.spot;
      return newState;
    case CREATE_SPOT:
      newState = Object.assign({}, state);
      return (newState.allSpots = { ...state });
    case UPDATE_SPOT:
      newState = { ...state };
      if (newState.spot && newState.spot.id === action.spotId) {
        newState.spot = action.updatedSpot;
      }
      return newState;
    case RESET_SPOT:
      return {
        ...state,
        singleSpot: {}
      }
    default:
      return state;
  }
};

export default spotsReducer;
