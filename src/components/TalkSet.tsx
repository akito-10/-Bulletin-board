import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import { db } from "../firebase/firebase";
import { IconButton, TextField, Typography, Button } from "@material-ui/core";
import HomeIcon from "@material-ui/icons/Home";
import styles from "./TalkSet.module.css";
import { Link } from "react-router-dom";

interface DATA {
  question: string;
  answers: string[];
}

const TalkSet: React.FC = () => {
  const user = useSelector(selectUser);
  const [answer, setAnswer] = useState("");
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [dataList, setDataList] = useState<DATA[]>([]);

  const sendChatsData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await db.collection("talks").doc(user.uid).set({
      avatar: user.photoUrl,
      dataList: dataList,
      username: user.displayName,
    });
    setDataList([]);
  };

  return (
    <div className={styles.talkSet_contain}>
      <Link to="/" className={styles.talkSet_link}>
        <IconButton>
          <Typography component="div" className={styles.talkSet_headerPram}>
            Homeへ
          </Typography>
          <HomeIcon />
        </IconButton>
      </Link>
      <div className={styles.talkSet_main}>
        <h2>会話を作成する！</h2>
        <form onSubmit={sendChatsData}>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="質問したい事を書いてね"
              value={question}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setQuestion(e.target.value);
              }}
            />
          </div>
          <div className={styles.mb_md}></div>
          <div className={styles.talkSet_answerArea}>
            <TextField
              fullWidth
              variant="outlined"
              label="回答の選択肢を書こう"
              value={answer}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setAnswer(e.target.value);
              }}
            />
            <button
              disabled={!question || !answer}
              className={
                !question || !answer
                  ? styles.talkSet_btnDisable
                  : styles.talkSet_btn
              }
              onClick={(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
                e.preventDefault();
                setAnswers((prevAnswers) => {
                  return [...prevAnswers, answer];
                });
                setAnswer("");
              }}
            >
              回答追加
            </button>
          </div>
          <div>
            <h3>設定中の会話</h3>
            <p className={styles.talkSet_displayPram}>&lt;質問&gt;</p>
            <p className={styles.talkSet_displayQuestion}>{question}</p>
            <p className={styles.talkSet_displayPram}>&lt;回答&gt;</p>
            {answers && (
              <ul className={styles.talkSet_list}>
                {answers.map((answer, index) => (
                  <li key={index.toString()}>{`${index + 1}.\n${answer}`}</li>
                ))}
              </ul>
            )}
          </div>
          <div className={styles.talkSet_btns}>
            <Button
              disabled={!question || !answers[0]}
              variant="contained"
              color="secondary"
              className={styles.talkSet_dataListetBtn}
              onClick={() => {
                const data = { question: question, answers: answers };
                setDataList((prevDataList) => {
                  return [...prevDataList, data];
                });
                setQuestion("");
                setAnswers([]);
              }}
            >
              この会話を設定する！
            </Button>
            <Button
              disabled={!dataList[0]}
              variant="contained"
              color="primary"
              className={styles.talkSet_submitBtn}
              type="submit"
            >
              作成！！
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TalkSet;
