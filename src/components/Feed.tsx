import React from "react";
import PostInput from "./PostInput";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { IconButton, Typography } from "@material-ui/core";
import { auth } from "../firebase/firebase";
import styles from "./Feed.module.css";

const Feed: React.FC = () => {
  return (
    <div>
      <IconButton
        className={styles.feed_exitBtn}
        onClick={async () => auth.signOut()}
      >
        <Typography component="div">Sign Out</Typography>
        <ExitToAppIcon />
      </IconButton>
      <PostInput />
    </div>
  );
};

export default Feed;
