import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import config from '../firebase_config';

firebase.initializeApp(config);

// Auth
export const auth = firebase.auth();
export const googleAuth = new firebase.auth.GoogleAuthProvider();

// Firestore
export const db = firebase.firestore();
