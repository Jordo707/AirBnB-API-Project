import { csrfFetch } from "./csrf";

const LOAD_REVIEWS = 'reviews/LOAD_REVIEWS'
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW'

export const loadReviews = reviews => ({
    type: LOAD_REVIEWS,
    reviews
})

export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if(response.ok) {
        const reviews = await response.json();
        dispatch(loadReviews(reviews));
    }
};

const initialState = {};

const reviewsReducer = (state = initialState, action) => {
    let newState
    switch (action.type) {
        case LOAD_REVIEWS:
            newState = Object.assign({}, state);
            newState = action.reviews;
            return newState
        default:
            return state;
    }
}

export default reviewsReducer
