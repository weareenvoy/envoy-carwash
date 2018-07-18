import React, { PureComponent } from 'react'
import isAdmin from '../../utils/auth'
import firebase from 'firebase/app'
import 'firebase/auth'
import InlineSVG from 'svg-inline-react'

// Icons
import check from '../../assets/icons/check-button.js'
import x from '../../assets/icons/x-button.js'

// Styles
import './styles.scss'

const FIREBASE_AUTH = firebase.auth()

const ns = 'paid'
class Paid extends PureComponent {
  state = {
    showPaidInfo: false
  }

  componentDidMount() {
    let self = this

    FIREBASE_AUTH.onAuthStateChanged(user => {
      if (user) {
        self.adminCheck(user)
      }
    })
  }

  adminCheck(user) {
    let self = this

    isAdmin().then(res => {
      self.setState({
        showPaidInfo: res
      })
    })
  }

  toggleFix(el) {
    if (el) {
      window.componentHandler.upgradeElement(el)
    }
  }

  hasPaid() {
    if (this.props.user.hasPaid) {
      return (
        <span className={`${ns}__has-paid-icon`}>
          <InlineSVG src={check} />
        </span>
      )
    }

    return (
      <span className={`${ns}__has-paid-icon`}>
        <InlineSVG src={x} />
      </span>
    )
  }

  toggleHasPaid(user, i) {
    const { id } = this.props

    this.props.CARWASH_REF.child(`${id}/users/${i}/hasPaid`).set(!user.hasPaid)
  }

  render() {
    const { user, currentUser, i } = this.props

    return (
      <React.Fragment>
        {(this.state.showPaidInfo || user.uid === currentUser.uid) && <hr />}
        <div className={`${ns}`}>
          <div className={`${ns}__container`}>
            {(this.state.showPaidInfo || user.uid === currentUser.uid) && <p className={`${ns}__has-paid-text`}>Paid? {this.hasPaid(user)}</p>}

            {this.state.showPaidInfo && (
              <label
                className={
                  user.hasPaid ? 'mdl-switch mdl-js-switch mdl-js-ripple-effect is-checked' : 'mdl-switch mdl-js-switch mdl-js-ripple-effect'
                }
                htmlFor={`switch-${i}`}
                ref={c => {
                  this.toggleFix(c)
                }}
              >
                <input
                  type="checkbox"
                  id={`switch-${i}`}
                  className="mdl-switch__input"
                  onChange={() => {
                    this.toggleHasPaid(user, i)
                  }}
                  checked={user.hasPaid === true}
                  style={{ visibility: 'hidden' }}
                />
                <span className="mdl-switch__label" />
              </label>
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default Paid
