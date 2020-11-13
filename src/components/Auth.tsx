import React, { useState } from "react";
import styles from "./Auth.module.css";
import { auth, provider } from "../firebase/firebase";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  makeStyles,
  Container,
  Box,
} from "@material-ui/core";

import LockOpenOutlinedIcon from "@material-ui/icons/LockOpenOutlined";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Auth: React.FC = () => {
  const classes = useStyles();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const signUpEmail = async () => {
    await auth.createUserWithEmailAndPassword(email, password);
  };

  const signInGoogle = async () => {
    await auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOpenOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {isLogin ? "Login" : "Sign In"}
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setPassword(e.target.value);
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={isLogin ? signInEmail : signUpEmail}
          >
            {isLogin ? "Login" : "Sign In"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Box className={styles.auth_box}>
                <span className={styles.auth_forgot_pass}>
                  Forgot password?
                </span>
              </Box>
            </Grid>
            <Grid item>
              <span
                onClick={() => setIsLogin(!isLogin)}
                className={styles.auth_switching}
              >
                {isLogin ? "Don't have an account? Sign Up" : "Move to Login"}
              </span>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={signInGoogle}
            className={classes.submit}
          >
            Sign In with Google
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Auth;
