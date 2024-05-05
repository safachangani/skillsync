import React, { useState } from 'react';
import './post.css';
import { requestOfferSchema } from '../../validation/UserValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../axios'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
function Post() {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(requestOfferSchema),
    });
    const onSubmit = (data) => {
        const token = localStorage.getItem('user-token')
        if(token){
            axios.post('/post-requst-offer',data,{
                headers: {
                    Authorization: `Bearer ${token}` // Attach the token in the Authorization header
                }
            }).then((response)=>{

                console.log(response);
            })
            
            setMessage('Request submitted successfully');
            // reset(); // Clear form fields after submission
            navigate('/home')

        }
    };

    return (
        <>
        <Navbar></Navbar>
        <div className='post-req'>
            {/* <h1>SKILLSYNC</h1> */}
            <h2><span id='unlock'>Unlock your potential!</span> Learn or teach a skill with us.<br></br> Post your request or offer now. Let's thrive together!</h2>

            <div id="request" className="tabcontent">
                <form onSubmit={handleSubmit(onSubmit)}>
                    {errors.tab && <p>Please select any</p>}
                    <div className="tab">
                        <input type="radio" id="request-tab" name="tab" value="request" {...register('tab')} />
                        <label htmlFor="request-tab">Request</label>

                        <input type="radio" id="offer-tab" name="tab" value="offer" {...register('tab')}  />
                        <label htmlFor="offer-tab">Offer</label>
                    </div>
                    <label htmlFor="request-heading">Heading:</label><br />
                    {errors.heading && <p>heading is required</p>}
                    <input type="text" id="request-heading" name="heading"  {...register('heading')} /><br />
                    <label htmlFor="request-description">Description:</label><br />
                    {errors.description && <p>{errors.description.message}</p>}
                    <textarea id="request-description" name="description" {...register('description')} rows="4" cols="50" /><br />
                    <button type="submit">Submit</button>
                </form>
            </div>

            <div id="message">{message}</div>
        </div>
        </>
    );
}

export default Post;
