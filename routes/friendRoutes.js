import express from 'express';
import { addFriend,getAllFriends } from '../Controller/friendController.js';

const router = express.Router();

// Routes
router.post('/addfriend', addFriend);
router.get('/getfriends', getAllFriends);

export default router;
