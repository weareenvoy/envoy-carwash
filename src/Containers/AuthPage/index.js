import React, { Component } from 'react'
import firebase from 'firebase/app'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SyncLoader } from 'react-spinners'

// Actions
import { setUser } from '../../store/actions/user'

// Styles
import './styles.scss'

// Images
import google from '../../assets/google.png'

// Icons
import icon from '../../assets/icons/carwash-icon--black.svg'
import logo from '../../assets/envoy.png'

const ns = 'auth-page'

class AuthPage extends Component {
  provider = null
  unsubscribe = this.props.FIREBASE_APP.auth().onAuthStateChanged(() => {})

  state = {
    loading: true
  }

  componentDidMount() {
    let self = this

    this.props.FIREBASE_APP.auth().onAuthStateChanged(user => {
      if (user) {
        self.props.history.push('/')
        localStorage.setItem('user', JSON.stringify(user.providerData[0]))
        localStorage.setItem('uid', user.uid)
        this.props.setUser()
      } else {
        self.props.history.push('/auth')
      }

      this.state.loading = false
      self.unsubscribe()
    })

    this.provider = new firebase.auth.GoogleAuthProvider()
    this.provider.setCustomParameters({
      login_hint: 'user@weareenvoy.com',
      hd: 'weareenvoy.com',
      prompt: 'select_account'
    })

    this.state.loading = false
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
        <span style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
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
    FIREBASE_APP: state.firebase.FIREBASE_APP
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
