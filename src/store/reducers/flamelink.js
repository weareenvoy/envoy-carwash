import flamelink from 'flamelink'

const app = flamelink({
  apiKey: 'AIzaSyA76pnK5rRw5esOJ-H42OekC5RMbEj3T6c',
  authDomain: 'envoy-carwash.firebaseapp.com',
  databaseURL: 'https://envoy-carwash.firebaseio.com',
  projectId: 'envoy-carwash',
  storageBucket: 'envoy-carwash.appspot.com',
  messagingSenderId: '395703945812'
})

const initial = {
  app
}

export default function carousel(state = initial, action) {
  switch (action.type) {
    default:
      return state
  }
}
