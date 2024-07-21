import mongoose from 'mongoose';
const { Schema } = mongoose;

const groupSchema = new Schema({
  name: { type: String, required: true },
  description: String,
  adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: { type: String, default: 'member' },
  }]
});

module.exports = mongoose.model('Group', groupSchema);
