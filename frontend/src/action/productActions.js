

    import axios from 'axios';

    import {
        ALL_PRODUCTS_REQUEST, 
        ALL_PRODUCTS_SUCCESS,
        ALL_PRODUCTS_FAIL,
        PRODUCT_DETAILS_REQUEST,
        PRODUCT_DETAILS_SUCCESS,
        PRODUCT_DETAILS_FAIL,
        CLEAR_ERRORS } from '../constants/productConstants'

        export const getProducts = (keyword = '' , currentPage=1, price, category , rating= 0) => async (dispatch) => {
            try {
                // the following dispatch will triger "all product request" case in productsReducer which will
                // set loading to true and products to emty array  in state 
                // then all the data will be brought from the backend :'api/v1/products' and put them in data variables
                // all products success will be dispatched and data will be passed as payload
                // then in productsReducer: products and productsCount will be pulled and saved in the state
               
                dispatch({ type: ALL_PRODUCTS_REQUEST})

             //   let searchLink = `/api/v1/products?keyword=${keyword}&page=${currentPage}`
                let priceFilterLink =  `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}
                                                    &ratings[gte]=${rating}`
                
                if(category){
                    priceFilterLink =  `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}
                    &category=${category}&ratings[gte]=${rating}`
                }
                
                
                
                const { data } = await axios.get(priceFilterLink)
                console.log(data)
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

    export const getProductDetails = (id) => async (dispatch) => {
            try {
               
                dispatch({ type: PRODUCT_DETAILS_REQUEST})

                 const { data } = await axios.get(`/api/v1/product/${id}`)

                dispatch({ 
                    type: PRODUCT_DETAILS_SUCCESS, 
                    payload: data.product
                })

            }catch (error) {
                dispatch({
                    type: PRODUCT_DETAILS_FAIL,
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