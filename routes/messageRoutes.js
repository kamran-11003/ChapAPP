import express from 'express'
import { sendMessage,getMessagesBetweenUsers } from '../Controller/messageController.js'
const router=express.Router();
router.post("/send",sendMessage);
router.get("/messages/:senderId/:receiverId",getMessagesBetweenUsers);

export default router;
