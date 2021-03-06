import React, { PureComponent } from 'react'
import firebase from 'firebase/app' // eslint-disable-line
import 'firebase/auth'
import 'firebase/messaging'
import 'firebase/database'
import { SyncLoader } from 'react-spinners'
import { alert } from 'notie'

// Styles
import './styles.scss'

const FIREBASE_AUTH = firebase.auth()
const FIREBASE_DATABASE = firebase.database()

let FIREBASE_MESSAGING

if ('serviceWorker' in navigator && 'PushManager' in window) {
  FIREBASE_MESSAGING = firebase.messaging()
}

const ns = 'notifications'
class Notifications extends PureComponent {
  state = {
    showSubscribe: true,
    showUnsubscribe: false,
    loading: true
  }

  componentDidMount() {
    const self = this

    FIREBASE_AUTH.onAuthStateChanged(user => {
      if (user) {
        self.checkSubscription()
      }
    })

    if (this.checkSupport()) {
      FIREBASE_MESSAGING.onTokenRefresh(this.handleTokenRefresh)
    }
  }

  handleTokenRefresh() {
    return FIREBASE_MESSAGING.getToken().then(token => {
      FIREBASE_DATABASE.ref('/tokens').push({
        token: token,
        uid: FIREBASE_AUTH.currentUser.uid,
        email: FIREBASE_AUTH.currentUser.email
      })
    })
  }

  checkSubscription() {
    let self = this

    FIREBASE_DATABASE.ref('/tokens')
      .orderByChild('uid')
      .equalTo(FIREBASE_AUTH.currentUser.uid)
      .once('value')
      .then(snapshot => {
        if (snapshot.val()) {
          self.setState({
            showSubscribe: false,
            showUnsubscribe: true,
            loading: false
          })
        } else {
          self.setState({
            showSubscribe: true,
            showUnsubscribe: false,
            loading: false
          })
        }
      })
  }

  subscribeToNotifications() {
    const self = this

    FIREBASE_MESSAGING.requestPermission()
      .then(() => self.handleTokenRefresh())
      .then(() => {
        self.checkSubscription()

        alert({
          type: 'success',
          text: 'You are subscribed'
        })
      })
      .catch(err => {
        console.info('The user denied notification permissions.')
      })
  }

  unsubscribeFromNotifications() {
    const self = this

    FIREBASE_MESSAGING.getToken()
      .then(token => FIREBASE_MESSAGING.deleteToken(token))
      .then(() =>
        FIREBASE_DATABASE.ref('/tokens')
          .orderByChild('uid')
          .equalTo(FIREBASE_AUTH.currentUser.uid)
          .once('value')
      )
      .then(snapshot => {
        const key = Object.keys(snapshot.val())[0]
        return FIREBASE_DATABASE.ref('/tokens')
          .child(key)
          .remove()
      })
      .then(() => {
        self.checkSubscription()
        alert({
          type: 'success',
          text: 'You are unsubscribed'
        })
      })
      .catch(err => {
        console.error('Error deleting token.')
      })
  }

  checkSupport() {
    if (!('serviceWorker' in navigator)) {
      // Service Worker isn't supported on this browser, disable or hide UI.
      return false
    }

    if (!('PushManager' in window)) {
      // Push isn't supported on this browser, disable or hide UI.
      return false
    }

    return true
  }

  render() {
    if (this.state.loading) {
      return (
        <span className="loader__container">
          <SyncLoader color="#df5a4c;" />
        </span>
      )
    }

    if (this.checkSupport()) {
      return (
        <div className={`${ns}`}>
          <h3>Notifications</h3>

          {this.state.showSubscribe && (
            <p>Click the subscribe button to receive to push notifications that will notify you when the Admin has created a new carwash signup.</p>
          )}

          {this.state.showUnsubscribe && <p>Click the unsubscribe button to stop receiving push notifications about new active carwashes.</p>}

          <div className={`${ns}__container`}>
            {this.state.showSubscribe && (
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this.subscribeToNotifications.bind(this)}>
                Subscribe
              </button>
            )}

            {this.state.showUnsubscribe && (
              <button
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                onClick={this.unsubscribeFromNotifications.bind(this)}
              >
                Unsubscribe
              </button>
            )}
          </div>
        </div>
      )
    } else {
      return (
        <div className={`${ns}`}>
          <h4>Notifications</h4>
          <p>Push notifications are not supported on this device.</p>
        </div>
      )
    }
  }
}

export default Notifications
