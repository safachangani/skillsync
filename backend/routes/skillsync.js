require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const passport  = require("passport");
const { Signup, PostRequestOffer, UserProfile, Notification, Partner, Message, Comment} = require('../controller/controller');
const saltRounds = 10;
const { OAuth2Client } = require('google-auth-library');
// const jwt = require('jsonwebtoken');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Define storage for uploaded files
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Specify the destination folder where files will be saved
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) // Use the original filename for uploaded files
    }
})

// Create an instance of multer middleware
const upload = multer({ storage: storage });

router.post('/user-signup', async (req, res) => {
    console.log('hi',saltRounds);
    console.log(req.body.Name);
    try {
        // Check if the email already exists
        const existingUser = await Signup.findOne({ email: req.body.Email });
        if (existingUser) {
            // If a user with the same email exists, respond with an error message
            return res.status(400).json({ message: 'Email already exists' });
        }

        // If the email is unique, proceed with user creation
        const salt = await bcrypt.genSalt(saltRounds);
        console.log(salt,"hii");
        const hash = await bcrypt.hash(req.body.Password, salt);
        
        if (!hash) {
            // Handle the case where the hash is empty (typically due to an issue with bcrypt)
            throw new Error('Password hashing failed');
        }

        const signup = new Signup({
            name: req.body.Name,
            email: req.body.Email,
            password: hash
        });

        await signup.save();
        console.log("account created");
        
        res.status(200).json({ message: 'Account created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/google-login', async (req, res) => {
  try {
    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({ message: 'No Google credential provided.' });
    }

    // 1) Verify the ID token with Google
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture, email_verified } = payload;

    if (!email_verified) {
      return res
        .status(400)
        .json({ message: 'Google account email not verified.' });
    }

    // 2) Look for an existing user by googleId
    let user = await Signup.findOne({ googleId });

if (!user) {
  // If no googleId match, try by email
  user = await Signup.findOne({ email });
  if (user) {
    // Link the Google ID if they already have a manual account
    user.googleId = googleId;
    user.avatar = user.avatar || picture;
    await user.save();
  } else {
    // Create brand-new user
    user = new Signup({
      email,
      googleId,
      name,
      avatar: picture,
    });
    await user.save();
  }
}

    // 4) Issue your own JWT (same as manual login)
    const payloadForJwt = {
      _id:    user._id,
      email: user.email,
      name: user.name
    };
    const accessToken = jwt.sign(payloadForJwt, process.env.SECRET_KEY, {
      expiresIn: '7d',
    });

    return res.status(200).json({ message: 'success', accessToken });
  } catch (err) {
    console.error('Error in /google-login:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.post('/user-login', async (req, res) => {
    // console.log('hauisdoi');
    // console.log('hi', req.body);
    try {
        const email = req.body.Email;
        const password = req.body.Password;
        const user = await Signup.findOne({ email });
        console.log(user);
        
        if (user) {
            // console.log('hi', user);
            bcrypt.compare(password, user.password).then(function (result) {
                if (result) {
                    const accessToken = jwt.sign(user.toJSON(), process.env.SECRET_KEY);
                    res.json({ accessToken: accessToken, message: 'successfully logged in' });
                } else {
                    res.json({ message: 'incorrect password' });
                }
            });
        } else {
            res.json({ message: 'user not found' });
        }
    } catch (err) {
        res.json({ message: err.message });
    }
});

function authenticateToken(req, res, next) {
  console.log("hiiiiiy");
  
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        console.log(user,"auth");
        
        next();
    });
}

router.get('/get-user-profile', authenticateToken, async(req, res) => {
  console.log(req.user,"get email");
  
    // If the token is successfully verified, the user details should be available in req.user
    const id = req.user._id;
    const user = await UserProfile.findOne({userId:id});
    console.log(user,"user profile");
    
   
    res.json({ name: user.username, userId: req.user._id,filename:user.filename });
});
router.post('/post-request-offer', authenticateToken, (req, res) => {
  console.log('📥 Incoming Post Data:', req.body);

  const { title, type, category, description, skills, createdAt } = req.body;

  // Create a new instance of the model
  const postRequestOffer = new PostRequestOffer({
    title,
    type,
    category,
    description,
    skills,       // array of strings
    createdAt,
    userId: req.user._id
  });

  // Save to DB
  postRequestOffer.save()
    .then(savedData => {
      res.status(200).send('Request successfully saved');
    })
    .catch(err => {
      console.error('❌ DB Save Error:', err);
      res.status(500).send('Internal Server Error');
    });
});


router.get('/get-updates', authenticateToken, async (req, res) => {
    try {
        // Find all documents in the collection
        const postRequestOffers = await PostRequestOffer.find({}).exec();
        // console.log(postRequestOffers, "postreq");
        const updatedPostRequestOffers = [];
        for (let i = 0; i < postRequestOffers.length; i++) {
            const postRequestOffer = postRequestOffers[i];
            const userId = postRequestOffer._doc.userId;

            // Fetch userProfile for the current userId
            const userProfile = await UserProfile.findOne({ userId }).exec();

            if (userProfile) {
                const filename = userProfile.filename;
                const username = userProfile.username;

                // Create a new object with the required fields
                const updatedOffer = {
                    _id: postRequestOffer._id,
                    type: postRequestOffer.type,
                    title: postRequestOffer.title,
                    description: postRequestOffer.description,
                    category: postRequestOffer.category,
                    skills:postRequestOffer.skills,
                    createdAt:postRequestOffer.createdAt,
                    userId: userId, // Assign userId separately
                    filename: filename,
                    username: username
                };
                updatedPostRequestOffers.push(updatedOffer);
            }
        }
        // console.log(updatedPostRequestOffers, "post");
        res.status(200).json(updatedPostRequestOffers);
    } catch (error) {
        console.error('Error retrieving post request offers:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/get-update/:postId", authenticateToken, async (req, res) => {
  try {
    const postId = req.params.postId;

    // 1) Fetch the post itself
    const postReqOff = await PostRequestOffer.findById(postId).lean();
    if (!postReqOff) {
      return res.status(404).json({ error: "Post not found" });
    }

    // 2) Fetch the corresponding user profile by postReqOff.userId
    const userProfile = await UserProfile.findOne({ userId: postReqOff.userId }).lean();
    console.log(userProfile,"userprofile");
    
    if (!userProfile) {
      // It’s possible the profile doesn’t exist yet
      return res.status(404).json({ error: "User profile not found" });
    }

    // 3) Merge username + location into the post object
    const merged = {
      ...postReqOff,
      username: userProfile.username,
      location: userProfile.location,
      profileId: userProfile._id
    };

    // 4) Send back the merged object
    return res.status(200).json({ postReqOff: merged });

  } catch (err) {
    console.error("Error in /get-update/:postId:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post('/edit-profile', authenticateToken, upload.single('avatar'), async (req, res) => {
  try {
    console.log('hi', req.body,"useid",req.user._id);

   const {
  fullName,
  username,
  bio,
  location,
  skills,
  linkedinURL,
  githubURL,
  websiteURL,
} = req.body;

const skillsData = req.body.skills;

let parsedSkills = [];
try {
  parsedSkills = typeof skillsData === 'string' ? JSON.parse(skillsData) : skillsData;
} catch (err) {
  console.error('Invalid skills JSON:', err);
  parsedSkills = [];
}


const profileData = {
  fullName,
  username,
  bio,
  location,
  skills: parsedSkills,
  linkedinURL,
  githubURL,
  websiteURL,
  filename: req.file?.originalname || null,
  userId: req.user._id
};


    const existingProfile = await UserProfile.findOne({ userId: req.user._id });

    if (existingProfile) {
      // Update existing profile
      const updatedProfile = await UserProfile.findOneAndUpdate(
        { userId: req.user._id },
        { $set: profileData },
        { new: true }
      );
      console.log('Profile updated:', updatedProfile);
      return res.status(200).json({ message: 'Profile updated', savedUser: updatedProfile });
    } else {
      // Create new profile
      const newUser = new UserProfile(profileData);
      const savedUser = await newUser.save();
      console.log('New profile created:', savedUser);
      return res.status(201).json({ message: 'Profile created', savedUser });
    }
  } catch (error) {
    console.error('Error handling profile:', error);
    return res.status(500).json({ error: 'An error occurred while saving or updating user profile' });
  }
});


router.get('/get-userId', authenticateToken, async (req, res) => {
    
    try {
        res.status(201).json({ userId: req.user._id });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
})

router.post('/send-notification', authenticateToken, async (req, res) => {
  try {
    console.log("senderid",req.user._id);
    
    const { recipientUserId, postId, type } = req.body;
    // e.g. type === 'accepted'

    // Optionally fetch the post title so you can embed it in the message:
    const post = await PostRequestOffer.findById(postId).lean();
    const title = post ? post.title : 'your post';

    // If it's an “accepted” notification, message could read:
    const message =
      type === 'accepted'
        ? `Your ${title} has been accepted by a partner.`
        : `Your ${title} was declined.`;

    const notification = new Notification({
      postId,
      recipientUserId,
      senderUserId: req.user._id,
      message,
      handled: false,
      type
    });

    await notification.save();
    return res.status(201).json({ message: 'Notification sent successfully.' });
  } catch (err) {
    console.error('Error sending notification:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
});
// POST /handle-notification
// Body: { notificationId: <ObjectId>, action: 'accepted' | 'declined' }
router.post(
  '/handle-notification',
  authenticateToken,
  async (req, res) => {
    try {
      const { notificationId, action } = req.body;
      if (!['accepted', 'declined'].includes(action)) {
        return res.status(400).json({ error: 'Invalid action.' });
      }
      const updated = await Notification.findByIdAndUpdate(
        notificationId,
        {
          handled: true,
          type: action,
          message:
            action === 'accepted'
              ? 'You are now partners.'
              : 'Your request was declined.'
        },
        { new: true }
      );
      return res.status(200).json({ notification: updated });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Server error.' });
    }
  }
);


router.get('/get-notifications',authenticateToken,async (req, res) => {
  try {
      const userId = req.user._id.toString();
      const notifs = await Notification.find({
        recipientUserId: userId,
        handled: false
      })
        .sort({ createdAt: -1 })
        .lean();
      return res.status(200).json({ notifications: notifs });
    } catch (err) {
      console.error('Error in GET /get-notifications:', err);
      return res.status(500).json({ error: 'Server error' });
    }
  }
);

router.post("/send-message", authenticateToken, async (req, res) => {
    try {

        const notification = new Notification({
            postId: req.body.postId,
            recipientUserId: req.body.senderUserId,
            senderUserId: req.user._id,
            message: req.body.message
        });
        // Save the notification to the database
        await notification.save();
        res.status(201).json({ message: 'Notification sent successfully.' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }

})
router.post("/add-partner", authenticateToken, async (req, res) => {
    console.log(req.body);
    const { partnerId, postId } = req.body;
    try {
        let user = await Partner.findOne({ userId: req.user._id });
        let partner = await Partner.findOne({ userId: partnerId });

        // If the user's document doesn't exist, create a new one
        if (!user) {
            user = new Partner({ userId: req.user._id, partnerIds: [{ partnerId, postId }] });
        } else {
            // If the user's document exists, check if the partnerId already exists
            const existingPartner = user.partnerIds.find(({ partnerId: pId }) => pId === partnerId);
            if (existingPartner) {
                // If the partnerId already exists, update its postId
                existingPartner.postId = postId;
            } else {
                // If the partnerId doesn't exist, add a new partnerId with postId
                user.partnerIds.push({ partnerId, postId });
            }
        }

        // If the partner's document doesn't exist, create a new one
        if (!partner) {
            partner = new Partner({ userId: partnerId, partnerIds: [{ partnerId: req.user._id, postId }] });
        } else {
            // If the partner's document exists, check if the userId already exists
            const existingUser = partner.partnerIds.find(({ partnerId: pId }) => pId === req.user._id);
            if (!existingUser) {
                // If the userId doesn't exist, add a new userId with postId
                partner.partnerIds.push({ partnerId: req.user._id, postId });
            }
        }

        // Save both updated documents
        await user.save();
        await partner.save();

        // Respond with success message
        res.status(200).json({ message: 'Partners added successfully.' });
    } catch (error) {
        console.error('Error adding partners:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// POST /partners/accept
// Body: { postId: <ObjectId>, requesterId: <ObjectId> }
// Purpose: User A (authenticated) accepts User B’s (requesterId) connection on postId.
router.post('/partners/accept',authenticateToken,async (req, res) => {
 try {
    console.log(req.body,"partner");
    
    const accepterId = req.user._id.toString();
    const { postId, requesterId } = req.body;

    // 1) Upsert Partner documents so they become partners
    let userDoc = await Partner.findOne({ userId: accepterId });
    let partnerDoc = await Partner.findOne({ userId: requesterId });

    if (!userDoc) {
      userDoc = new Partner({
        userId: accepterId,
        partnerIds: [{ partnerId: requesterId, postId }]
      });
    } else {
      const existing = userDoc.partnerIds.find(
        (p) => p.partnerId.toString() === requesterId
      );
      if (existing) {
        existing.postId = postId;
      } else {
        userDoc.partnerIds.push({ partnerId: requesterId, postId });
      }
    }

    if (!partnerDoc) {
      partnerDoc = new Partner({
        userId: requesterId,
        partnerIds: [{ partnerId: accepterId, postId }]
      });
    } else {
      const existing = partnerDoc.partnerIds.find(
        (p) => p.partnerId.toString() === accepterId
      );
      if (!existing) {
        partnerDoc.partnerIds.push({ partnerId: accepterId, postId });
      }
    }

    await userDoc.save();
    await partnerDoc.save();

    // 2) Mark original “connect” request as handled (so it disappears)
    await Notification.updateMany(
      {
        postId,
        recipientUserId: accepterId,
        senderUserId: requesterId,
        type: 'connect',
        handled: false
      },
      { $set: { handled: true } }
    );

    // 3) Grab usernames so we can build a nice “accepted” message
    const accepterProfile = await UserProfile.findOne({ userId: accepterId }).lean();
    const requesterProfile = await UserProfile.findOne({ userId: requesterId }).lean();
    const accepterName = accepterProfile?.username || 'Someone';
    const requesterName = requesterProfile?.username || 'Someone';

    // 4) Create “accepted” notification for **requester** → “You are now partners with {accepterName}.”
    const msgToRequester = `You are now partners with ${accepterName}.`;
    await Notification.create({
      postId,
      recipientUserId: requesterId,
      senderUserId: accepterId,
      senderUsername: accepterName,
      message: msgToRequester,
      type: 'accepted',
      handled: false
    });

    // 5) Create “accepted” notification for **accepter** → “You are now partners with {requesterName}.”
    const msgToAccepter = `You are now partners with ${requesterName}.`;
    await Notification.create({
      postId,
      recipientUserId: accepterId,
      senderUserId: requesterId,
      senderUsername: requesterName,
      message: msgToAccepter,
      type: 'accepted',
      handled: false
    });

    return res.status(200).json({ message: msgToRequester });
  } catch (err) {
    console.error('Error in /partners/accept:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
  }
);
router.get('/get-profile', authenticateToken, async (req, res) => {
    try {
        // Fetch profile data from the database based on the user ID in the token
        const profile = await UserProfile.findOne({ userId: req.user._id });

        // Check if profile exists
        if (!profile) {
            return res.status(200).json({ error: 'create profile' });
        }

        // Respond with the profile data
        res.status(200).json(profile);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

router.get('/get-partners', authenticateToken, async (req, res) => {
    try {
        const partner = await Partner.findOne({ userId: req.user._id });
        // console.log(partner);
        if (partner) {
            const partnerData = [];

            // Iterate over partnerIds array
            for (const partnerIdObj of partner.partnerIds) {
                // Get profile of the partner
                const partnerProfile = await UserProfile.findOne({ userId: partnerIdObj.partnerId });
                // console.log(partnerProfile);
                // Get post details using postId
                const post = await PostRequestOffer.findById(partnerIdObj.postId);
                // console.log('o',post);
                // Construct partner data object
                const partnerObj = {
                    partnerProfile,
                    postTitle: post.heading,
                    postId: post._id
                };

                partnerData.push(partnerObj);
            }
            // Send partner data as response
            res.status(200).json({ partnerData: partnerData, myId: req.user._id });
        } else {
            res.status(404).json({ message: 'Partner not found' });
        }
    } catch (error) {
        console.error('Error fetching partners:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-update/:id', authenticateToken, async (req, res) => {
    try {
        // Get the update ID from the request params
        const updateId = req.params.id;
        //   console.log(updateId,"user");
        // Fetch the update data from the database based on the ID
        const update = await PostRequestOffer.findById(updateId);
        // Check if update exists
        if (!update) {
            return res.status(404).json({ message: 'Update not found' });
        }
        // Send the update data in the response
        res.status(200).json({ update: update, user: req.user._id });
    } catch (error) {
        console.error('Error fetching update:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/get-message-history/:partnerId', authenticateToken, async (req, res) => {
  
    const userId = req.user._id;
    const partnerId = req.params.partnerId;
    console.log("does nodemon working");

    try {
        const messages = await Message.find({
            $or: [
                { senderId: userId, receiverId: partnerId },
                { senderId: partnerId, receiverId: userId }
            ]
        }).sort({ createdAt: 1 }); // oldest to newest
        res.status(200).json(messages)
        console.log("successfully got the messages");

    } catch (err) {
        console.log(err);
        res.status(500).json({ err: "Error fetching Message" });
    }

})
// Assuming you have an Express router set up
router.post('/submit-comment', authenticateToken, async (req, res) => {
    try {
        const { partnerId, content } = req.body;
        const userId = req.user._id; // Assuming you have authentication middleware

        // Save the comment to the database
        const comment = await Comment.create({
            partnerId,
            userId,
            content,
            createdAt: new Date()
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error saving comment to database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-comments/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user._id;
        // Find all comments associated with the provided user ID
        const comments = await Comment.find({ partnerId: userId });
        // Array to store updated comments with user names
        const commentsWithUserNames = [];

        // Fetch user names for each comment
        for (const comment of comments) {
            const user = await UserProfile.findOne({ userId: comment.userId });
            // Add user name to comment object
            const commentWithUserName = {
                ...comment.toJSON(),
                userName: user ? user.username : 'Unknown'
            };
            commentsWithUserNames.push(commentWithUserName);
        }

        res.status(200).json({ comments: commentsWithUserNames });
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get-all-profiles', authenticateToken, async (req, res) => {
    console.log("hi");
    try {
        // Fetch all profiles from the database
        const profiles = await UserProfile.find();
        // console.log(profiles);
        res.json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


router.get("/check-profile-data", authenticateToken, async (req, res) => {
    try {
        // Fetch profile data from the database based on the user ID in the token
        const profile = await UserProfile.findOne({ userId: req.user._id });

        // Check if profile exists
        if (!profile) {
            return res.status(200).json({ profileExists: false });
        }

        // Respond with the profile data
        res.status(200).json({ profileExists: true });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/upload', upload.single('file'), (req, res) => {
    console.log("filee", req.file);
    const fileUrl = `http://localhost:9000/skillsync/uploads/${req.file.filename}`;
    console.log(fileUrl, "fileUrl");

    res.json({ fileUrl });
});


router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
    
    
);
console.log("google workss");
router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        console.log("google working or not");
        
        // Send a token or redirect to frontend
        res.redirect('http://localhost:3000/home'); // Or send token as query param
    }
);




  // GET profile by ID
router.get("/profile-visit/:id", async (req, res) => {
  try {
      console.log("user profile ");
    const profile = await UserProfile.findById(req.params.id);
    

    if (!profile) {
      return res.status(404).json({ message: "Profile not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

