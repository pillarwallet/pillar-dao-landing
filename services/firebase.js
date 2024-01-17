import { initializeApp } from 'firebase/app';

export const firebaseConfig = {
  apiKey: 'AIzaSyCA-lOBgeftaLQ_BFHf20EHe2LSqJdHK_Y',
  authDomain: 'plr-staking.firebaseapp.com',
  projectId: 'plr-staking',
  storageBucket: 'plr-staking.appspot.com',
  messagingSenderId: '201886948344',
  appId: '1:201886948344:web:0ac9d1449287e4e48dd40d',
  measurementId: 'G-X42Z5NHECZ',
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
