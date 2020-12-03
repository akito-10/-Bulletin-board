import React from "react";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import styles from "./Post.module.css";

interface PROPS {
  postId: string;
  avatar: string;
  image: string;
  text: string;
  timestamp: any;
  username: string;
}

const useStyles = makeStyles((theme) => ({
  post: {
    margin: theme.spacing(3, 5),
  },
  smallRight: {
    marginRight: theme.spacing(3),
  },
  smallTop: {
    marginTop: theme.spacing(3),
  },
}));

const Post: React.FC<PROPS> = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.post}>
      <div className={styles.post_content}>
        <div className={classes.smallTop}>
          <Avatar src={props.avatar} className={classes.smallRight} />
        </div>
        <div>
          <div className={styles.post_header}>
            <h3>
              <span className={classes.smallRight}>@{props.username}</span>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
