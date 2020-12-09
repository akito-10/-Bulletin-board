import { Avatar, Typography, IconButton } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { db } from "../firebase/firebase";
import { setTalk } from "../features/talkSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import styles from "./TalkPosts.module.css";
import HomeIcon from "@material-ui/icons/Home";

interface TALKS {
  id: string;
  avatar: string;
  dataList: string[];
  username: string;
}

const TalkPosts: React.FC = () => {
  const dispatch = useDispatch();
  const [talks, setTalks] = useState<TALKS[]>([
    {
      id: "",
      avatar: "",
      dataList: [],
      username: "",
    },
  ]);

  useEffect(() => {
    const unSub = db.collection("talks").onSnapshot((snapshot) => {
      setTalks(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          avatar: doc.data().avatar,
          dataList: doc.data().dataList,
          username: doc.data().username,
        }))
      );
    });

    return () => unSub();
  }, []);

  return (
    <div>
      <section className={styles.talkPosts_contain}>
        <Link to="/" className={styles.talkPosts_link}>
          <IconButton>
            <Typography component="div" className={styles.talkPosts_headerPram}>
              Homeへ
            </Typography>
            <HomeIcon />
          </IconButton>
        </Link>
        <div>
          {talks.map((talk) => (
            <div key={talk.id} className={styles.talkPosts_content}>
              <Link
                to="talkroom"
                className={styles.talkPosts_link}
                onClick={() => {
                  dispatch(
                    setTalk({
                      tid: talk.id,
                    })
                  );
                }}
              >
                <div className={styles.talkPosts_main}>
                  <Avatar src={talk.avatar} />
                  <div>
                    <p
                      className={styles.talkPosts_roomText}
                    >{`@${talk.username}'s Talk Room`}</p>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TalkPosts;
