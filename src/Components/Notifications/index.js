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
const FIREBASE_MESSAGING = firebase.messaging()
const FIREBASE_DATABASE = firebase.database()

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

    FIREBASE_MESSAGING.onTokenRefresh(this.handleTokenRefresh)
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

  render() {
    if (this.state.loading) {
      return (
        <span style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <SyncLoader color="#df5a4c;" />
        </span>
      )
    }

    return (
      <div className={`${ns}`}>
        <h3>Notifications</h3>

        {this.state.showSubscribe && (
          <p>Click the subscribe button to receive to push notifications that will notify you when the Admin has created a new carwash signup.</p>
        )}

        {this.state.showUnsubscribe && <p>Click the unsubscribe button to stop receiving push notifications about new active carwashes.</p>}

        <div className={`${ns}__container`}>
          {this.state.showSubscribe && (
            <button className="button primary" onClick={this.subscribeToNotifications.bind(this)}>
              Subscribe
            </button>
          )}

          {this.state.showUnsubscribe && (
            <button className="button primary" onClick={this.unsubscribeFromNotifications.bind(this)}>
              Unsubscribe
            </button>
          )}
        </div>
      </div>
    )
  }
}

export default Notifications
