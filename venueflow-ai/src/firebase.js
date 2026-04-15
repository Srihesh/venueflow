import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAMuBAMvx0ruB_no7IU3_5or9DN10d_cuk",
  authDomain: "gen-lang-client-0461420567.firebaseapp.com",
  databaseURL: "https://gen-lang-client-0461420567-default-rtdb.firebaseio.com",
  projectId: "gen-lang-client-0461420567",
  storageBucket: "gen-lang-client-0461420567.firebasestorage.app",
  messagingSenderId: "89333699532",
  appId: "1:89333470532:web:2491c0bc8fbfd4d35b8369"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
