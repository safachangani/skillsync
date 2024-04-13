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
// export const fileFormSchema = yup.object().shape({
//     title: yup.string().required(),
//     lessonName: yup.string().required(),
//     tutorial: yup.mixed().required('Please upload a file')
// })

// export const addLessonSchema = yup.object().shape({
//     lessonName: yup.string().required(),
//     tutorial: yup.mixed().required('Please upload a file')
// })