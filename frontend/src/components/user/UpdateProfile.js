import React, {useEffect, Fragment, useState} from 'react'

import Metadata from '../layout/Metadata'

import {useAlert} from 'react-alert'
import {useDispatch, useSelector} from 'react-redux'
import {updateProfile, loadUser, clearError} from '../../action/userAction'
import {UPDATE_PROFILE_RESET} from '../../constants/userConstant'
    

const UpdateProfile = ({history}) => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avator, setAvator] = useState('')

    const [avatorPreview, setAvatorPreview] = useState('/images/default_avatar.gif')

    const alert = useAlert();
    const dispatch = useDispatch();

    const { user } = useSelector(state => state.auth);
    const { error, isUpdated, loading } = useSelector(state => state.user)
    useEffect(() => {

        if(user){
           setName(user.name);
           setEmail(user.email);
           setAvatorPreview(user.avator.url)
        }

        if(error) {
            alert.error(error);
            dispatch(clearError())
        }
        if(isUpdated) {
            alert.success('user profile updated successfully')
            dispatch(loadUser())
            history.push('/me')
            dispatch({
                type: UPDATE_PROFILE_RESET
            })
        }

    },[dispatch, error, alert, history, isUpdated,user])

    const submitHandler = (e)=> {
        e.preventDefault( );

        const formData = new FormData()
        formData.set('name',name);
        formData.set('email',email);
        formData.set('avator',avator)
        dispatch(updateProfile(formData))
       
    }
    const onChange = e => {
        
                const reader = new FileReader();
                reader.onload = () =>{
                    //when everything is done or register as 2: zero being loading 1 being processing and 2 being ready
                    if(reader.readyState === 2){
                        setAvatorPreview(reader.result)
                        setAvator(reader.result)

                    }
                }
                reader.readAsDataURL(e.target.files[0])   
    
    }
    return (
        <Fragment>
            <Metadata title={'update profile'}/>
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler} encType='multipart/form-data'>
                        <h1 className="mt-2 mb-5">Update Profile</h1>

                        <div className="form-group">
                            <label htmlFor="email_field">Name</label>
                            <input 
								type="name" 
								id="name_field" 
								className="form-control"
                                name='name'
                                value={name}
                                onChange={(e)=> setName(e.target.value) }
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
                                onChange={(e)=> setEmail(e.target.value) }
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='avatar_upload'>Avatar</label>
                            <div className='d-flex align-items-center'>
                                <div>
                                    <figure className='avatar mr-3 item-rtl'>
                                        <img
                                            src={avatorPreview}
                                            className='rounded-circle'
                                            alt='Avatar Preview'
                                        />
                                    </figure>
                                </div>
                                <div className='custom-file'>
                                    <input
                                        type='file'
                                        name='avatar'
                                        className='custom-file-input'
                                        id='customFile'
                                        accept='image/*'
                                        onChange={onChange}
                                    />
                                    <label className='custom-file-label' htmlFor='customFile'>
                                        Choose Avatar
                                </label>
                                </div>
                            </div>
                        </div>

                        <button
                         type="submit" 
                         className="btn update-btn btn-block mt-4 mb-3" 
                          disabled={loading? true : false}
                          >
                              Update
                        </button>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateProfile
