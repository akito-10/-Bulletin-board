import firebase from "firebase/app";
import firebaseConfig from "./firebase.config";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

const firebaseApp = firebase.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const db = firebase.firestore();
export const storage = firebase.storage();
export const provider = new firebase.auth.GoogleAuthProvider();
