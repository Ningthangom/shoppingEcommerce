import axios from 'axios'
import { ADD_TO_CART, REMOVE_ITEM_CART, SAVE_SHIPPING_INFO } from "../constants/cartConstants";


export const addItemToCart = (id, quantity) => async(dispatch, getState) =>{

    const { data } = await axios.get(`/api/v1/product/${id}`)
    
    dispatch({
        type: ADD_TO_CART,
        payload:{
            product: data.product._id,
            name: data.product.name,
            price:data.product.price,
            image: data.product.images[0].url,
            stock: data.product.stock,
            quantity
        }
    })
    //saving cart items in local storage
    localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems))

}



// remove item from cart
export const removeItemFromCart = (id) => async(dispatch, getState) =>{
    
    dispatch({
        type: REMOVE_ITEM_CART,
        payload: id
         
     } )


   
    //saving cart items in local storage
    localStorage.setItem('cartItems',JSON.stringify(getState().cart.cartItems))

}

// data parameter will include all the shipping infomation
export const saveShippingInfo = (data) => async(dispatch) =>{
    dispatch({
        type: SAVE_SHIPPING_INFO,
        payload:  data
         
     })

        //saving cart items in local storage
    localStorage.setItem('shippingInfo',JSON.stringify(data))

  }