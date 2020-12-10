import React from "react";
import Chat from "./Chat";
import { CHAT } from "./TalkRoom";
import { List } from "@material-ui/core";
import { createStyles, makeStyles } from "@material-ui/core";

interface PROPS {
  chats: CHAT[];
  avatar: string | undefined;
}

const useStyles = makeStyles(() =>
  createStyles({
    chats: {
      height: 350,
      padding: "0",
      overflow: "auto",
    },
  })
);

const Chats: React.FC<PROPS> = (props) => {
  const classes = useStyles();

  return (
    <List className={classes.chats} id={"scroll-area"}>
      {props.chats.map((chat, index) => (
        <Chat
          key={index}
          text={chat.text}
          type={chat.type}
          avatar={props.avatar}
        />
      ))}
    </List>
  );
};

export default Chats;
