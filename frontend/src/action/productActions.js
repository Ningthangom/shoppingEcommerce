

    import axios from 'axios';

    import {
        ALL_PRODUCTS_REQUEST, 
        ALL_PRODUCTS_SUCCESS,
        ALL_PRODUCTS_FAIL,
        CLEAR_ERRORS } from '../constants/productConstants'

        export const getProducts = () => async (dispatch) => {
            try {
                // the following dispatch will triger "all product request" case in productsReducer which will
                // set loading to true and products to emty array  in state 
                // then all the data will be brought from the backend :'api/v1/products' and put them in data variables
                // all products success will be dispatched and data will be passed as payload
                // then in productsReducer: products and productsCount will be pulled and saved in the state
                dispatch({ type: ALL_PRODUCTS_REQUEST})
                const { data } = await axios.get('/api/v1/products')
                dispatch({ 
                    type: ALL_PRODUCTS_SUCCESS, 
                    payload: data
                })

            }catch (error) {
                dispatch({
                    type: ALL_PRODUCTS_FAIL,
                    payload: error.response.data.message
                })
            }
        }


        // clear error

        export const clearError = () => async(dispatch) => {
            dispatch({
                type: CLEAR_ERRORS
            })
        }