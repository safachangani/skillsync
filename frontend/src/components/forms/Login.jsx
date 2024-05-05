import React, { useState } from 'react';
import './signup.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { loginSchema } from '../../validation/UserValidation';
import axios from '../../axios';
import { Link, useNavigate } from 'react-router-dom';

function UserLogin() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');

  function loginSubmit(data) {
    console.log(data);
    axios.post('/user-login', data)
      .then((response) => {
        console.log(response);
        if (response.data.message === 'successfully logged in') {
          localStorage.setItem('user-token', response.data.accessToken);
          navigate('/home');
        } else {
          setErrorMessage(response.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <div className='container'>
      <div className="form">
        <h3>SkillSync</h3>
        <h1>Welcome Back</h1>
        <form action="" onSubmit={handleSubmit(loginSubmit)}>
          <input type="email" name="email" id="" placeholder='Enter your email' {...register("Email")} />
          <p>{errors.Email?.message}</p>
          <input type="password" name="" id="" placeholder='Enter your password' {...register("Password")} />
          <p>{errors.Password?.message}</p>
          {/* <Link to={'/home'}> */}
          <button type="submit">Login</button>
          {/* </Link> */}
          <p>Don't have an account? 
          <Link to={'/signup'}>Signup</Link>
          </p>
        </form>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
      <div className="vector">
        <img src="https://img.freepik.com/free-vector/script-writing-software-engineering-coding-workshop-code-created-workshop-online-programming-course-apps-games-development-class-concept_335657-818.jpg?size=626&ext=jpg&ga=GA1.1.1412446893.1705104000&semt=ais" alt="" />
      </div>
    </div>
  );
}

export default UserLogin;
