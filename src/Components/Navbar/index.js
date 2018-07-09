import React, { Component } from 'react'
import firebase from 'firebase/app'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'

// Styles
import './styles.scss'

// Components
import Menu from '../Menu'

// SVGs
import logo from '../../assets/icons/carwash-icon--black.svg'

const ns = 'navbar'

class Navbar extends Component {
  state = {
    showMenu: false
  }

  signOut() {
    firebase.auth().signOut()

    this.props.history.push('/')
    localStorage.removeItem('user')
    localStorage.removeItem('uid')
    this.props.clearUser()
  }

  toggleMenu() {
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
                <img className={`${ns}__image`} src={currentUser.photoURL} alt="Profile" />

                <button className="button primary" onClick={this.signOut.bind(this)}>
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
