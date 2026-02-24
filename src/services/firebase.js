import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA0G0aOH1ZaJN2_egdFfVuAl5aUGpjX_vI",
  authDomain: "textrack-6baff.firebaseapp.com",
  projectId: "textrack-6baff",
  storageBucket: "textrack-6baff.appspot.com", // ✅ corrected
  messagingSenderId: "994751161137",
  appId: "1:994751161137:web:aeef5d52a165c6b9060610"
};

const app = initializeApp(firebaseConfig);

// 🔐 Authentication
export const auth = getAuth(app);

// 🗄 Firestore Database
export const db = getFirestore(app);

// 🖼 Firebase Storage (for fabric images)
export const storage = getStorage(app);

// 🕒 Timestamp Helper
export { serverTimestamp };