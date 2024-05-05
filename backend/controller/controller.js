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

const userProfileSchema = new mongoose.Schema({
    username:String,
    about: String,
    skills: [String],
    educationLevel: String,
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
    postId:{ type: mongoose.Schema.Types.ObjectId, ref: 'PostRequestOffer', required: true },
    recipientUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup', required: true },
    senderUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'Signup', required: true },
    message: { type: String, required: true },
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

const messageSchema = new mongoose.Schema({
  roomId: {
      type: String,
      required: true
  },
  senderId: {
      type: String,
      required: true
  },
  receiverId: {
      type: String,
      required: true
  },
  messages: [
      {
          content: {
              type: String,
              required: true
          },
          senderId: {
              type: String,
              required: true
          },
          receiverId: {
              type: String,
              required: true
          },
          createdAt: {
              type: Date,
              default: Date.now
          }
      }
  ]
});

// Create the Message model using the schema
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create the Comment model
const Comment = mongoose.model('Comment', commentSchema);
// Define mongoose schema for announcement
const announcementSchema = new mongoose.Schema({
  topic: String,
  location: String,
  date: String,
  time: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Signup' // Assuming you have a User model
  }
});

const Announcement = mongoose.model('Announcement', announcementSchema);

// Export both model and schema
module.exports = {
    Signup,
    PostRequestOffer,
    UserProfile,
    Notification,
    Partner,
    Message,
    Comment,
    Announcement
};
