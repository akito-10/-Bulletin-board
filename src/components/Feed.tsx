import React, { useEffect, useState } from "react";
import PostInput from "./PostInput";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IconButton, Typography } from "@material-ui/core";
import { auth, db } from "../firebase/firebase";
import styles from "./Feed.module.css";
import Post from "./Post";

const Feed: React.FC = () => {
  const [posts, setPost] = useState([
    {
      id: "",
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
            id: doc.id,
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
      <IconButton
        className={styles.feed_exitBtn}
        onClick={async () => auth.signOut()}
      >
        <Typography component="div">Sign Out</Typography>
        <ExitToAppIcon />
      </IconButton>
      <PostInput />
      {posts[0]?.id && (
        <>
          {posts.map((post) => (
            <Post
              key={post.id}
              postId={post.id}
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
