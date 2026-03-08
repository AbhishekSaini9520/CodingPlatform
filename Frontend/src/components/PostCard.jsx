import { useState, useEffect } from "react";
import { deletePostAPI } from "../api/discussion.api";
import CommentSection from "./CommentSection";
import { socket } from "../socket/socket";
import { ThumbsUp, ThumbsDown, MessageSquare, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const PostCard = ({ post, refreshPosts }) => {
  const [showComments, setShowComments] = useState(false);
  const [likes, setLikes] = useState(post.likes?.length || 0);
  const [dislikes, setDislikes] = useState(post.dislikes?.length || 0);
  const { user } = useAuth();

  const userId = user ? user._id : null;

  /*
  LIKE POST
  */
  const handleLike = () => {
    if (!userId) return;
    socket.emit("likePost", {
      postId: post._id,
      userId,
      authorId: post.author._id
    });
  };

  /*
  DISLIKE POST
  */
  const handleDislike = () => {
    if (!userId) return;
    socket.emit("dislikePost", {
      postId: post._id,
      userId,
      authorId: post.author._id
    });
  };

  useEffect(() => {
    const handlePostLiked = (data) => {
      if (data.postId === post._id) {
        setLikes(data.likes);
        if (data.dislikes !== undefined) setDislikes(data.dislikes);
      }
    };

    const handlePostDisliked = (data) => {
      if (data.postId === post._id) {
        setLikes(data.likes);
        setDislikes(data.dislikes);
      }
    };

    socket.on("postLiked", handlePostLiked);
    socket.on("postDisliked", handlePostDisliked);

    return () => {
      socket.off("postLiked", handlePostLiked);
      socket.off("postDisliked", handlePostDisliked);
    };
  }, [post._id]);

  /*
  DELETE POST
  */
  const handleDelete = async () => {
    try {
      await deletePostAPI(post._id);
      refreshPosts();
    } catch (err) {
      console.log(err);
    }
  };

  // Generate some dummy tags based on the topic if not provided
  const displayTags = post.tags && post.tags.length > 0
    ? post.tags
    : ["Dynamic Programming", "Tips", "Tutorial"];

  // Format date if timestamps exist
  const formattedDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString()
    : "3/5/2026";

  const authorName = post.author?.username || "sarahc";

  // Using a placeholder avatar until user avatars are fully implemented
  const avatarUrl = post.author?.avatar || `https://ui-avatars.com/api/?name=${authorName}&background=ff6b00&color=fff`;

  return (
    <div className="bg-[#1e2332] border border-[#2d3348] rounded-xl p-6 transition-all hover:border-gray-500">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={avatarUrl}
            alt={authorName}
            className="w-12 h-12 rounded-full border-2 border-[#2d3348]"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-white mb-2 leading-tight">
              {post.title}
            </h3>

            {userId && post.author && userId === post.author._id && (
              <button
                onClick={handleDelete}
                className="text-gray-500 hover:text-red-500 transition-colors p-1"
                title="Delete Post"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {post.content}
          </p>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-1.5 font-medium text-gray-300">
              <img
                src={avatarUrl}
                alt={authorName}
                className="w-5 h-5 rounded-full"
              />
              <span>{authorName}</span>
            </div>

            <button
              onClick={handleLike}
              className="flex items-center gap-1 hover:text-[#ff6b00] transition-colors"
            >
              <ThumbsUp size={16} />
              <span>{likes}</span>
            </button>

            <button
              onClick={handleDislike}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <ThumbsDown size={16} />
              <span>{dislikes}</span>
            </button>

            <button
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-1 hover:text-white transition-colors"
            >
              <MessageSquare size={16} />
              <span>{post.commentCount || 0}</span>
            </button>

            <span className="text-gray-500">{formattedDate}</span>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {displayTags.map(tag => (
              <span
                key={tag}
                className="bg-[#2d3348] text-gray-300 px-3 py-1 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-6 pt-4 border-t border-[#2d3348]">
              <CommentSection postId={post._id} authorId={post.author?._id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;