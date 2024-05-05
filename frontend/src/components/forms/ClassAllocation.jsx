import React, { useState } from 'react';
import './allocation.css';
import { allocationSchema } from '../../validation/UserValidation'; // Import your validation schema
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';

function ClassAllocation() {
//   const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(allocationSchema),
  });
  const navigate = useNavigate();

  function handleAllocation(data) {
console.log('handleee');
    const token = localStorage.getItem('user-token');
    axios.post('/announcement', data,{
        headers: {
            'Authorization': `Bearer ${token}`, // Example of adding an authorization header
            
          }
    })
      .then((response) => {
        console.log(response);
        // Optionally, you can navigate or reset the form here
        navigate('/control-panel')
        reset(); // Reset the form after successful submission
      })
      .catch((error) => {
        console.error('Allocation error:', error);
        if (error.response && error.response.data && error.response.data.message) {
        //   setErrorMessage(error.response.data.message);
        } else {
        //   setErrorMessage('An error occurred while allocating class');
        }
      });
  }

  return (
    <div className='container' id='change'>
        <h1>Allocate Class</h1>
      <div className="form">
        {/* {errorMessage && <p className="error">{errorMessage}</p>} */}
        <form action="" onSubmit={handleSubmit(handleAllocation)}>
          <input type="text" name="topic" id="topic" placeholder='Enter topic' {...register('topic')} />
          <p>{errors.topic?.message}</p>
          <select name="location" id="location" {...register('location')}>
            <option value="seminar-hall">Seminar Hall</option>
            <option value="litaa-seminar-hall">LITAA Seminar Hall</option>
            <option value="civil-seminar-hall">Civil Seminar Hall</option>
            <option value="amphicourt">Amphicourt</option>
            <option value="cs-seminar-hall">CS Seminar Hall</option>
          </select>
          <p>{errors.location?.message}</p>
          <input type="date" name="date" id="date" placeholder='Select date' {...register('date')} />
          <p>{errors.date?.message}</p>
          <input type="time" name="time" id="time" placeholder='Select time' {...register('time')} />
          <p>{errors.time?.message}</p>
          <button type="submit">Allocate</button>
        </form>
      </div>
    </div>
  );
}

export default ClassAllocation;
