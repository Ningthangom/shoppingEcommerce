import React, {Fragment, useEffect} from 'react'
import {Link} from 'react-router-dom'

import Loader from '../layout/Loader'
import Metadata from '../layout/Metadata'
import {MDBDataTable} from 'mdbreact'
import Sidebar from './Sidebar'

import {useDispatch, useSelector} from 'react-redux'
import {useAlert} from 'react-alert'
import { getAdminProducts, clearError } from '../../action/productActions'

const ProductLists = ({ history}) => {
    const alert = useAlert();
    const dispatch = useDispatch();

    const { loading, error, products } = useSelector(state => state.products)
    useEffect(() => {
        dispatch(getAdminProducts());
        if(error) {
            alert.error(error)
            dispatch(clearError)
        }
    }, [ dispatch, alert, error ])
    const setProducts = () => {
        const data = {
            columns: [
                {
                    label: 'Id',
                    field: 'id',
                    sort:'asc'
                },
                 {     
                    label: 'Name',
                    field: 'name',
                    sort:'asc'
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort:'asc'
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort:'asc'
                },
                {
                    label: 'Actions',
                    field: 'actions',
                }

            ],
            rows: []

        }
    products.forEach(product => {
            data.rows.push({
                id: product._id,
              name: product.name,
                 stock:product.stock,
                actions: 
                <Fragment>
                <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2">
                    <i className = "fa fa-pencil"></i>
                </Link>
                <button className="btn btn-danger py-1 px-2 ml-2">
                <i className = "fa fa-trash"></i>
                </button>
                </Fragment>

            })
        })

        return data;
    }
    return (
        <Fragment>
            <Metadata title={'All products for Admin'}/>
            <div className="row">
                <div className="col-12 col-md-2">
                        <Sidebar/>
                </div>
                <div className="col-12 col-md-10">
                    <Fragment>
                        <h1 className="my-5">All Products</h1>
                        {loading? <Loader/>
                        : 
                       ( <MDBDataTable 
                        data={setProducts()}
                        className='px-3'
                        bordered
                        striped
                        hover
                     /> )}
                    </Fragment>
                </div>

            </div>
        </Fragment>
    )
}

export default ProductLists
