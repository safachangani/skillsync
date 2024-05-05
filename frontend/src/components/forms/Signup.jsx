import React, { useState } from 'react';
import './signup.css';
import { signUpSchema } from '../../validation/UserValidation';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from '../../axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

function Signup() {
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(signUpSchema),
  });
  const navigate = useNavigate();

  function userSignup(data) {
    axios.post('/user-signup', data)
      .then((response) => {
        console.log(response);
        navigate('/login');
      })
      .catch((error) => {
        console.error('Signup error:', error);
        if (error.response && error.response.data && error.response.data.message) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('An error occurred while signing up');
        }
      });
  }

  return (
    <div className='container'>
      <div className="form">
        <h3>SkillSync</h3>
        <span>Exchange your skills now!</span>
        <h1>Create an account</h1>
        {errorMessage && <p className="error">{errorMessage}</p>}
        <form action="" onSubmit={handleSubmit(userSignup)}>
          <input type="text" name="Name" id="" placeholder='Enter your name' {...register('Name')} />
          <p>{errors.Name?.message}</p>
          <input type="email" name="Email" id="" placeholder='Enter your email' {...register('Email')} />
          <p>{errors.Email?.message}</p>
          <input type="password" name="Password" id="" placeholder='Enter password' {...register('Password')} />
          <p>{errors.Password?.message}</p>
          <button type="submit">Sign Up</button>
          <p>Already have an account? <Link to={'/login'}>Login</Link></p>
        </form>
      </div>
      <div className="vector">
        <img src="https://img.freepik.com/free-vector/script-writing-software-engineering-coding-workshop-code-created-workshop-online-programming-course-apps-games-development-class-concept-pinkish-coral-bluevector-isolated-illustration_335657-1253.jpg" alt="" />
      </div>
    </div>
  );
}

export default Signup;

