const Post = require("../models/postSchema.js");
const Comment = require("../models/commentSchema.js");
const Notification = require("../models/notificationSchema.js");

const socketHandler = (io) => {

  io.on("connection", (socket) => {

    console.log("User Connected:", socket.id);


    /*
    JOIN USER ROOM
    */

    socket.on("joinUser", (userId) => {
      socket.join(userId);
    });


    /*
    LIKE POST
    */

    socket.on("likePost", async ({ postId, userId, authorId }) => {

      const post = await Post.findById(postId);

      if (!post.likes.includes(userId)) {

        post.likes.push(userId);
        post.dislikes = post.dislikes.filter(
          (id) => id.toString() !== userId
        );

      } else {
        // User is un-liking
        post.likes = post.likes.filter(
          (id) => id.toString() !== userId
        );
      }

      await post.save();

      io.emit("postLiked", {
        postId,
        likes: post.likes.length,
        dislikes: post.dislikes.length
      });


      /*
      CREATE NOTIFICATION
      */

      if (authorId !== userId) {

        await Notification.create({
          receiver: authorId,
          sender: userId,
          type: "like",
          post: postId
        });

        io.to(authorId).emit("notification", {
          type: "like",
          sender: userId,
          postId
        });

      }

    });


    /*
    DISLIKE POST
    */

    socket.on("dislikePost", async ({ postId, userId, authorId }) => {

      const post = await Post.findById(postId);

      if (!post.dislikes.includes(userId)) {

        post.dislikes.push(userId);
        post.likes = post.likes.filter(
          (id) => id.toString() !== userId
        );

      } else {
        // User is un-disliking
        post.dislikes = post.dislikes.filter(
          (id) => id.toString() !== userId
        );
      }

      await post.save();

      io.emit("postDisliked", {
        postId,
        likes: post.likes.length,
        dislikes: post.dislikes.length
      });

    });


    /*
    ADD COMMENT
    */

    socket.on("addComment", async (data) => {

      const { postId, userId, text, authorId, parentComment } = data;

      const commentData = {
        postId,
        user: userId,
        text
      };

      if (parentComment) {
        commentData.parentComment = parentComment;
      }

      const comment = await Comment.create(commentData);

      await Post.findByIdAndUpdate(
        postId,
        { $inc: { commentCount: 1 } }
      );

      io.emit("newComment", comment);


      /*
      SEND NOTIFICATION
      */

      if (authorId !== userId) {

        await Notification.create({
          receiver: authorId,
          sender: userId,
          type: "comment",
          post: postId
        });

        io.to(authorId).emit("notification", {
          type: "comment",
          sender: userId,
          postId
        });

      }

    });


    /*
    DISCONNECT
    */

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });

  });

};

module.exports = { socketHandler };