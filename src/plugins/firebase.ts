import { initializeApp } from "firebase/app";
import { getFirestore, QueryDocumentSnapshot } from "firebase/firestore";
import type { DocumentData, SnapshotOptions } from "firebase/firestore";
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BAKET,
  FIREBASE_MESSAGE_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from "../config";

/** Firebase Setting Info */
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BAKET,
  messagingSenderId: FIREBASE_MESSAGE_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

/** Firebase App */
export const firebaseApp = initializeApp(firebaseConfig);

/** Firebase Firestore */
export const firestore = getFirestore(firebaseApp);
export * from "firebase/firestore";

export type Converter<T> = {
  toFirestore(data: T): DocumentData;
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): T;
};
