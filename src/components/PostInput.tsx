import React, { useState } from "react";
import {
  createStyles,
  makeStyles,
  TextField,
  Theme,
  IconButton,
  Avatar,
} from "@material-ui/core";
import styles from "./PostInput.module.css";
import { AddAPhoto } from "@material-ui/icons";
import { db, storage } from "../firebase/firebase";
import firebase from "firebase/app";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      textAlign: "center",
      margin: theme.spacing(3, 5),
    },
    input: {
      margin: theme.spacing(0, 3, 2, 3),
      overflowWrap: "break-word",
    },
  })
);

const PostInput: React.FC = () => {
  const user = useSelector(selectUser);
  const classes = useStyles();
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState<File | null>(null);

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setPostImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const sendPost = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (postImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + postImage.name;

      const uploadPostImg = storage.ref(`images/${fileName}`).put(postImage);
      uploadPostImg.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        () => {},
        (err) => {
          alert(err.message);
        },
        async () => {
          await storage
            .ref("images")
            .child(fileName)
            .getDownloadURL()
            .then(async (url) => {
              await db.collection("posts").add({
                userId: user.uid,
                avatar: user.photoUrl,
                image: url,
                text: postText,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                username: user.displayName,
              });
            });
        }
      );
    } else {
      db.collection("posts").add({
        userId: user.uid,
        avatar: user.photoUrl,
        image: "",
        text: postText,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        username: user.displayName,
      });
    }
    setPostImage(null);
    setPostText("");
  };

  return (
    <div>
      <form className={classes.form} onSubmit={sendPost}>
        <div className={styles.postInput_form}>
          <Avatar className={styles.postInput_avatar} src={user.photoUrl} />
          <TextField
            className={classes.input}
            label="共有したい考えを書いてみよう"
            variant="outlined"
            fullWidth
            value={postText}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPostText(e.target.value);
            }}
          />
          <IconButton>
            <label>
              <AddAPhoto
                className={
                  postImage
                    ? styles.postInput_addIconLoaded
                    : styles.postInput_addIcon
                }
              />
              <input
                className={styles.postInput_hiddenIcon}
                type="file"
                onChange={onChangeImageHandler}
              />
            </label>
          </IconButton>
        </div>
        <button
          type="submit"
          disabled={!postText}
          className={
            postText
              ? styles.postInput_sendBtn
              : styles.postInput_sendDisableBtn
          }
        >
          プッシュ！
        </button>
      </form>
    </div>
  );
};

export default PostInput;
