import firebase from 'firebase/app'
import 'firebase/database'

const FIREBASE_APP = firebase.initializeApp({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
})

const FIREBASE_DATABASE = FIREBASE_APP.database()
const CARWASH_REF = FIREBASE_DATABASE.ref('flamelink/environments/production/content/carwash/en-US')

const initial = {
  FIREBASE_APP,
  CARWASH_REF
}

export default function carousel(state = initial, action) {
  switch (action.type) {
    default:
      return state
  }
}
