import React, { Component } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import isAdmin from '../../utils/auth'

// Styles
import './styles.scss'

// Components
import Menu from '../Menu'

// SVGs
import logo from '../../assets/icons/carwash-icon--black.svg'

const FIREBASE_AUTH = firebase.auth()

const ns = 'navbar'
const emptyAvatar =
  'https://firebasestorage.googleapis.com/v0/b/envoy-carwash.appspot.com/o/empty-avatar.png?alt=media&token=b32ae978-0e72-41ff-ada6-e964e1a06f62'
class Navbar extends Component {
  state = {
    showMenu: false,
    isAdmin: false
  }

  componentDidMount() {
    let self = this

    FIREBASE_AUTH.onAuthStateChanged(user => {
      if (user) {
        isAdmin().then(res => {
          self.setState({
            isAdmin: res
          })
        })
      }
    })
  }

  signOut() {
    firebase.auth().signOut()
    this.props.history.push('/')
    localStorage.removeItem('user')
    localStorage.removeItem('uid')
    localStorage.removeItem('token')
    this.props.clearUser()
  }

  toggleMenu() {
    if (this.state.showMenu) {
      document.body.style.overflow = 'auto'
    } else {
      document.body.style.overflow = 'hidden'
    }

    this.setState({
      showMenu: !this.state.showMenu
    })
  }

  render() {
    const {
      user: { currentUser }
    } = this.props

    if (currentUser !== null) {
      return (
        <React.Fragment>
          <div className={`${ns}`}>
            <div className={`${ns}__container`}>
              <div className={`${ns}__start`}>
                <div className={`${ns}__toggle`} onClick={this.toggleMenu.bind(this)}>
                  <span className={`${ns}__line`} />
                  <span className={`${ns}__line`} />
                  <span className={`${ns}__line`} />
                </div>

                <Link to="/">
                  <img className={`${ns}__logo`} src={logo} alt="Logo" />
                </Link>
              </div>
              <div className={`${ns}__end`}>
                {this.state.isAdmin && <p className={`${ns}__admin-tag`}>Admin</p>}

                <img className={`${ns}__image`} src={currentUser.photoURL || emptyAvatar} alt="Avatar" />

                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this.signOut.bind(this)}>
                  Logout
                </button>
              </div>
            </div>
          </div>

          <Menu signOut={this.signOut.bind(this)} show={this.state.showMenu} toggleMenu={this.toggleMenu.bind(this)} />
        </React.Fragment>
      )
    }

    return null
  }
}

export default withRouter(Navbar)
