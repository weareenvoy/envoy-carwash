import firebase from 'firebase/app'
import 'firebase/database'

const FIREBASE_APP =
  process.env.NODE_ENV === 'production'
    ? firebase.initializeApp({
        apiKey: 'AIzaSyA76pnK5rRw5esOJ-H42OekC5RMbEj3T6c',
        authDomain: 'envoy-carwash.firebaseapp.com',
        databaseURL: 'https://envoy-carwash.firebaseio.com',
        projectId: 'envoy-carwash',
        storageBucket: 'envoy-carwash.appspot.com',
        messagingSenderId: '395703945812'
      })
    : firebase.initializeApp({
        apiKey: 'AIzaSyBbpaPrnsVqasKeJldGjD9LY2zEYB2cWBU',
        authDomain: 'envoy-carwash-testing.firebaseapp.com',
        databaseURL: 'https://envoy-carwash-testing.firebaseio.com',
        projectId: 'envoy-carwash-testing',
        storageBucket: 'envoy-carwash-testing.appspot.com',
        messagingSenderId: '326149789481'
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
