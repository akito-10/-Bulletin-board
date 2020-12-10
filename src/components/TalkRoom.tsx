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

interface TALKDATA {
  answers: string[];
  question: string;
}

interface TALK {
  avatar?: string;
  username?: string;
  dataList?: TALKDATA[];
}

const TalkRoom: React.FC = () => {
  const talk = useSelector(selectTalk);
  let currentNum: number;
  const [talks, setTalks] = useState<TALK>({});
  const [answers, setAnswers] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [chats, setChats] = useState<CHAT[]>([]);
  const [avatar, setAvatar] = useState<string | undefined>("");
  const [username, setUsername] = useState<string | undefined>("");
  const [dataList, setDataList] = useState<TALKDATA[] | undefined>();
  const [talkContents, setTalkContents] = useState<TALK>({});

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
    console.log(currentNum);
    if (dataList) {
      if (currentNum < dataList.length) {
        displayNextQuestion(dataList[currentNum]);
      } else {
        addChats({
          text: "質問は終わり！ありがとう！！",
          type: "question",
        });
      }
    }
  };

  const displayNextQuestion = (data: TALKDATA) => {
    console.log(data);
    if (data) {
      setQuestion(data.question);
      setAnswers(data.answers);
      addChats({
        text: question,
        type: "question",
      });
    }
  };

  useEffect(() => {
    let unmounted = false;
    const initData: TALKDATA[] = [];

    db.collection("talks")
      .doc(talk.tid)
      .get()
      .then((snapshot) => {
        if (!unmounted) {
          setAvatar(snapshot.data()?.avatar);
          setUsername(snapshot.data()?.username);
          const len = snapshot.data()?.dataList.length;
          for (let i = 0; i < len; i++) {
            // エラーがでた記述↓
            initData[i] = snapshot.data()?.dataList[i];
          }
          currentNum = 0;
          displayNextQuestion(initData[currentNum]);
        }
      });

    const unmount = () => {
      unmounted = true;
    };

    return () => {
      unmount();
    };
  }, []);

  useEffect(() => {
    const scrollArea = document.getElementById("scroll-area");
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  });

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
