//https://cra.link/deployment
//https://my-own-app-940c4.web.app
import firebase from "firebase";
//import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDntAsU2ruPiE8rrIz7HYu2R-CKaIP8u2s",
    authDomain: "my-own-app-940c4.firebaseapp.com",
    projectId: "my-own-app-940c4",
    storageBucket: "my-own-app-940c4.appspot.com",
    messagingSenderId: "979750563713",
    appId: "1:979750563713:web:5fbd7905c0af7509f68280",
    measurementId: "G-4C1DT44CWZ"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db=firebaseApp.firestore();
  const auth=firebase.auth();
  
  export {db,auth};