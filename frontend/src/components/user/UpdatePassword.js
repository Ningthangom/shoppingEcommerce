import React, {useEffect, Fragment, useState} from 'react'

import Metadata from '../layout/Metadata'

import {useAlert} from 'react-alert'
import {useDispatch, useSelector} from 'react-redux'
import {updatePassword, clearError} from '../../action/userAction'
import {UPDATE_PASSWORD_RESET} from '../../constants/userConstant'
    
    const UpdatePassword = ({history}) => {

        const [oldPassword, setOldPassword] = useState('')
        const [password, setpassword] = useState('')
   
    
        const alert = useAlert();
        const dispatch = useDispatch();
    
       
        const { error, isUpdated, loading} = useSelector(state => state.user)
        useEffect(() => {
    
    
            if(error) {
                alert.error(error);
                dispatch(clearError())
            }
            if(isUpdated) {
                alert.success('Password updated successfully')
                history.push('/me')
                dispatch({
                    type: UPDATE_PASSWORD_RESET
                })
            }
    
        },[dispatch, error, alert, history, isUpdated])
    
        const submitHandler = (e)=> {
            e.preventDefault( );
    
            const formData = new FormData()
            formData.set('oldPassword',oldPassword);
            formData.set('password',password);
            dispatch(updatePassword(formData))
           
        }
        return (
            <Fragment>
                <Metadata title={'Change password'}/>
                <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mt-2 mb-5">Update Password</h1>
                        <div className="form-group">
                            <label for="old_password_field">Old Password</label>
                            <input
                                type="password"
                                id="old_password_field"
                                className="form-control"
                                value={oldPassword}
                                onChange={(e) =>setOldPassword(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label for="new_password_field">New Password</label>
                            <input
                                type="password"
                                id="new_password_field"
                                className="form-control"
                                value={password}
                                onChange={(e) =>setpassword(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn update-btn btn-block mt-4 mb-3"
                        disabled={loading? true : false}
                        >Update Password</button>
                    </form>
                </div>
            </div>
                
            </Fragment>
        )
    }
    
    export default UpdatePassword
    