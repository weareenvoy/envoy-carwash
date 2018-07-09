import { combineReducers } from 'redux'
import flamelink from './flamelink'
import firebase from './firebase'
import user from './user'

const rootReducer = combineReducers({
  flamelink,
  firebase,
  user
})

export default rootReducer
