import { useEffect, useState } from "react";
import {
  getCommentsAPI,
  addCommentAPI
} from "../api/discussion.api";
import CommentItem from "./CommentItem";
import { socket } from "../socket/socket";
import { useAuth } from "../context/AuthContext";

const CommentSection = ({ postId, authorId }) => {

  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const { user } = useAuth();

  const userId = user ? user._id : null;

  /*
  FETCH COMMENTS
  */

  const fetchComments = async () => {
    try {
      const res = await getCommentsAPI(postId);
      // Group comments based on parentComment
      setComments(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  useEffect(() => {
    const handleNewComment = (comment) => {
      if (comment.postId === postId) {
        setComments((prev) => [comment, ...prev]);
      }
    };

    socket.on("newComment", handleNewComment);

    return () => {
      socket.off("newComment", handleNewComment);
    };
  }, [postId]);

  /*
  ADD COMMENT
  */

  const handleAddComment = async () => {
    if (!text.trim() || !userId) return;

    // Use socket if you want real-time emit
    socket.emit("addComment", {
      postId,
      userId,
      text,
      authorId
    });

    setText("");
    // we do not need to fetchComments since socket handles real time
  };

  // Find root comments (ones without parentComment)
  const rootComments = comments.filter(c => !c.parentComment);

  return (

    <div style={{ marginTop: "10px", width: "100%" }}>

      <div style={{ display: "flex", gap: "10px", marginBottom: "15px" }}>
        <input
          style={{ flex: 1, padding: "8px" }}
          placeholder="Write comment..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <button onClick={handleAddComment} disabled={!userId}>
          Comment
        </button>
      </div>

      <div>

        {rootComments.map((comment) => (
          <CommentItem
            key={comment._id}
            comment={comment}
            allComments={comments}
            postId={postId}
            authorId={authorId}
          />
        ))}

      </div>

    </div>

  );

};

export default CommentSection;