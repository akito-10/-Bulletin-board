import { type } from "os";
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
  // const [avatar, setAvatar] = useState<string | undefined>("");
  // const [username, setUsername] = useState<string | undefined>("");
  // const [dataList, setDataList] = useState<TALKDATA[] | undefined>();
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
        displayNextQuestion();
      } else {
        addChats({
          text: "質問は終わり！ありがとう！！",
          type: "question",
        });
      }
    }
  };

  const displayNextQuestion = () => {
    console.log(dataList);
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
    let unmounted = false;

    db.collection("talks")
      .doc(talk.tid)
      .get()
      .then((snapshot) => {
        if (!unmounted) {
          const talk = snapshot.data() as TALK;
          setTalks(talk);
        }
      });

    const unmount = () => {
      unmounted = true;
    };

    return () => {
      unmount();
    };
  }, []);

  const { avatar, username, dataList } = talks;

  useEffect(() => {
    currentNum = 0;
    displayNextQuestion();
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
