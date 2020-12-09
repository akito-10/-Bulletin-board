import React from "react";
import { Button } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import styles from "./Answers.module.css";

interface PROPS {
  answers: string[];
  selectAnswer: (answer: string) => void;
}

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      borderColor: "#FFB549",
      color: "#FFB549",
      fontWeight: 600,
      marginBottom: "8px",
      "&:hover": {
        backgroundColor: "#FFB549",
        color: "#fff",
      },
    },
  })
);

const Answers: React.FC<PROPS> = (props) => {
  const classes = useStyles();

  return (
    <div className={styles.answers_contain}>
      {props.answers.map((answer, index) => (
        <Button
          key={index}
          className={classes.button}
          variant="outlined"
          onClick={() => props.selectAnswer(answer)}
        >
          {answer}
        </Button>
      ))}
    </div>
  );
};

export default Answers;
