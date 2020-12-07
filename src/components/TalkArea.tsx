import React from "react";
import Chats from "./Chats";
import styles from "./TalkArea.module.css";

const TalkArea: React.FC = () => {
  return (
    <section className={styles.chat_section}>
      <div className={styles.chat_box}>
        <Chats />
      </div>
    </section>
  );
};

export default TalkArea;
