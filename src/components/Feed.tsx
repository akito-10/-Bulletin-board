import React, { useEffect, useState } from "react";
import PostInput from "./PostInput";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import GroupIcon from "@material-ui/icons/Group";
import { IconButton, Typography } from "@material-ui/core";
import { auth, db } from "../firebase/firebase";
import styles from "./Feed.module.css";
import Post from "./Post";
import { Link } from "react-router-dom";

const Feed: React.FC = () => {
  const [posts, setPost] = useState([
    {
      postId: "",
      userId: "",
      avatar: "",
      image: "",
      text: "",
      timestamp: null,
      username: "",
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection("posts")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setPost(
          snapshot.docs.map((doc) => ({
            postId: doc.id,
            userId: doc.data().userId,
            avatar: doc.data().avatar,
            image: doc.data().image,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        );
      });

    return () => unSub();
  }, []);

  return (
    <div className={styles.feed_root}>
      <div className={styles.feed_headerBtns}>
        <Link to="/talkset" className={styles.feed_link}>
          <IconButton>
            <Typography component="div" className={styles.feed_groupPram}>
              New Talk
            </Typography>
            <GroupIcon />
          </IconButton>
        </Link>
        <IconButton
          className={styles.feed_exitBtn}
          onClick={async () => auth.signOut()}
        >
          <Typography component="div">Sign Out</Typography>
          <ExitToAppIcon />
        </IconButton>
      </div>
      <PostInput />
      {posts[0]?.postId && (
        <>
          {posts.map((post) => (
            <Post
              key={post.postId}
              postId={post.postId}
              userId={post.userId}
              avatar={post.avatar}
              image={post.image}
              text={post.text}
              timestamp={post.timestamp}
              username={post.username}
            />
          ))}
        </>
      )}
    </div>
  );
};

export default Feed;
