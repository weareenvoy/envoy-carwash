import React, { PureComponent } from 'react'
import firebase from 'firebase/app' // eslint-disable-line
import 'firebase/auth'

// Styles
import './styles.scss'
import DialogSignup from '../DialogSignup'

const FIREBASE_AUTH = firebase.auth()
const ns = 'new-signups'
class NewSignups extends PureComponent {
  state = {
    make: null,
    model: null,
    userUid: null,
    showDialog: false
  }

  componentDidMount() {
    const self = this
    const { USERS_REF } = this.props

    FIREBASE_AUTH.onAuthStateChanged(user => {
      if (user) {
        self.setState({
          userUid: user.uid
        })

        USERS_REF.orderByChild('uid')
          .equalTo(user.uid)
          .on('value', snapshot => {
            if (snapshot.val() !== null) {
              let obj = snapshot.val()

              self.setState({
                make: obj[Object.keys(obj)[0]].make,
                model: obj[Object.keys(obj)[0]].model
              })
            }
          })
      }
    })
  }

  signup(e, make, model) {
    e.preventDefault()
    // const self = this
    const { signup, USERS_REF } = this.props

    if ((this.state.make && this.state.model) || (make && model)) {
      let makeParam = this.state.make || make
      let modelParam = this.state.model || model

      signup(e, makeParam, modelParam)

      USERS_REF.child(this.state.userUid).update({
        make: makeParam,
        model: modelParam
      })

      this.setState({
        showDialog: false
      })
    } else {
      this.setState({
        showDialog: true
      })
    }
  }

  render() {
    const {
      carwash: { numberOfReservations },
      counter
    } = this.props

    const limit = numberOfReservations - (counter + 1)
    let signupButtons = []

    for (let i = 0; i <= limit; i += 1) {
      signupButtons.push(
        <li className={`${ns}__signup`} key={i}>
          <div className={`${ns}__start`}>
            <p>Click the 'Reserve' button to reserve your spot.</p>
          </div>

          <div className={`${ns}__end`}>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this.signup.bind(this)}>
              Reserve
            </button>
          </div>
        </li>
      )
    }

    return (
      <React.Fragment>
        {signupButtons}

        {this.state.showDialog && (
          <DialogSignup
            open={this.state.showDialog}
            signup={this.signup.bind(this)}
            close={() => {
              this.setState({ showDialog: false })
            }}
            make={this.state.make}
            model={this.state.model}
          />
        )}
      </React.Fragment>
    )
  }
}

export default NewSignups
