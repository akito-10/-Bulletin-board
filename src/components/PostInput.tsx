import React, { useState } from "react";
import {
  createStyles,
  makeStyles,
  TextField,
  Theme,
  IconButton,
} from "@material-ui/core";
import styles from "./PostInput.module.css";
import { AddAPhoto } from "@material-ui/icons";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    form: {
      textAlign: "center",
      margin: theme.spacing(3, 5),
    },
    input: {
      marginBottom: theme.spacing(2),
      marginRight: theme.spacing(3),
    },
  })
);

const PostInput: React.FC = () => {
  const [postText, setPostText] = useState("");
  const classes = useStyles();

  return (
    <div>
      <form className={classes.form}>
        <div className={styles.postInput_form}>
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
              <AddAPhoto />
              <input className={styles.postInput_hiddenIcon} type="file" />
            </label>
          </IconButton>
        </div>
        <button
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
