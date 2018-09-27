import React, { Component } from 'react'
import firebase from 'firebase/app'
import 'firebase/database'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SyncLoader } from 'react-spinners'
import axios from 'axios'

// Actions
import { setUser } from '../../store/actions/user'

// Styles
import './styles.scss'

// Images
import google from '../../assets/images/google-sign-in.png'

// Icons
import icon from '../../assets/icons/carwash-icon--black.svg'
import logo from '../../assets/images/envoy.png'

const FIREBASE_DATABASE = firebase.database()
const url = process.env.NODE_ENV === 'production' ? 'https://envoycarwash-server.herokuapp.com' : 'https://envoycarwash-server.herokuapp.com'
const ns = 'auth-page'
class AuthPage extends Component {
  provider = null
  unsubscribe = this.props.FIREBASE_APP.auth().onAuthStateChanged(() => {})

  state = {
    loading: true
  }

  componentDidMount() {
    let self = this

    FIREBASE_DATABASE.ref('admins/')
      .once('value')
      .then(snapshot => {
        return snapshot.val()
      })
      .then(admins => {
        self.authStateChanged(admins)
      })

    this.provider = new firebase.auth.GoogleAuthProvider()
    this.provider.setCustomParameters({
      login_hint: 'user@weareenvoy.com',
      hd: 'weareenvoy.com',
      prompt: 'select_account'
    })

    setTimeout(() => {
      // eslint-disable-next-line
      this.state.loading = false
    }, 50)
  }

  authStateChanged(admins) {
    let self = this

    this.props.FIREBASE_APP.auth().onAuthStateChanged(user => {
      if (user) {
        const d1 = new Date()
        const d2 = new Date(user.metadata.lastSignInTime)
        const daysDiff = this.numDaysBetween(d1, d2)

        if (daysDiff > 14) {
          firebase.auth().signOut()
          self.props.history.push('/auth')
        } else {
          const userData = user

          this.props.USERS_REF.orderByChild('uid')
            .equalTo(user.uid)
            .once('value', snapshot => {
              if (snapshot.val() === null) {
                // If the users profile doesn't exist lets define it in the DB
                this.props.USERS_REF.child(userData.uid).set({
                  provider: userData.providerData[0],
                  uid: userData.uid,
                  make: '',
                  model: ''
                })
              }
            })

          if (admins.find(admin => admin.email === user.email)) {
            axios
              .post(
                `${url}/setCustomClaims`,
                {
                  uid: user.uid
                },
                {
                  crossdomain: true
                }
              )
              .then(res => {
                console.log(res)
              })
              .catch(err => {
                console.error(err)
              })
          }

          self.props.history.push('/')
          self.props.setUser()
          localStorage.setItem('user', JSON.stringify(user.providerData[0]))
          localStorage.setItem('uid', user.providerData[0].uid)
        }
      } else {
        self.props.history.push('/auth')
      }

      // eslint-disable-next-line
      self.state.loading = false
      self.setState({
        loading: false
      })
      self.unsubscribe()
    })
  }

  numDaysBetween(d1, d2) {
    let diff = Math.abs(d1.getTime() - d2.getTime())

    return diff / (1000 * 60 * 60 * 24)
  }

  componentWillUnmount() {
    this.unsubscribe()
  }

  signIn() {
    this.setState({
      loading: true
    })

    this.props.FIREBASE_APP.auth().signInWithRedirect(this.provider)
  }

  render() {
    if (this.state.loading) {
      return (
        <span className="loader__container">
          <SyncLoader color="#df5a4c;" />
        </span>
      )
    }

    return (
      <div className={`${ns}`}>
        <h3 className={`${ns}__title`}>
          <img className={`${ns}__logo`} src={logo} alt="Logo" /> <img className={`${ns}__icon`} src={icon} alt="Icon" />
        </h3>

        <p className={`${ns}__message`}>
          Please sign in using your <span className="orange">username@weareenvoy.com</span> account
        </p>

        <img className={`${ns}__image`} onClick={this.signIn.bind(this)} src={google} alt="Google Sign-In" />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    FIREBASE_APP: state.firebase.FIREBASE_APP,
    USERS_REF: state.firebase.USERS_REF
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUser
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage)
