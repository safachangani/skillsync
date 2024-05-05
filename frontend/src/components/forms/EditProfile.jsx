import React, { useState } from 'react';
import './edit-profile.css';
import axios from '../../axios';
import Navbar from '../navbar/Navbar'
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import { TextField, Select, MenuItem } from '@mui/material';
import { FormControl, InputLabel } from '@mui/material';

const EditProfile = () => {
  const [inputValue, setInputValue] = useState('');
  const [items, setItems] = useState([]);
  const [skills, setSkills] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [profile, setProfile] = useState({});
  const [imageFile, setImageFile] = useState(null); // State to store the selected image file
  const [imageSrc, setImageSrc] = useState('https://png.pngitem.com/pimgs/s/150-1503945_transparent-user-png-default-user-image-png-png.png');
  const navigate = useNavigate();

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSkills([...skills, value]);
    } else {
      setSkills(skills.filter((skill) => skill !== value));
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddSkill = () => {
    if (inputValue.trim() === '') {
      setAlertMessage('Fill the field, please');
    } else {
      setItems([...items, inputValue]);
      setInputValue('');
      setAlertMessage('');
    }
  };

  const handleRemoveSkill = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageSrc(e.target.result);
      };
      reader.readAsDataURL(file);
console.log(file);
      // Store the selected file in the component state
      setImageFile(file);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission

    const skillsArray = items;
    const formData = new FormData(); // Create FormData object

    // Append form fields to formData
    formData.append('username', e.target.username.value);
    formData.append('about', e.target.about.value);
    formData.append('educationLevel', e.target.educationLevel.value);
    formData.append('linkedinURL', e.target.linkedinURL.value);
    formData.append('githubURL', e.target.githubURL.value);
    formData.append('websiteURL', e.target.websiteURL.value);
    console.log(imageFile);
    // Append image file if available
    if (imageFile) {
        formData.append('avatar', imageFile);
    }

    // Append skills array
    items.forEach((skill, index) => {
        formData.append(`skills[${index}]`, skill);
    });

    // Convert FormData object to JSON-like object for logging
const formDataObj = {};
for (const [key, value] of formData.entries()) {
    formDataObj[key] = value;
}

// Log the FormData object
console.log(formDataObj);
    const token = localStorage.getItem('user-token');
    axios.post('/edit-profile', formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          'Authorization':`Bearer ${token}`
        }
    })
        .then(response => {
            // Handle success
            console.log('Profile updated successfully:', response.data.savedUser);
            // Redirect or show success message to the user
            navigate("/control-panel", { state: { savedUser: response.data.savedUser } });
        })
        .catch(error => {
            // Handle error
            console.error('Error updating profile:', error);
            // Show error message to the user
        });
};

  return (
    <>
      <Navbar></Navbar>
      <div className="container-profile">
        <h2>Edit Profile</h2>
        <div className="row">
          <div className="col-md-3">
            <div className="text-center">
              <img src={imageSrc} className="avatar img-circle" alt="avatar" />
              <h4>Upload a different photo</h4>
              <input type="file" className="form-control" onChange={handleImageChange} />
            </div>
          </div>
          <div className="col-md-9 personal-info">
            <h3>Personal info</h3>
            <form className="form-horizontal" onSubmit={onSubmit}>
              <TextField className="form-control" label="Username" name="username" variant="outlined" fullWidth />
              <TextField
                className="form-control"
                label="About you"
                name="about"
                multiline
                rows={4}
                variant="outlined"
                fullWidth
              />
              {/* Other form fields */}
              <div className="form-group">
                <FormControl className="form-control" fullWidth>
                  <InputLabel>Highest level of Education</InputLabel>
                  <Select label="Highest level of Education" name="educationLevel" defaultValue="">
                    <MenuItem value="">Select...</MenuItem>
                    <MenuItem value="primary_school">Primary school or equivalent</MenuItem>
                    <MenuItem value="high_school">High school or equivalent</MenuItem>
                    <MenuItem value="associate">Associate degree or equivalent</MenuItem>
                    <MenuItem value="bachelors">Bachelor's degree or equivalent</MenuItem>
                    <MenuItem value="post_graduate">Post-graduate or equivalent</MenuItem>
                  </Select>
                </FormControl>
              </div>
              {/* Other form fields */}
              <TextField className="form-control" label="LinkedIn URL (optional)" name="linkedinURL" variant="outlined" fullWidth />
              {/* Other form fields */}
              <TextField className="form-control" label="Github URL (optional)" name="githubURL" variant="outlined" fullWidth />
              {/* Other form fields */}
              <TextField className="form-control" label="Website URL (optional)" name="websiteURL" variant="outlined" fullWidth />
              {/* Skills */}
              <div className="form-group">
                <TextField
                  type="text"
                  label="Add your skills"
                  value={inputValue}
                  onChange={handleInputChange}
                  variant="outlined"
                  fullWidth
                />
                <Button variant="contained" color="primary" id='btn-add' onClick={handleAddSkill}>Add</Button>
              </div>
              <div className="items">
                {items.map((item, index) => (
                  <span key={index}>
                    {item}
                    <i className="fas fa-times" onClick={() => handleRemoveSkill(index)}></i>
                  </span>
                ))}
              </div>
              {/* Submit and cancel buttons */}
              <div className="form-group">
                <Button type="submit" variant="contained" color="primary">Submit</Button>
                <Link to={'/control-panel'}>
                  <Button variant="contained"  id='btn-cancel' color="secondary">Cancel</Button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditProfile;

