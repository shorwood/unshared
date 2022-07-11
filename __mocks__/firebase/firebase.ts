/* eslint-disable unicorn/prevent-abbreviations */
import { initializeApp } from 'firebase/app'
import { connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore'
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions'

// --- Initialize Firesbase
export const app = initializeApp({
  projectId: 'test',
  apiKey: 'test',
  authDomain: 'test',
  databaseURL: 'test',
  storageBucket: 'test',
})

// --- Initialize Firebase
export const firestore = initializeFirestore(app, {})
export const firestoreData: Record<string, Record<string, any>> = {}

// --- Connect emulators
connectFirestoreEmulator(firestore, 'localhost', 15004)
connectFunctionsEmulator(getFunctions(app), 'localhost', 15004)
