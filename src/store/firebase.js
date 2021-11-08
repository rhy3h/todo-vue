import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

initializeApp({
  apiKey: "AIzaSyCzxW34OXu2ih50id17Sk8eW9q74LXfRek",
  authDomain: "rhy3h-todo.firebaseapp.com",
  projectId: "rhy3h-todo",
  storageBucket: "rhy3h-todo.appspot.com",
  messagingSenderId: "272800578848",
  appId: "1:272800578848:web:1c29aba5dc80327faa6b45",
  measurementId: "G-CDCRZV97Q4"
});

const db = getFirestore();

export default db;