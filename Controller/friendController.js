import Friends from "../model/Friends.js"; // Adjust the path as per your project structure
import User from '../model/Users.js'; // Adjust the path as per your project structure

export const addFriend = async (req, res) => {
    const { userId, friendEmail } = req.body; 
    
    try {
        const friend = await User.findOne({ email: friendEmail });
        
        if (!friend) {
            return res.status(400).json({ message: 'Friend user not found' });
        }
        
        const newFriend = new Friends({
            userId: userId,
            friendId: friend._id, 
        });
        
        await newFriend.save();
        
        res.status(201).json(newFriend);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};


export const getAllFriends = async (req, res) => {
    const { userId } = req.query;
    
    try {
        const friends = await Friends.find({ userId: userId }).populate('friendId', 'username email');

        if (!friends || friends.length === 0) {
            return res.status(404).json({ message: 'No friends found for the user' });
        }

        const friendDetails = friends.map(friend => ({
            userId: friend.friendId._id,
            username: friend.friendId.username,
            email: friend.friendId.email
        }));
        res.status(200).json(friendDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};
