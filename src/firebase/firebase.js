import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAbb-Pce_X1gy71JHb2hwt1i4qeksyGsxc",

  authDomain: "memory-app-893e7.firebaseapp.com",
  projectId: "memory-app-893e7",

  storageBucket: "memory-app-893e7.appspot.com",

  messagingSenderId: "10595475788",

  appId: "1:10595475788:web:97175bccb7d81fa6bd6fe9"

};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export default db;