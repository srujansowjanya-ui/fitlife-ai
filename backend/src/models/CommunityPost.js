import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  content: { type: String, required: true }
}, { timestamps: true });

const CommunityPostSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userAvatar: { type: String, default: '' },
  content: { type: String, required: true },
  image: { type: String, default: '' }, // link to uploaded image or placeholder
  likes: [{ type: String }], // Array of User IDs who liked the post
  comments: [CommentSchema]
}, { timestamps: true });

const CommunityPost = mongoose.models.CommunityPost || mongoose.model('CommunityPost', CommunityPostSchema);
export default CommunityPost;
