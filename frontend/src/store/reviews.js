import { csrfFetch } from "./csrf";

// Types
const LOAD_SPOT_REVIEWS = 'reviews/LOAD_REVIEWS'
const RESET_REVIEWS = 'reviews/RESET_REVIEWS'
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW'

// Action Creators
export const loadReviews = reviews => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
})

export const resetReviews = () => ({
    type: RESET_REVIEWS
})

export const createReview = (spotId, review) => ({
    type: CREATE_REVIEW,
    spotId,
    review
})


// Thunks
export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if(response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data.Reviews));
    }
};

export const submitReview = (spotId, review, stars) => async (dispatch) => {
    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method:'POST',
        body:JSON.stringify({review,stars}),
    });

    if (response.ok) {
        const review = await response.json();
        dispatch(createReview(spotId, review));
    }
}

const initialState = {
    spot:{},
    user:{}
};

const reviewsReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case LOAD_SPOT_REVIEWS:
          newState = {
            ...state,
            spot: { ...state.spot },
          };

          action.reviews.forEach((review) => {
            newState.spot[review.id] = {
              reviewData: review,
              User: review.User,
              ReviewImages: review.ReviewImages,
            };
          });
          return newState;
        case RESET_REVIEWS:
            return {
                ...state,
                spot: {}, // Reset the spot reviews
              };
        case CREATE_REVIEW:
            const spotReviews = state.spot[action.spotId] || [];
            console.log("SpotReviews ", spotReviews);
            return {
                ...state,
                spot: {
                    ...state.spot,
                    [action.spotId]: [...spotReviews, action.review],
                },
            };
        default:
          return state;
      }
}

export default reviewsReducer
