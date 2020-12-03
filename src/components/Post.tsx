import React, { useState, useEffect } from "react";
import styles from "./Post.module.css";
import { db, storage } from "../firebase/firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import firebase from "firebase/app";
import { Avatar, IconButton, makeStyles } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import SendIcon from "@material-ui/icons/Send";

interface PROPS {
  postId: string;
  userId: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
}

interface COMMENT {
  id: string;
  avatar: string;
  text: string;
  timestamp: any;
  username: string;
}

const useStyles = makeStyles((theme) => ({
  post: {
    margin: theme.spacing(3, 5),
  },
  rightMargin: {
    marginRight: theme.spacing(3),
  },
  topMargin: {
    marginTop: theme.spacing(3),
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    display: "inline-block",
    marginRight: theme.spacing(1),
  },
}));

const Post: React.FC<PROPS> = (props) => {
  const classes = useStyles();
  const user = useSelector(selectUser);
  const [comment, setComment] = useState("");
  const [openComment, setOpenComment] = useState(false);
  const [comments, setComments] = useState<COMMENT[]>([
    {
      id: "",
      avatar: "",
      text: "",
      timestamp: null,
      username: "",
    },
  ]);

  useEffect(() => {
    const unSub = db
      .collection("posts")
      .doc(props.postId)
      .collection("comments")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            text: doc.data().text,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        );
      });
    return () => {
      unSub();
    };
  }, [props.postId]);

  const newComment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    db.collection("posts").doc(props.postId).collection("comments").add({
      avatar: user.photoUrl,
      text: comment,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      username: user.displayName,
    });
    setComment("");
  };

  return (
    <div className={classes.post}>
      <div className={styles.post_content}>
        <div className={classes.topMargin}>
          <Avatar src={props.avatar} className={classes.rightMargin} />
        </div>
        <div>
          <div>
            <h3 className={styles.post_userInfo}>
              <span className={classes.rightMargin}>@{props.username}</span>
              <span>
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div>
            <p className={styles.post_text}>{props.text}</p>
          </div>
          <div>
            {props.image && (
              <div className={styles.post_image}>
                <img src={props.image} alt="投稿画像" />
              </div>
            )}
            <IconButton
              className={styles.post_commentOpenIcons}
              onClick={() => setOpenComment(!openComment)}
            >
              {openComment ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
              <p>{`${comments.length}件の返信`}</p>
            </IconButton>
            {openComment && (
              <>
                {comments.map((com) => (
                  <div key={com.id} className={styles.post_comments}>
                    <Avatar src={com.avatar} className={classes.small} />
                    <span className={classes.rightMargin}>@{com.username}</span>
                    <span>
                      {new Date(com.timestamp?.toDate()).toLocaleString()}
                    </span>
                    <p>{com.text}</p>
                  </div>
                ))}
              </>
            )}
            <form onSubmit={newComment} className={classes.topMargin}>
              <input
                className={styles.post_commentInput}
                type="text"
                placeholder="コメントしよう！"
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setComment(e.target.value)
                }
              />
              <IconButton type="submit">
                <SendIcon
                  fontSize="small"
                  className={
                    comment
                      ? styles.post_submitIcon
                      : styles.post_submitIconDisable
                  }
                />
              </IconButton>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
