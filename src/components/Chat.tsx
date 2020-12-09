import React from "react";
import { CHAT } from "./TalkRoom";
import { Avatar, ListItem, ListItemAvatar } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import styles from "./Chat.module.css";

interface PROPS extends CHAT {
  avatar: string | undefined;
}

const Chat: React.FC<PROPS> = (props) => {
  const isQuestion = props.type === "question";

  const user = useSelector(selectUser);

  return (
    <ListItem className={isQuestion ? styles.chat_row : styles.chat_reverse}>
      <ListItemAvatar>
        {isQuestion ? (
          <Avatar src={props.avatar} />
        ) : (
          <Avatar src={user.photoUrl} />
        )}
      </ListItemAvatar>
      <div className={styles.chat_text}>{props.text}</div>
    </ListItem>
  );
};

export default Chat;
