import React, { useState, useEffect, useContext } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Send, 
  Trophy, 
  Image as ImageIcon, 
  User as UserIcon, 
  Sparkles, 
  Users, 
  AlertCircle 
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { FitnessContext } from '../context/FitnessContext';

export default function Community() {
  const { user, token } = useContext(AuthContext);
  const { challenges, joinChallenge, addXp } = useContext(FitnessContext);

  const [posts, setPosts] = useState([]);
  const [feedLoading, setFeedLoading] = useState(true);
  
  // New post state
  const [newPostContent, setNewPostContent] = useState('');
  const [selectedPresetImage, setSelectedPresetImage] = useState('');
  const [submittingPost, setSubmittingPost] = useState(false);

  // Comments state - keyed by post ID
  const [commentInputs, setCommentInputs] = useState({});

  const presetImages = [
    { label: 'Gym Selfie 🏋️‍♂️', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80' },
    { label: 'Healthy Meal 🥗', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80' },
    { label: 'Scenic Jog 🏃‍♂️', url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=600&q=80' },
    { label: 'Morning Yoga 🧘‍♀️', url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80' },
    { label: 'Flex 💪', url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80' }
  ];

  // Fetch feed
  const fetchFeed = async () => {
    setFeedLoading(true);
    try {
      const response = await fetch('/api/community/feed');
      const data = await response.json();
      if (data.success) {
        setPosts(data.posts);
      } else {
        seedMockFeed();
      }
    } catch (err) {
      console.warn('Backend offline, loading mock community feed...');
      seedMockFeed();
    } finally {
      setFeedLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  const seedMockFeed = () => {
    setPosts([
      {
        _id: 'p1',
        userId: 'u_mock_2',
        userName: 'Sarah Jenkins',
        userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Sarah',
        content: 'Just smashed a 30-minute cardio session! Felt sluggish at first but consistency is key. Keep pushing everyone! 🔥💦',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
        likes: ['mock_usr_1', 'u_mock_3'],
        comments: [
          { userId: 'u_mock_3', userName: 'David Miller', content: 'Incredible work, Sarah! You motivate me!', createdAt: new Date(Date.now() - 3600000).toISOString() }
        ],
        createdAt: new Date(Date.now() - 7200000).toISOString()
      },
      {
        _id: 'p2',
        userId: 'u_mock_3',
        userName: 'David Miller',
        userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=David',
        content: 'Meal prep Sunday! Got my macros calculated using Mifflin-St Jeor. High protein vegan tofu curries ready for the week. 🍱💪',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=600&q=80',
        likes: ['u_mock_2'],
        comments: [],
        createdAt: new Date(Date.now() - 18000000).toISOString()
      },
      {
        _id: 'p3',
        userId: 'u_mock_4',
        userName: 'Elena Rostova',
        userAvatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=Elena',
        content: 'Meditation flow this morning followed by a quick flexibility jog. Taking care of the mental wellness is just as important as the iron gym. 🧘‍♀️✨',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80',
        likes: [],
        comments: [],
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ]);
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    setSubmittingPost(true);
    try {
      const response = await fetch('/api/community/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content: newPostContent,
          image: selectedPresetImage
        })
      });
      const data = await response.json();
      if (data.success) {
        setPosts(prev => [data.post, ...prev]);
        setNewPostContent('');
        setSelectedPresetImage('');
        // Refresh XP since posting gives XP
        if (user) {
          addXp(15, 'Community share');
        }
      }
    } catch (err) {
      console.warn('Backend offline, submitting post locally...');
      const mockNewPost = {
        _id: `p_mock_${Math.random()}`,
        userId: user?.id || 'mock_usr_1',
        userName: user?.name || 'You',
        userAvatar: user?.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=You',
        content: newPostContent,
        image: selectedPresetImage,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      setPosts(prev => [mockNewPost, ...prev]);
      setNewPostContent('');
      setSelectedPresetImage('');
      addXp(15, 'Community share');
    } finally {
      setSubmittingPost(false);
    }
  };

  const handleLikePost = async (postId) => {
    if (!user) return;
    
    // Optimistic UI updates
    const currentUserId = user.id || user._id;
    setPosts(prev => prev.map(p => {
      if (p._id === postId) {
        const likes = p.likes || [];
        const liked = likes.includes(currentUserId);
        return {
          ...p,
          likes: liked 
            ? likes.filter(id => id !== currentUserId) 
            : [...likes, currentUserId]
        };
      }
      return p;
    }));

    try {
      await fetch(`/api/community/like/${postId}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (err) {
      console.warn('Backend offline, toggled like locally.');
    }
  };

  const handleCommentSubmit = async (e, postId) => {
    e.preventDefault();
    const commentVal = commentInputs[postId];
    if (!commentVal || !commentVal.trim()) return;

    // Reset input
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));

    const currentUserId = user?.id || user?._id || 'mock';
    const currentUserName = user?.name || 'You';

    try {
      const response = await fetch(`/api/community/comment/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content: commentVal })
      });
      const data = await response.json();
      if (data.success) {
        // Find post and update comments list
        setPosts(prev => prev.map(p => {
          if (p._id === postId) {
            return {
              ...p,
              comments: [...(p.comments || []), {
                userId: currentUserId,
                userName: currentUserName,
                content: commentVal,
                createdAt: new Date().toISOString()
              }]
            };
          }
          return p;
        }));
      }
    } catch (err) {
      console.warn('Backend offline, submitting comment locally...');
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), {
              userId: currentUserId,
              userName: currentUserName,
              content: commentVal,
              createdAt: new Date().toISOString()
            }]
          };
        }
        return p;
      }));
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col gap-6 pb-24 md:pb-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-white">Community & Feed</h2>
        <p className="text-xs text-gray-400 mt-1">Connect with other athletes, share your wellness accomplishments, and earn levels together.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column: Feed and Create Post */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Create Post Card */}
          {user ? (
            <div className="glass-card p-5 border border-white/[0.04] bg-gradient-to-r from-[#151c2c] to-[#0c1322]">
              <div className="flex gap-3 items-start">
                <img 
                  src={user.avatar} 
                  alt="avatar" 
                  className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 shrink-0" 
                />
                <div className="flex-grow">
                  <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
                    <textarea
                      value={newPostContent}
                      onChange={(e) => setNewPostContent(e.target.value)}
                      placeholder="Share your workout session, healthy meals, or recovery thoughts... (Earns +15 XP!)"
                      rows="2"
                      className="w-full text-xs bg-slate-900/40 border border-white/10 rounded-xl focus:outline-none focus:border-brandGreen p-3 text-white placeholder-gray-500 resize-none"
                    />

                    {/* Image selector */}
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-400 flex items-center gap-1 font-bold">
                        <ImageIcon size={12} /> Attach Photo Category:
                      </span>
                      {presetImages.map((img, i) => (
                        <button
                          key={`preset_img_${i}`}
                          type="button"
                          onClick={() => setSelectedPresetImage(selectedPresetImage === img.url ? '' : img.url)}
                          className={`text-[10px] px-2.5 py-1 rounded-lg border transition-all font-semibold ${
                            selectedPresetImage === img.url 
                              ? 'border-brandGreen bg-brandGreen/10 text-brandGreen font-bold'
                              : 'border-white/5 bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          {img.label}
                        </button>
                      ))}
                    </div>

                    {selectedPresetImage && (
                      <div className="mt-2 relative rounded-xl overflow-hidden border border-white/10 max-h-36">
                        <img 
                          src={selectedPresetImage} 
                          alt="preview" 
                          className="w-full h-36 object-cover" 
                        />
                        <button 
                          type="button"
                          onClick={() => setSelectedPresetImage('')}
                          className="absolute top-2 right-2 bg-slate-950/80 hover:bg-slate-950 text-white rounded-full p-1 text-[10px] px-2 font-bold focus:outline-none"
                        >
                          Clear
                        </button>
                      </div>
                    )}

                    <button 
                      type="submit" 
                      disabled={submittingPost || !newPostContent.trim()}
                      className="btn-primary py-2 px-6 text-xs font-bold self-end mt-2"
                    >
                      Post Feed
                    </button>
                  </form>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-card p-5 border border-white/[0.04] text-center">
              <AlertCircle size={24} className="text-gray-400 mx-auto mb-2" />
              <p className="text-xs text-gray-400">Please sign in to join community discussions and share updates.</p>
            </div>
          )}

          {/* Feed Content */}
          {feedLoading ? (
            <div className="flex flex-col items-center py-12 gap-3 text-gray-400 text-xs">
              <Users className="animate-pulse" size={24} />
              <span>Loading community feed...</span>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {posts.map((post) => {
                const isLiked = user && post.likes?.includes(user.id || user._id);
                return (
                  <div key={post._id} className="glass-card p-5 border border-white/[0.04] flex flex-col gap-4">
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={post.userAvatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${post.userName}`}
                          alt={post.userName} 
                          className="w-8 h-8 rounded-full border border-white/10 bg-slate-800" 
                        />
                        <div>
                          <h4 className="text-xs font-bold text-white">{post.userName}</h4>
                          <span className="text-[9px] text-gray-500 font-semibold">
                            {new Date(post.createdAt).toLocaleDateString(undefined, { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-[8px] font-bold text-gray-400 uppercase">
                        Fitness Athlete
                      </span>
                    </div>

                    {/* Content */}
                    <p className="text-xs text-gray-200 leading-relaxed font-medium">
                      {post.content}
                    </p>

                    {/* Image if exists */}
                    {post.image && (
                      <div className="rounded-xl overflow-hidden border border-white/[0.06] max-h-[300px]">
                        <img 
                          src={post.image} 
                          alt="post upload" 
                          className="w-full object-cover max-h-[300px]" 
                        />
                      </div>
                    )}

                    {/* Footer Interactions */}
                    <div className="flex items-center gap-4 border-y border-white/[0.04] py-2">
                      <button 
                        onClick={() => handleLikePost(post._id)}
                        className={`flex items-center gap-1.5 text-[11px] font-bold transition-colors focus:outline-none ${
                          isLiked ? 'text-brandCoral' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <Heart size={14} className={isLiked ? 'fill-current' : ''} />
                        <span>{post.likes?.length || 0} Likes</span>
                      </button>

                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                        <MessageSquare size={14} />
                        <span>{post.comments?.length || 0} Comments</span>
                      </div>
                    </div>

                    {/* Comment list */}
                    {post.comments && post.comments.length > 0 && (
                      <div className="flex flex-col gap-2.5 bg-white/[0.01] p-3 rounded-xl border border-white/[0.03]">
                        {post.comments.map((comment, cIdx) => (
                          <div key={`comm_${cIdx}`} className="text-[11px] leading-normal">
                            <span className="font-extrabold text-white mr-1.5">{comment.userName}:</span>
                            <span className="text-gray-300">{comment.content}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add Comment input */}
                    {user && (
                      <form 
                        onSubmit={(e) => handleCommentSubmit(e, post._id)} 
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={commentInputs[post._id] || ''}
                          onChange={(e) => setCommentInputs(prev => ({ ...prev, [post._id]: e.target.value }))}
                          placeholder="Write a supportive comment..."
                          className="flex-grow text-[11px] bg-slate-900/50 border border-white/10 rounded-lg focus:outline-none focus:border-brandGreen p-2 text-white placeholder-gray-500"
                        />
                        <button 
                          type="submit" 
                          className="p-2 bg-brandGreen hover:bg-brandGreen-dark text-white rounded-lg transition-colors focus:outline-none"
                        >
                          <Send size={12} />
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Challenges Board */}
        <div className="flex flex-col gap-6">
          {/* Active challenges board */}
          <div className="glass-card p-5 border border-white/[0.04]">
            <h3 className="text-sm font-bold text-gray-200 mb-1 flex items-center gap-2">
              <Trophy size={16} className="text-amber-400" />
              Community Challenges
            </h3>
            <span className="text-[9px] text-gray-400 font-bold block mb-4 uppercase tracking-wider">Join to boost your level</span>

            <div className="flex flex-col gap-4">
              {challenges.map((chal) => {
                const hasJoined = user?.joinedChallenges?.includes(chal._id);
                return (
                  <div 
                    key={chal._id} 
                    className={`p-4 rounded-2xl border transition-all ${
                      hasJoined 
                        ? 'bg-brandIndigo/5 border-brandIndigo/25' 
                        : 'bg-white/[0.01] border-white/[0.04] hover:border-white/[0.08]'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[8px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-400">
                        {chal.category}
                      </span>
                      <span className="text-[9px] text-brandGreen font-extrabold flex items-center gap-0.5 shrink-0">
                        <Sparkles size={10} /> +{chal.xpReward} XP
                      </span>
                    </div>

                    <h4 className="font-bold text-xs text-gray-200 mt-2.5 leading-snug">{chal.title}</h4>
                    <p className="text-[10px] text-gray-400 mt-1.5 leading-relaxed">{chal.description}</p>
                    
                    <button
                      onClick={() => joinChallenge(chal._id)}
                      disabled={hasJoined || !user}
                      className={`w-full mt-4 text-[10px] font-bold py-2 rounded-lg transition-all ${
                        hasJoined 
                          ? 'bg-brandIndigo/10 text-brandIndigo-light border border-brandIndigo/20 cursor-default'
                          : user
                            ? 'bg-brandGreen hover:bg-brandGreen-dark text-white shadow-sm hover:shadow-glowGreen'
                            : 'bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed'
                      }`}
                    >
                      {hasJoined ? 'Active Challenge' : user ? 'Accept Challenge' : 'Sign in to Join'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
