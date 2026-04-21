import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDaTBm44nTXTmq42mcCLTFl4-U_R5WiA4M",
  authDomain: "condimentos-14349.firebaseapp.com",
  projectId: "condimentos-14349",
  storageBucket: "condimentos-14349.firebasestorage.app",
  messagingSenderId: "527718016052",
  appId: "1:527718016052:web:e0d50a62d89466d6345661"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);