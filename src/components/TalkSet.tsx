import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase/firebase";
import styles from "./TalkSet.module.css";

const Group: React.FC = () => {
  const user = useSelector(selectUser);
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);

  const addChatsData = () => {
    db.collection("talks").add({
      uid: user.uid,
      question: question,
      answers: answers,
    });
  };

  return (
    <div>
      <h2>会話を作成する！</h2>
      <form></form>
    </div>
  );
};

export default Group;
