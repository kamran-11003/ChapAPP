import Message from '../model/Messages.js'; 
export const sendMessage = async (req, res) => {
    const { senderId, receiverId, groupId, content } = req.body; 
    try {
        const newMessage = new Message({
            senderId,
            receiverId,
            groupId,
            content,
            createdAt: new Date(),
        });
        
        await newMessage.save();
        
        res.status(201).json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
export const getMessagesBetweenUsers = async (req, res) => {
    const { senderId, receiverId } = req.params;

    try {
        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ createdAt: 1 }); // Sort messages by createdAt in ascending order

        res.status(200).json(messages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
