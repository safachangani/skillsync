require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const multer = require('multer');
const { Signup, PostRequestOffer, UserProfile, Notification, Partner, Message, Comment, Announcement } = require('../controller/controller');
const saltRounds = 10;


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
    console.log('hi');
    console.log(req.body.Name);
    try {
        // Check if the email already exists
        const existingUser = await Signup.findOne({ Email: req.body.Email });
        if (existingUser) {
            // If a user with the same email exists, respond with an error message
            return res.status(400).json({ message: 'Email already exists' });
        }

        // If the email is unique, proceed with user creation
        const salt = await bcrypt.genSalt(saltRounds);
        const hash = await bcrypt.hash(req.body.Password, salt);
        if (!hash) {
            // Handle the case where the hash is empty (typically due to an issue with bcrypt)
            throw new Error('Password hashing failed');
        }

        const signup = new Signup({
            Name: req.body.Name,
            Email: req.body.Email,
            Password: hash
        });

        await signup.save();
        res.status(200).json({ message: 'Account created successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.post('/user-login', async (req, res) => {
    // console.log('hauisdoi');
    // console.log('hi', req.body);
    try {
        const Email = req.body.Email;
        const Password = req.body.Password;
        const user = await Signup.findOne({ Email });

        if (user) {
            console.log('hi', user);
            bcrypt.compare(Password, user.Password).then(function (result) {
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
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token === null) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

router.get('/get-email', authenticateToken, (req, res) => {
    // If the token is successfully verified, the user details should be available in req.user
    const userName = req.user.Name;
    // console.log(req.user);
    // You can then use the userEmail to fetch the email from your database or use it directly
    // For demonstration purposes, let's send back the email in the response
    res.json({ Name: userName, userId: req.user._id });
});
router.post('/post-requst-offer', authenticateToken, (req, res) => {
    console.log(req.user);

    // Create a new instance of the model with validated data
    const postRequestOffer = new PostRequestOffer({
        tab: req.body.tab,
        heading: req.body.heading,
        description: req.body.description,
        userId: req.user._id
    });

    // Save the data to the database
    postRequestOffer.save()
        .then(savedData => {
            // Data saved successfully
            // console.log(savedData);
            res.status(200).send('Request successfully saved');
        })
        .catch(err => {
            // Error occurred while saving
            console.error(err);
            res.status(500).send('Internal Server Error');
        });
})

router.get('/get-updates', authenticateToken, async (req, res) => {
    try {
        // Find all documents in the collection
        const postRequestOffers = await PostRequestOffer.find({}).exec();
        console.log(postRequestOffers, "postreq");
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
                    tab: postRequestOffer.tab,
                    heading: postRequestOffer.heading,
                    description: postRequestOffer.description,
                    userId: userId, // Assign userId separately
                    filename: filename,
                    username: username
                };
                updatedPostRequestOffers.push(updatedOffer);
            }
        }
        console.log(updatedPostRequestOffers, "post");
        res.status(200).json(updatedPostRequestOffers);
    } catch (error) {
        console.error('Error retrieving post request offers:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get("/get-update/:postId", authenticateToken, async (req, res) => {
    try {
        const postId = req.params.postId;
        console.log("hi", postId);
        const postReqOff = await PostRequestOffer.findOne({ _id: postId });
        console.log(postReqOff);
        res.status(201).json({ postReqOff });
    } catch (err) {
        console.log(err);
    }
})

router.post('/edit-profile', authenticateToken, upload.single('avatar'), async (req, res) => {
    console.log('hi');
    // Access form data using req.body
    // console.log(req.body);

    // Access uploaded file using req.file
    // console.log(req.file);

    // Assuming your User model has fields corresponding to the form data
    const newUser = new UserProfile({
        username: req.body.username,
        about: req.body.about,
        skills: req.body.skills,
        educationLevel: req.body.educationLevel,
        linkedinURL: req.body.linkedinURL,
        githubURL: req.body.githubURL,
        websiteURL: req.body.websiteURL,
        userId: req.user._id,
        filename: req.file.originalname, // Include the image name
        // path: req.file.path // You may also include the path if needed

    });

    // Save the new user to the database
    newUser.save()
        .then(savedUser => {
            console.log('User saved successfully:', savedUser);
            res.status(201).json({ message: 'User saved successfully', savedUser });
        })
        .catch(error => {
            console.error('Error saving user:', error);
            res.status(500).json({ error: 'An error occurred while saving user' });
        });
})

router.get('/get-userId', authenticateToken, async (req, res) => {
    // console.log(req.user._id);
    try {
        res.status(201).json({ userId: req.user._id });
    } catch (err) {
        res.status(500).send('Internal Server Error');
    }
})

router.post('/send-notification', authenticateToken, async (req, res) => {
    console.log(req.body, "hi");
    try {
        const { recipientUserId, message, postId } = req.body;

        // Create a new notification
        const notification = new Notification({
            postId: postId,
            recipientUserId,
            senderUserId: req.user._id,
            message
        });

        // Save the notification to the database
        await notification.save();

        res.status(201).json({ message: 'Notification sent successfully.' });
    } catch (error) {
        console.error('Error sending notification:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Route to get notifications for a specific user
router.get('/get-notifications', authenticateToken, async (req, res) => {


    try {
        const userId = req.user._id;
        const notifications = await Notification.find({ recipientUserId: userId }).sort({ createdAt: -1 }).limit(10);
        // console.log(notifications, "here");
        let senderId
        const enhancedNotifications = await Promise.all(notifications.map(async (notification) => {
            const sender = await Signup.findById(notification.senderUserId);

            const senderName = sender ? sender.Name : 'Unknown'; // Use 'Unknown' if sender is not found
            senderId = sender ? sender._id : ''

            let enhancedMessage = '';

            if (notification.message === "Your post has been accepted.") {
                enhancedMessage = `Your post has been accepted by ${senderName}`;
            } else if (notification.message === "Let's become partners!") {
                enhancedMessage = `You are now partners with ${senderName}`;
            } else {
                // Handle other types of messages
                enhancedMessage = notification.message; // Use the original message
            }

            return { ...notification.toObject(), message: enhancedMessage };
        }));
        res.status(201).json({ notifications: enhancedNotifications, });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }

});
router.post("/send-message", authenticateToken, async (req, res) => {
    console.log("hi");
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
router.get('/get-messages/:roomId', async (req, res) => {
    try {
        // Retrieve the partnerId from the request parameters
        const roomId = req.params.roomId;

        // Find messages where the receiverId is the partnerId
        const messageCollection = await Message.find({ roomId: roomId });


        // Send the messages as a response
        res.json({ messageCollection });
    } catch (error) {
        // Handle errors
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/get-message-history/:partnerId', authenticateToken, async (req, res) => {
    // console.log("hohh",req.user,req.params);
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
        console.log(profiles);
        res.json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/announcement", authenticateToken, async (req, res) => {
    console.log(req.body)
    try {

        const announcement = new Announcement({
            topic: req.body.topic,
            location: req.body.location,
            date: req.body.date,
            time: req.body.time,
            createdBy: req.user._id
        });
        await announcement.save();
        res.status(201).json({ message: 'Announcement created successfully' });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ message: 'Unauthorized' });
    }
})
router.get("/get-announcement", authenticateToken, async (req, res) => {
    try {
        // Fetch all announcements from the database
        const announcements = await Announcement.find();
        res.json(announcements);
    } catch (error) {
        console.error('Error fetching announcements:', error);
        res.status(500).json({ message: 'Server error' });
    }
})

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
    console.log("filee",req.file);    
    const fileUrl = `http://localhost:9000/skillsync/uploads/${req.file.filename}`;
    console.log(fileUrl,"fileUrl");
    
    res.json({ fileUrl });
  });

module.exports = router;

