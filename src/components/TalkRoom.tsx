import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectTalk } from "../features/talkSlice";
import { db } from "../firebase/firebase";
import Answers from "./Answers";
import Chats from "./Chats";
import styles from "./TalkRoom.module.css";

export interface CHAT {
  text: string;
  type: string;
}

type TALKDATA = {
  answers: string[];
  question: string;
};

type TALK = {
  avatar?: string;
  username?: string;
  dataList?: TALKDATA[];
};

const TalkRoom: React.FC = () => {
  const talk = useSelector(selectTalk);
  let currentNum = 0;
  const [talks, setTalks] = useState<TALK>({});
  const [answers, setAnswers] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [chats, setChats] = useState<CHAT[]>([]);
  // const [avatar, setAvatar] = useState("");
  // const [username, setUsername] = useState("");
  // const [dataList, setDataList] = useState<TALKDATA[]>([]);

  const addChats = (chat: CHAT) => {
    setChats((prevChat) => {
      return [...prevChat, chat];
    });
  };

  const selectAnswer = (answer: string) => {
    addChats({
      text: answer,
      type: "answer",
    });
    currentNum++;
    displayNextQuestion();
  };

  const displayNextQuestion = () => {
    if (dataList) {
      setQuestion(dataList[currentNum].question);
      setAnswers(dataList[currentNum].answers);
      addChats({
        text: question,
        type: "question",
      });
    }
  };

  useEffect(() => {
    let unmount = false;

    db.collection("talks")
      .doc(talk.tid)
      .get()
      .then((snapshot) => {
        if (!unmount) {
          console.log(snapshot.data());
          const talks = snapshot.data() as TALK;
          setTalks(talks);
        }
      });

    return () => {
      unmount = true;
    };
  }, []);

  const { avatar, username, dataList } = talks;

  useEffect(() => {
    displayNextQuestion();
  }, []);

  return (
    <section className={styles.talkRoom_section}>
      <div className={styles.talkRoom_box}>
        <Chats chats={chats} avatar={avatar} />
        <Answers answers={answers} selectAnswer={selectAnswer} />
      </div>
    </section>
  );
};

export default TalkRoom;
