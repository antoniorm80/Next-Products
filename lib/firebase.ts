import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { getFirestore, setDoc, doc, serverTimestamp, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, uploadString, getDownloadURL, ref} from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDeM_yujHa1nMNWTJHVeookFJs6fHb54Uw",
  authDomain: "koliseum-dbcce.firebaseapp.com",
  databaseURL: "https://koliseum-dbcce-default-rtdb.firebaseio.com",
  projectId: "koliseum-dbcce",
  storageBucket: "koliseum-dbcce.appspot.com",
  messagingSenderId: "31045826639",
  appId: "1:31045826639:web:76582c9991c7d2a919523a"
};


const app = initializeApp(firebaseConfig);

export default app;

export const auth = getAuth(app); // Authenticación
export const db = getFirestore(app);  // Base de Datos
export const storage = getStorage(app);  // Storage

// AUTH FUNCTIONS
// ===== Create user with email and password =====
export const createUser = async (user: { email: string, password: string}) => {
  return await createUserWithEmailAndPassword(auth, user.email, user.password);
}

// ===== Sign in with email and password =====
export const singIn = async (user: { email: string, password: string}) => {
    return await signInWithEmailAndPassword(auth, user.email, user.password);
}

// ===== Update user's displayName and PhotoUrl =====
export const updateUser = ( user: {displayName?: string | null | undefined; photoURL?: string | null | undefined; }) => {
  if( auth.currentUser) return updateProfile(auth.currentUser, user)
}


// ===== Sign Out =====
export const sendResetEmail = (email: string) =>{
   return sendPasswordResetEmail(auth, email);
}

// ===== Sign Out =====
export const signOutAccount = () =>{
  localStorage.removeItem('user');
  return auth.signOut();
}

// DATABASE FUNCTIONS
// ===== Get a document from a collection =====
export const getDocument = async (path: string) => {  
  return (await getDoc(doc(db, path))).data();
}

// ===== Set a document in a collection =====
export const setDocument = (path: string, data: any) => {
  data.createdAt = serverTimestamp();  
  return setDoc(doc(db, path), data);
}

// ===== Update a document in a collection =====
export const updateDocument = (path: string, data: any) => {
  return updateDoc(doc(db, path), data);
}

// STORAGE FUNCTIONS
// ===== Upload a file with base64 format and get the usl =====
export const uploadBase64 = async (path: string, base64: string) => {
  return uploadString(ref(storage, path), base64, 'data_url').then(() => {
    return getDownloadURL(ref(storage, path))
  })
}
