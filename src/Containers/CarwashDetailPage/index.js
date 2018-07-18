import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SyncLoader } from 'react-spinners'
import { Link } from 'react-router-dom'
import { alert, confirm } from 'notie'

// Styles
import './styles.scss'

// Components
import AddToCalendar from '../../Components/AddToCalendar'
import Dialog from '../../Components/Dialog'
import Paid from '../../Components/Paid'

// Images
const emptyAvatar =
  'https://firebasestorage.googleapis.com/v0/b/envoy-carwash.appspot.com/o/empty-avatar.png?alt=media&token=b32ae978-0e72-41ff-ada6-e964e1a06f62'

const ns = 'carwash-detail-page'

class CarwashDetailPage extends Component {
  state = {
    carwash: null,
    users: [],
    counter: null
  }

  componentWillUnmount() {
    this.props.flamelink.app.content.unsubscribe('carwash')
  }

  componentDidMount() {
    const self = this
    const {
      match: {
        params: { id }
      }
    } = this.props

    // Get initial data on page load
    this.props.flamelink.app.content
      .get('carwash', id)
      .then(carwash => {
        self.setState({
          carwash,
          users: carwash.users ? carwash.users : []
        })
      })
      .catch(error => console.error(error))

    // Subscribe to changes and update the UI after a change from the admin
    this.props.flamelink.app.content.subscribe('carwash', id, (error, carwash) => {
      if (error) {
        console.error(error)
      }

      let counter = 0

      if (carwash.users && carwash.users.length) {
        carwash.users.forEach(el => {
          counter += 1
        })
      }

      self.setState({
        carwash,
        users: carwash.users ? carwash.users : [],
        counter
      })
    })
  }

  key() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1)
    }

    return s4() + s4()
  }

  hasSignedUp() {
    const {
      currentUser: { currentUser }
    } = this.props

    return this.state.users.some(user => {
      return user.uid === currentUser.uid
    })
  }

  signup(e) {
    e.preventDefault()
    const self = this

    if (!this.hasSignedUp()) {
      const {
        match: {
          params: { id }
        },
        currentUser: { currentUser }
      } = this.props
      const key = this.key()

      this.props.CARWASH_REF.child(`${id}/users`)
        .once('value')
        .then(data => {
          let users = data.val() || []

          users.push({
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            uniqueKey: key,
            photoURL: currentUser.photoURL
          })

          const cleanArray = users.filter(val => val !== undefined && val !== null)
          self.props.CARWASH_REF.child(`${id}/users`).set(cleanArray)
        })

      alert({
        type: 'success',
        text: 'Success!'
      })
    } else {
      alert({
        type: 'error',
        text: 'You can only reserve one spot'
      })
    }
  }

  cancel(e) {
    e.preventDefault()
    const self = this
    const {
      match: {
        params: { id }
      },
      currentUser: { currentUser }
    } = this.props

    confirm({
      text: 'Are you sure you would like to cancel?',
      cancelText: 'No',
      submitCallback: () => {
        const userIndex = self.state.users.findIndex((user, i) => {
          return user.uid === currentUser.uid
        })

        self.props.CARWASH_REF.child(`${id}/users/${userIndex}`).remove()
      },
      cancelCallback: () => {
        return null
      }
    })
  }

  renderCurrentSignups() {
    const {
      currentUser: { currentUser },
      match: {
        params: { id }
      }
    } = this.props

    return this.state.carwash.users.map((user, i) => {
      return (
        <li className={`${ns}__card`} key={i}>
          <div className={`${ns}__card-top`}>
            <div className={`${ns}__user-detail`}>
              <img
                className={`${ns}__profile-image`}
                alt="Avatar"
                src={user.photoURL || emptyAvatar}
                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
              />
              <h4 className={`${ns}__display-name`}>{user.displayName}</h4>

              {user.uid === currentUser.uid && <AddToCalendar date={this.state.carwash.date} name={this.state.carwash.name} />}
            </div>

            {user.uid === currentUser.uid && (
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={this.cancel.bind(this)}>
                Cancel Reservation
              </button>
            )}
          </div>

          <div className={`${ns}__card-bottom`}>
            <Paid user={user} currentUser={currentUser} i={i} CARWASH_REF={this.props.CARWASH_REF} id={id} />
          </div>
        </li>
      )
    })
  }

  renderNewSignups() {
    const { counter } = this.state
    const { numberOfReservations } = this.state.carwash

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

    return signupButtons
  }

  render() {
    if (this.state.carwash) {
      return (
        <div className={`${ns} padding`}>
          <Dialog show={this.state.carwash.message.length > 0} message={this.state.carwash.message} title={`Message From The Admin`} />

          <div className={`${ns}__container`}>
            <div className={`${ns}__top`}>
              <h2 className={`${ns}__title`}>
                Carwash for - <span style={{ color: '#e05545' }}>{this.state.carwash.name}</span>
              </h2>
              <Link className="mdl-button mdl-js-button mdl-button--primary" to="/">
                Go Back
              </Link>
            </div>

            {this.state.carwash.users && <ul className={`${ns}__user-list`}>{this.renderCurrentSignups()}</ul>}

            <ul className={`${ns}__signups`}>{this.renderNewSignups()}</ul>
          </div>
        </div>
      )
    }

    return (
      <span style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <SyncLoader color="#df5a4c;" />
      </span>
    )
  }
}

function mapStateToProps(state) {
  return {
    flamelink: state.flamelink,
    CARWASH_REF: state.firebase.CARWASH_REF,
    currentUser: state.user
  }
}

export default connect(mapStateToProps)(CarwashDetailPage)
