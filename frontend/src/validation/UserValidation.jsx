import * as yup from 'yup'

export const signUpSchema = yup.object().shape({
    Name:yup.string().required(),
    Email: yup.string().email().required(),
    Password: yup.string().min(4).max(10).required(),
})

export const loginSchema = yup.object().shape({
    Email:yup.string().email().required(),
    Password: yup.string().min(4).max(10).required()

})

export const requestOfferSchema = yup.object().shape({
    tab: yup.string().required().oneOf(['request', 'offer']),
    heading: yup.string().required('Heading is required'),
    description: yup.string().required('Description is required').min(100, 'Description must be at least 100 characters')
});

export const EditProfileSchema = yup.object().shape({
    username: yup.string()
      .required('Username is required'),
    about: yup.string(),
    skills: yup.array()
      .of(yup.string())
      .min(1, 'At least one skill is required'),
    educationLevel: yup.string()
      .required('Education level is required'),
    linkedinURL: yup.string()
      .url('Invalid LinkedIn URL'),
    websiteURL: yup.string()
      .url('Invalid GitHub URL'),
    websiteURL: yup.string()
      .url('Invalid Website URL'),
  });
  
  export const allocationSchema = yup.object().shape({
    topic: yup.string().required(),
    location: yup.string().required(),
    date: yup.string().required(),
    time: yup.string().required(),
  });
