
    import axios from 'axios';

    import {
        ALL_PRODUCTS_REQUEST, 
        ALL_PRODUCTS_SUCCESS,
        ALL_PRODUCTS_FAIL,

        ADMIN_PRODUCTS_REQUEST, 
        ADMIN_PRODUCTS_SUCCESS,
        ADMIN_PRODUCTS_FAIL,

        PRODUCT_DETAILS_REQUEST,
        PRODUCT_DETAILS_SUCCESS,
        PRODUCT_DETAILS_FAIL,

        NEW_REVIEW_REQUEST,
        NEW_REVIEW_SUCCESS,
        NEW_REVIEW_FAIL,

        NEW_PRODUCT_REQUEST,
        NEW_PRODUCT_SUCCESS,
        NEW_PRODUCT_FAIL,

        DELETE_PRODUCT_REQUEST,
        DELETE_PRODUCT_SUCCESS,
        DELETE_PRODUCT_FAIL,

        UPDATE_PRODUCT_REQUEST,
        UPDATE_PRODUCT_SUCCESS,
        UPDATE_PRODUCT_FAIL,

        GET_REVIEWS_REQUEST,
        GET_REVIEWS_SUCCESS,
        GET_REVIEWS_FAIL,

        DELETE_REVIEW_REQUEST,
        DELETE_REVIEW_SUCCESS,
        DELETE_REVIEW_FAIL,
 

        CLEAR_ERRORS } from '../constants/productConstants'

           // the following dispatch will triger "all product request" case in productsReducer which will
                // set loading to true and products to emty array  in state 
                // then all the data will be brought from the backend :'api/v1/products' and put them in data variables
                // all products success will be dispatched and data will be passed as payload
                // then in productsReducer: products and productsCount will be pulled and saved in the state

        export const getProducts = (keyword = '' , currentPage=1, price, category , rating= 0) => async (dispatch) => {
            try {
 
                dispatch({ type: ALL_PRODUCTS_REQUEST})

             //   let searchLink = `/api/v1/products?keyword=${keyword}&page=${currentPage}`
                let priceFilterLink =  `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}
                                                    &ratings[gte]=${rating}`
                
                if(category){
                    priceFilterLink =  `/api/v1/products?keyword=${keyword}&page=${currentPage}&price[lte]=${price[1]}&price[gte]=${price[0]}
                    &category=${category}&ratings[gte]=${rating}`
                }

                const { data } = await axios.get(priceFilterLink)
                /* const { data } = await axios.get(`/api/v1/products`) */
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

// new product 
export const newProduct = (productData) => async (dispatch) => {
    try {
       
        dispatch({ type: NEW_PRODUCT_REQUEST})
        
        const config = {
            headers: {
                'Content-Type':'application/json'
            }
        }

        // this is a put request as the user will update its PRODUCT if it already has one
         const { data } = await axios.post(`/api/v1/admin/product/new`, productData, config)

        dispatch({ 
            type: NEW_PRODUCT_SUCCESS, 
            payload: data
        })

    }catch (error) {
        dispatch({
            type: NEW_PRODUCT_FAIL,
            payload: error.response.data.message
        })
    }
}


// get product Details 
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

        // get product review 
        export const newReview = (reviewData) => async (dispatch) => {
            try {
               
                dispatch({ type: NEW_REVIEW_REQUEST})
                
                const config = {
                    headers: {
                        'Content-Type':'application/json'
                    }
                }
                // this is a put request as the user will update its review if it already has one
                 const { data } = await axios.put(`/api/v1/review`, reviewData, config)

                dispatch({ 
                    type: NEW_REVIEW_SUCCESS, 
                    payload: data.success
                })

            }catch (error) {
                dispatch({
                    type: NEW_REVIEW_FAIL,
                    payload: error.response.data.message
                })
            }
        }

        //product deleting
        export const deleteProduct = (id) => async (dispatch) => {
            try {
               
                dispatch({ type: DELETE_PRODUCT_REQUEST})

                // this is a put request as the user will update its review if it already has one
                 const { data } = await axios.delete(`/api/v1/admin/product/${id}` )

                dispatch({ 
                    type: DELETE_PRODUCT_SUCCESS, 
                    payload: data.success
                })

            }catch (error) {
                dispatch({
                    type: DELETE_PRODUCT_FAIL,
                    payload: error.response.data.message
                })
            }
        }
        
        //update product
        export const updateProduct = (id, productData) => async (dispatch) => {
            try {
               
                dispatch({ type: UPDATE_PRODUCT_REQUEST})
                
                const config = {
                    headers: {
                        'Content-Type':'application/json'
                    }
                }
                // this is a put request as the user will update its PRODUCT if it already has one
                 const { data } = await axios.put(`/api/v1/admin/product/${id}`, productData, config)
        
                dispatch({ 
                    type: UPDATE_PRODUCT_SUCCESS, 
                    payload: data.success
                })
        
            }catch (error) {
                dispatch({
                    type: UPDATE_PRODUCT_FAIL,
                    payload: error.response.data.message
                })
            }
        }

        // get admin products
        export const getAdminProducts = () => async (dispatch) => {
            try {
               
                dispatch({ type: ADMIN_PRODUCTS_REQUEST})

                const { data } = await axios.get(`/api/v1/admin/products`)

                dispatch({ 
                    type: ADMIN_PRODUCTS_SUCCESS, 
                    payload: data.products
                })

            }catch (error) {
                dispatch({
                    type: ADMIN_PRODUCTS_FAIL,
                    payload: error.response.data.message
                })
            }
        }
        //get reviews of a product
        export const getProductReviews = (id) => async (dispatch) => {
            try {
               
                dispatch({ type: GET_REVIEWS_REQUEST})

                const { data } = await axios.get(`/api/v1/reviews?id=${id}`)

                dispatch({ 
                    type: GET_REVIEWS_SUCCESS, 
                    payload: data.reviews
                })

            }catch (error) {
                dispatch({
                    type: GET_REVIEWS_FAIL,
                    payload: error.response.data.message
                })
            }
        }

            //DELETE review of a product
            export const deleteReview= (id, productId) => async (dispatch) => {
                try {
                   
                    dispatch({ type: DELETE_REVIEW_REQUEST})
    
                    const { data } = await axios.delete(`/api/v1/reviews?productId=${productId}&id=${id}`)
    
                    dispatch({ 
                        type: DELETE_REVIEW_SUCCESS, 
                        payload: data.success
                    })
    
                }catch (error) {
                    dispatch({
                        type: DELETE_REVIEW_FAIL,
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