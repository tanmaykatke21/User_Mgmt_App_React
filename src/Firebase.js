import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAFkitz3ISzVCihFQr2td5pfexkGfl6erY",
  authDomain: "re-fb-userprofile-app.firebaseapp.com",
  databaseURL: "https://re-fb-userprofile-app-default-rtdb.firebaseio.com",
  projectId: "re-fb-userprofile-app",
  storageBucket: "re-fb-userprofile-app.appspot.com",
  messagingSenderId: "781779070701",
  appId: "1:781779070701:web:c82125272b07639d1826e4"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

export default app;

