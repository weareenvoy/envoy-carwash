import React, { PureComponent } from 'react'
import firebase from 'firebase/app' // eslint-disable-line
import 'firebase/auth'

// Styles
import './styles.scss'

const FIREBASE_AUTH = firebase.auth()
const ns = 'user-information'

class UserInformation extends PureComponent {
  state = {
    make: null,
    model: null,
    showForm: false,
    userUid: null
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

  toggleForm(e) {
    if (e) e.preventDefault()

    this.setState({
      showForm: !this.state.showForm
    })
  }

  updateUser(e) {
    e.preventDefault()
    const self = this
    const { USERS_REF } = this.props

    USERS_REF.child(this.state.userUid).update({
      make: self.state.make,
      model: self.state.model
    })

    this.toggleForm()
  }

  render() {
    return (
      <div className={`${ns}`}>
        <div className={`${ns}__container`}>
          <h3 className={`${ns}__title`}>User Information</h3>

          {!this.state.showForm && (
            <React.Fragment>
              <ul className="demo-list-item mdl-list">
                <li className={`${ns}__item mdl-list__item`}>
                  <h6>Car Make: </h6>
                  <p className="">{this.state.make ? this.state.make : ''}</p>
                </li>

                <li className={`${ns}__item mdl-list__item`}>
                  <h6>Car Model: </h6>
                  <p className="">{this.state.model ? this.state.model : ''}</p>
                </li>
              </ul>

              <button
                className={`${ns}__button mdl-button mdl-js-button mdl-button--raised mdl-button--colored`}
                onClick={this.toggleForm.bind(this)}
              >
                Update Info
              </button>
            </React.Fragment>
          )}

          {this.state.showForm && (
            <form id={`${ns}__form`} className={`${ns}__form`}>
              <div className={`${ns}__group mdl-textfield mdl-js-textfield`}>
                <input
                  className={`${ns}__input mdl-textfield__input`}
                  type="text"
                  id="make"
                  value={this.state.make}
                  onChange={e => {
                    this.setState({ make: e.target.value })
                  }}
                />
                <label className="mdl-textfield__label" htmlFor="make">
                  {this.state.make ? '' : 'Car Make'}
                </label>
              </div>

              <div className={`${ns}__group mdl-textfield mdl-js-textfield`}>
                <input
                  className={`${ns}__input mdl-textfield__input`}
                  type="text"
                  id="model"
                  value={this.state.model}
                  onChange={e => {
                    this.setState({ model: e.target.value })
                  }}
                />
                <label className="mdl-textfield__label" htmlFor="model">
                  {this.state.model ? '' : 'Car Model'}
                </label>
              </div>

              <div className={`${ns}__buttons`}>
                <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={this.updateUser.bind(this)}>
                  Save
                </button>

                <button
                  className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent"
                  onClick={() => {
                    this.setState({ showForm: false })
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    )
  }
}

export default UserInformation
