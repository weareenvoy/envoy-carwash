import flamelink from 'flamelink'

const app = flamelink({
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID
})

const initial = {
  app
}

export default function flamelinkReducer(state = initial, action) {
  switch (action.type) {
    default:
      return state
  }
}
