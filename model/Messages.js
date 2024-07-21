import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const messageSchema = new Schema({
  senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiverId: { type: Schema.Types.ObjectId, ref: 'User' }, // nullable for group messages
  groupId: { type: Schema.Types.ObjectId, ref: 'Group' }, // nullable for private messages
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Message = model('Message', messageSchema);

export default Message;
