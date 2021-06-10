import React, { Fragment, useEffect}from 'react'
import Metadata from './layout/Metadata'

// importing from redux

import { useDispatch, useSelector } from 'react-redux'
import {getProducts} from '../action/productActions'
import Product from './product/Product'
import Loader from './layout/Loader'
import {useAlert} from 'react-alert'


const  Home = ( ) =>  {

    const alert = useAlert();

    const dispatch = useDispatch();

    // getting products from state
    const {loading, products, error, productsCount}  = useSelector(state => state.products)
    //useEffect is a hook that will run when home component is called
    // this is a contructor of a class
    useEffect(() => {

        if(error){
            return alert.error(error)
         }

     dispatch(getProducts())

        // pass dispatch as dependency
    }, [dispatch, alert, error])
    return (
        <Fragment>
            {loading ?<Loader/> : (
                <Fragment>
                        <Metadata title={'Buy Best Products Online'}/>
                        <h1 id="products_heading">Latest Products</h1>
                            <section id="products" className="container mt-5">
                                    <div className="row">
                                        {products && products.map(product => (
                                        <Product key ={product._id} product = {product}/>


                                    ))}
                                
                                    </div>
                            </section>
                </Fragment>
            )}

            </Fragment>
    )
}

export default Home
