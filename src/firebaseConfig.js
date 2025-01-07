import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDHCwFOL1b2oqXf890f3teA4blWfNLejJ0",
  authDomain: "myapp-3a874.firebaseapp.com",
  projectId: "myapp-3a874",
  storageBucket: "myapp-3a874.appspot.com",
  messagingSenderId: "430236087961",
  appId: "1:430236087961:web:d7b0e75c6cf2498c9b6a08",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };