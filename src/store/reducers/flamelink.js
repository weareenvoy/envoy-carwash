import flamelink from 'flamelink'

const app =
  process.env.NODE_ENV === 'production'
    ? flamelink({
        apiKey: 'AIzaSyA76pnK5rRw5esOJ-H42OekC5RMbEj3T6c',
        authDomain: 'envoy-carwash.firebaseapp.com',
        databaseURL: 'https://envoy-carwash.firebaseio.com',
        projectId: 'envoy-carwash',
        storageBucket: 'envoy-carwash.appspot.com',
        messagingSenderId: '395703945812'
      })
    : flamelink({
        apiKey: 'AIzaSyBbpaPrnsVqasKeJldGjD9LY2zEYB2cWBU',
        authDomain: 'envoy-carwash-testing.firebaseapp.com',
        databaseURL: 'https://envoy-carwash-testing.firebaseio.com',
        projectId: 'envoy-carwash-testing',
        storageBucket: 'envoy-carwash-testing.appspot.com',
        messagingSenderId: '326149789481'
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
