import React, { useState, useEffect } from "react";
import styles from "./Post.module.css";
import { db } from "../firebase/firebase";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import firebase from "firebase/app";
import { Avatar, IconButton, makeStyles, Modal } from "@material-ui/core";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ArrowDropUpIcon from "@material-ui/icons/ArrowDropUp";
import SendIcon from "@material-ui/icons/Send";
import FavoriteIcon from "@material-ui/icons/Favorite";
import FavoriteBorderIcon from "@material-ui/icons/FavoriteBorder";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";

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

interface FAVORITE {
  id: string;
  avatar: string;
  timestamp: any;
  username: string;
}

const getModalStyles = () => {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${left}%, -${top}%)`,
  };
};

const useStyles = makeStyles((theme) => ({
  post: {
    margin: theme.spacing(3, 5),
  },
  modal: {
    outline: "none",
    position: "absolute",
    backgroundColor: "#fff",
    width: 400,
    maxWidth: "90%",
    textAlign: "center",
    borderRadius: 10,
    padding: theme.spacing(3, 4),
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [favoriteUsers, setFavoriteUser] = useState<FAVORITE[]>([
    {
      id: "",
      avatar: "",
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

  const sendUserFavorite = () => {
    setIsFavorite(!isFavorite);
    if (!isFavorite) {
      db.collection("posts").doc(props.postId).collection("favorites").add({
        avatar: user.photoUrl,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    }
  };

  const getUserFavorite = () => {
    setOpenModal(true);
    db.collection("posts")
      .doc(props.postId)
      .collection("favorites")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        setFavoriteUser(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            avatar: doc.data().avatar,
            timestamp: doc.data().timestamp,
            username: doc.data().username,
          }))
        );
      });
  };

  return (
    <div className={classes.post}>
      <div className={styles.post_content}>
        <div className={classes.topMargin}>
          <Avatar src={props.avatar} className={classes.rightMargin} />
        </div>
        <div className={styles.post_main}>
          <div>
            <h3 className={styles.post_userInfo}>
              <span className={classes.rightMargin}>@{props.username}</span>
              <span>
                {new Date(props.timestamp?.toDate()).toLocaleString()}
              </span>
            </h3>
          </div>
          <div className={styles.post_textContain}>
            <p className={styles.post_text}>{props.text}</p>
          </div>
          <div>
            {props.image && (
              <div className={styles.post_image}>
                <img src={props.image} alt="投稿画像" />
              </div>
            )}
            <div className={styles.post_iconsContain}>
              <IconButton
                className={styles.post_commentOpenIcons}
                onClick={() => setOpenComment(!openComment)}
              >
                {openComment ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                <p>{`${comments.length}件の返信`}</p>
              </IconButton>
              <div className={styles.post_options}>
                <IconButton
                  onClick={sendUserFavorite}
                  className={styles.post_favoriteIcon}
                >
                  {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                </IconButton>
                <IconButton onClick={getUserFavorite}>
                  <MenuOpenIcon />
                </IconButton>
              </div>
            </div>
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
              <IconButton type="submit" disabled={!comment}>
                <SendIcon
                  fontSize="small"
                  className={comment && styles.post_submitIcon}
                />
              </IconButton>
            </form>
          </div>
        </div>
        <Modal
          open={openModal}
          className={styles.post_modal}
          onClose={() => setOpenModal(false)}
        >
          <div style={getModalStyles()} className={classes.modal}>
            <p>いいねしたユーザー</p>
            <div className={styles.post_usersArea}>
              {favoriteUsers.map((favUser) => (
                <div className={styles.post_favoriteUsers} key={favUser.id}>
                  <Avatar src={favUser.avatar} className={classes.small} />
                  <span className={classes.rightMargin}>
                    @{favUser.username}
                  </span>
                  <span>
                    {new Date(favUser.timestamp?.toDate()).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Post;
