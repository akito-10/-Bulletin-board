import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styles from "./Auth.module.css";
import { updateUserProfile } from "../features/userSlice";
import { auth, provider, storage } from "../firebase/firebase";
import {
  IconButton,
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Grid,
  Typography,
  makeStyles,
  Container,
  Box,
  Modal,
} from "@material-ui/core";

import LockOpenOutlinedIcon from "@material-ui/icons/LockOpenOutlined";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import SendIcon from "@material-ui/icons/Send";
import CancelScheduleSendIcon from "@material-ui/icons/CancelScheduleSend";

const getModalStyles = () => {
  const top = 40;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${left}%, -${top}%)`,
  };
};

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
  modal: {
    outline: "none",
    position: "absolute",
    backgroundColor: "#fff",
    width: 400,
    textAlign: "center",
    borderRadius: 10,
    padding: theme.spacing(3, 4),
  },
}));

const Auth: React.FC = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [avatarImage, setAvatarImage] = useState<File | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const sendResetEmail = async (e: React.MouseEvent<HTMLElement>) => {
    await auth
      .sendPasswordResetEmail(resetEmail)
      .then(() => {
        setOpenModal(false);
        setResetEmail("");
      })
      .catch((err) => {
        alert(err.message);
        setResetEmail("");
      });
  };

  const onChangeImageHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files![0]) {
      setAvatarImage(e.target.files![0]);
      e.target.value = "";
    }
  };

  const signInEmail = async () => {
    await auth.signInWithEmailAndPassword(email, password);
  };

  const signUpEmail = async () => {
    const authUser = await auth.createUserWithEmailAndPassword(email, password);

    let url = "";
    if (avatarImage) {
      const S =
        "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      const N = 16;
      const randomChar = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join("");
      const fileName = randomChar + "_" + avatarImage.name;

      await storage.ref(`avatars/${fileName}`).put(avatarImage);
      url = await storage.ref("avatars").child(fileName).getDownloadURL();
    }

    await authUser.user?.updateProfile({
      displayName: username,
      photoURL: url,
    });

    dispatch(
      updateUserProfile({
        displayName: username,
        photoUrl: url,
      })
    );
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
          {isLogin ? "ログイン" : "サインアップ"}
        </Typography>
        <form className={classes.form} noValidate>
          {!isLogin && (
            <>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setUsername(e.target.value)
                }
              />
              <Box textAlign="center">
                <IconButton>
                  <label>
                    <AccountCircleIcon
                      fontSize="large"
                      className={
                        !avatarImage
                          ? styles.signIn_addIcon
                          : styles.signIn_addIconLoaded
                      }
                    />
                    <input
                      type="file"
                      className={styles.signIn_hiddenIcon}
                      onChange={onChangeImageHandler}
                    />
                  </label>
                </IconButton>
              </Box>
            </>
          )}
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            id="email"
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
            disabled={
              isLogin
                ? !email || password.length < 6
                : !username || !avatarImage || !email || password.length < 6
            }
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={
              isLogin
                ? async () => {
                    try {
                      await signInEmail();
                    } catch (err) {
                      alert(
                        "サインインに失敗しました。メールアドレスもしくはパスワードに誤りがないか確認してください。"
                      );
                    }
                  }
                : async () => {
                    try {
                      await signUpEmail();
                    } catch (err) {
                      alert(err.message);
                    }
                  }
            }
          >
            {isLogin ? "ログイン" : "アカウント新規作成"}
          </Button>
          <Grid container>
            <Grid item xs>
              <Box className={styles.auth_box}>
                <span
                  className={styles.auth_forgotPass}
                  onClick={() => setOpenModal(true)}
                >
                  パスワードを忘れた方はこちら
                </span>
              </Box>
            </Grid>
            <Grid item>
              <span
                onClick={() => setIsLogin(!isLogin)}
                className={styles.auth_switching}
              >
                {isLogin ? "アカウントを新規作成" : "ログイン画面へ"}
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
            Googleでログイン
          </Button>
        </form>
        <Modal open={openModal} onClose={() => setOpenModal(false)}>
          <div style={getModalStyles()} className={classes.modal}>
            <div>
              <p>リセットしたいメールアドレスを入力してください。</p>
              <TextField
                type="email"
                name="email"
                value={resetEmail}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setResetEmail(e.target.value)
                }
              />
              {resetEmail ? (
                <IconButton onClick={sendResetEmail}>
                  <SendIcon />
                </IconButton>
              ) : (
                <IconButton>
                  <CancelScheduleSendIcon />
                </IconButton>
              )}
            </div>
          </div>
        </Modal>
      </div>
    </Container>
  );
};

export default Auth;
