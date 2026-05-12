// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyAj3NMhn0FsbzLAdsu_Ix9dfNiTZern9NM",
  authDomain: "dichoho-4e879.firebaseapp.com",
  projectId: "dichoho-4e879",
  storageBucket: "dichoho-4e879.appspot.com",
  messagingSenderId: "445052486639",
  appId: "1:445052486639:web:632d75e80773eaf65eac1a",
  measurementId: "G-J22XGSQDCH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
