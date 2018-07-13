/*
 * Usage:
 *
  isAdmin().then(res => {
    // res = true || false
  })
 *
*/

import firebase from 'firebase/app'
import 'firebase/auth'

const FIREBASE_AUTH = firebase.auth()

export default function isAdmin() {
  return FIREBASE_AUTH.currentUser
    .getIdTokenResult()
    .then(idTokenResult => {
      // Confirm the user is an Admin.
      if (!!idTokenResult.claims.admin) {
        // user is an admin
        return true
      } else {
        // user is not an admin
        return false
      }
    })
    .catch(error => {
      console.error(error)
    })
}
