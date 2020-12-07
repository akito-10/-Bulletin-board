import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase/firebase";
import styles from "./Group.module.css";

const Group: React.FC = () => {
  const user = useSelector(selectUser);
  const [question, setQuestion] = useState([]);
  const [answers, setAnswers] = useState([]);

  const addChatsData = () => {
    db.collection("users").add({
      uid: user.uid,
      question: question,
      answers: answers,
    });
  };

  return (
    <section>
      <div>会話を作成する！</div>
    </section>
  );
};

export default Group;
