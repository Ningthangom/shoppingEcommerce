import React, {useEffect, Fragment, useState} from 'react'

import Metadata from '../layout/Metadata'

import {useAlert} from 'react-alert'
import {useDispatch, useSelector} from 'react-redux'
import {register, clearError} from '../../action/userAction'
    
    const Register = ({history}) => {

        const [user, setUser] = useState({
            name:'', 
            email:'',
            password:'',
        })

        const {name, email, password} = user;
        const [avator, setAvator] = useState('')
        const [avatorPreview, setAvatorPreview] = useState('/images/default_avatar.gif')

        const alert = useAlert();
        const dispatch = useDispatch();

        const {isAuthenticated, error, loading} = useSelector(state => state.auth);
        useEffect(() => {

            if(isAuthenticated){
                history.push('/')
            }

            if(error) {
                alert.error(error);
                dispatch(clearError())
            }

        },[dispatch, alert, isAuthenticated, error, history])

        const submitHandler = (e)=> {
            e.preventDefault( );

            const formData = new FormData()
            formData.set('name',name);
            formData.set('email',email);
            formData.set('password',password);
            formData.set('avator',avator)
            dispatch( register(formData))
        }
        const onChange = e=> {
            if(e.target.name === 'avator'){
                    const reader = new FileReader();
                    reader.onload = () =>{
                        //when everything is done or register as 2: zero being loading 1 being processing and 2 being ready
                        if(reader.readyState === 2){
                            setAvatorPreview(reader.result)
                            setAvator(reader.result)

                        }
                    }
                    reader.readAsDataURL(e.target.files[0])
            }else{
                
                setUser({...user, [e.target.name]: e.target.value})

            }
        }
        return (
            <Fragment>
                <Metadata title={'Register User'}/>
                    <div className="row wrapper">
                            <div className="col-10 col-lg-5">
                            <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                                <h1 className="mb-3">Register</h1>

                            <div className="form-group">
                                <label htmlFor="email_field">Name</label>
                                <input 
                                        type="name" 
                                        id="name_field"
                                        className="form-control" 
                                        name='name'
                                        value={name}
                                        onChange={onChange}
                                        />
                            </div>

                                <div className="form-group">
                                <label htmlFor="email_field">Email</label>
                                <input
                                    type="email"
                                    id="email_field"
                                    className="form-control"
                                    name='email'
                                    value={email}
                                    onChange={onChange}
                                />
                                </div>
                    
                                <div className="form-group">
                                <label htmlFor="password_field">Password</label>
                                <input
                                    type="password"
                                    id="password_field"
                                    className="form-control"
                                    name='password'
                                    value={password}
                                    onChange={onChange}
                                />
                                </div>

                                <div className='form-group'>
                                <label htmlFor='avator_upload'>avator</label>
                                <div className='d-flex align-items-center'>
                                    <div>
                                        <figure className='avator mr-3 item-rtl'>
                                            <img
                                                src={avatorPreview}
                                                className='rounded-circle'
                                                alt='avator preview'
                                                style={{ width: 130}}
                                            />
                                        </figure>
                                    </div>
                                    <div className='custom-file'>
                                        <input
                                            type='file'
                                            name='avator'
                                            className='custom-file-input'
                                            id='customFile'
                                            accept='images/*'
                                            onChange={onChange}
                                        />
                                        <label className='custom-file-label' htmlFor='customFile'>
                                            Choose avatar
                                        </label>
                                    </div>
                                </div>
                            </div>
                    
                                <button
                                id="register_button"
                                type="submit"
                                className="btn btn-block py-3"
                                disabled={loading? true : false}
                                >
                                REGISTER 
                                </button>
                            </form>
                            </div>
                        </div>
                
            </Fragment>
        )
    }
    
    export default Register
    