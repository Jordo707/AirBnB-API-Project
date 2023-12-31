import { csrfFetch } from "./csrf";

// Types
const LOAD_SPOT_REVIEWS = 'reviews/LOAD_REVIEWS'
const RESET_REVIEWS = 'reviews/RESET_REVIEWS'
const CREATE_REVIEW = 'reviews/CREATE_REVIEW'
const DELETE_REVIEW = 'reviews/DELETE_REVIEW'
// TODO Will impliment review updates later
// const UPDATE_REVIEW = 'reviews/UPDATE_REVIEW'

// Action Creators
export const loadReviews = reviews => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
})

export const resetReviews = () => ({
    type: RESET_REVIEWS
})

export const createReview = (spotId, review, user) => ({
    type: CREATE_REVIEW,
    spotId,
    review,
    user
})

export const deleteReview = (reviewId) => ({
    type: DELETE_REVIEW,
    reviewId
})


// Thunks
export const getSpotReviews = (spotId) => async (dispatch) => {
    const response = await fetch(`/api/spots/${spotId}/reviews`);

    if(response.ok) {
        const data = await response.json();
        dispatch(loadReviews(data.Reviews));
    }
};

export const submitReview = (spotId, review, stars, user) => async (dispatch) => {

    const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method:'POST',
        body:JSON.stringify({review,stars}),
    });

    if (response.ok) {
        const review = await response.json();
        console.log("Thunk Review: ", review)
        dispatch(createReview(spotId, review, user));

        return review
    }
}

export const deleteUserReview = (reviewId) => async (dispatch) => {
    const response = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
    });

    if(response.ok) {
        dispatch(deleteReview(reviewId))
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
            const spotReviews = state.spot;
            console.log("SpotReviews ", spotReviews);
            return {
                ...state,
                spot: {
                    ...state.spot,
                    [action.review.id]:{
                        reviewData: action.review,
                        User: action.user,
                        ReviewImages: [],
                    }
                },
        };
        case DELETE_REVIEW:
            newState = {...state};
            const upDatedSpotReviews = {...newState.spot};
            delete upDatedSpotReviews[action.reviewId];
            newState.spot = upDatedSpotReviews;
            return newState
        default:
          return state;
      }
}

export default reviewsReducer
