import React from "react";
import Chats from "./Chats";
import styles from "./TalkRoom.module.css";

const TalkRoom: React.FC = () => {
  return (
    <section className={styles.talkRoom_section}>
      <div className={styles.talkRoom_box}>
        <Chats />
      </div>
    </section>
  );
};

export default TalkRoom;
