import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const friendSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  friendId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

const Friends = model('Friends', friendSchema);

export default Friends;
