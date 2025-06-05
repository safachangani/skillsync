const mongoose = require('mongoose');

// Define schema
const signupSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String }, 
  googleId: { type: String, unique: true, sparse: true },
  avatar:   { type: String },         
  
});

// Create model
const Signup = mongoose.model('Signup', signupSchema);


const postRequestOfferSchema = new mongoose.Schema({
  title: String,
  type: { type: String, enum: ['request', 'offer'] },
  category: String,
  description: String,
  skills: [String],
  createdAt: Date,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
// Create mongoose model
const PostRequestOffer = mongoose.model('PostRequestOffer', postRequestOfferSchema);

const userProfileSchema = new mongoose.Schema({
    fullName:String,
    username:String,
    bio: String,
    location:String,
    skills: [{
    name: String,
    level: String
  }],
    linkedinURL: String,
    githubURL: String,
    websiteURL: String,
    filename: String,
    userId: {type: mongoose.Schema.Types.ObjectId, ref: 'Signup', required: true }
    // Add other fields as needed
  });
  
  // Create the User model
const UserProfile = mongoose.model('Profile', userProfileSchema);

  // Notification Schema
const notificationSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'PostRequestOffer' },
  recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  senderUsername: { type: String }, // store sender’s username
  message: { type: String },
  handled: { type: Boolean, default: false },
  type: { type: String, enum: ['connect', 'accepted', 'declined'], default: 'connect' },
  createdAt: { type: Date, default: Date.now }
});

  
  // Create mongoose model for Notification
const Notification = mongoose.model('Notification', notificationSchema);
  
const partnersSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup', required: true },
  partnerIds: [{
      partnerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup', required: true },
      postId: { type: mongoose.Schema.Types.ObjectId, required: true }
  }]
});

const Partner = mongoose.model('Partner', partnersSchema);

// const Message = mongoose.model('Message', messageSchema);
const messageSchema = new mongoose.Schema({
  senderId: { type: String, required: true },
  receiverId: { type: String, required: true },
  content: String,
  fileUrl: String, // for file/image
  fileType: String,
  createdAt: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

const commentSchema = new mongoose.Schema({
  partnerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Partner', // Reference to the Partner model
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true
  },
  content: {
    type: String,
    required: true
  },
  fileUrl: String, // for file/image
  fileType: String, // "image", "file", etc.
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);



// Export both model and schema
module.exports = {
    Signup,
    PostRequestOffer,
    UserProfile,
    Notification,
    Partner,
    Message,
    Comment,
  
};
