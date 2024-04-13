const mongoose = require('mongoose');

// Define schema
const signupSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Password: { type: String, required: true }
});

// Create model
const Signup = mongoose.model('Signup', signupSchema);


const postRequestOfferSchema = new mongoose.Schema({
    tab: { type: String, required: true },
    heading: { type: String, required: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup', required: true }
});

// Create mongoose model
const PostRequestOffer = mongoose.model('PostRequestOffer', postRequestOfferSchema);


// Export both model and schema
module.exports = {
    Signup,
    PostRequestOffer
};
