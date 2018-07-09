import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { SyncLoader } from 'react-spinners'
import { Link } from 'react-router-dom'
import { alert, confirm } from 'notie'

// Styles
import './styles.scss'

// Components
import AddToCalendar from '../../Components/AddToCalendar'

const ns = 'carwash-detail-page'

class CarwashDetailPage extends Component {
  state = {
    carwash: null,
    users: [],
    counter: null
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

  cleanArray(actual) {
    var newArray = []
    for (var i = 0; i < actual.length; i += 1) {
      if (actual[i] && actual[i] !== null && actual[i] !== undefined) {
        newArray.push(actual[i])
      }
    }

    return newArray
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
        text: 'You have already signed up'
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
      currentUser: { currentUser }
    } = this.props

    return this.state.carwash.users.map(user => {
      return (
        <li className={`${ns}__user`} key={user.uniqueKey}>
          <div className={`${ns}__start`}>
            <div className={`${ns}__user-detail`}>
              <img className={`${ns}__profile-image`} alt="Profile Imaage" src={user.photoURL} style={{ width: '40px', borderRadius: '50%' }} />
              <h4 className={`${ns}__display-name`}>{user.displayName}</h4>
            </div>

            {user.uid === currentUser.uid && <AddToCalendar date={this.state.carwash.date} name={this.state.carwash.name} />}
          </div>

          <div className={`${ns}__end`}>
            {user.uid === currentUser.uid && (
              <button className="button secondary" onClick={this.cancel.bind(this)}>
                Cancel Reservation
              </button>
            )}
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
            <button className="button secondary" onClick={this.signup.bind(this)}>
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
        <div className={`${ns}`}>
          <div className={`${ns}__container`}>
            <div className={`${ns}__top`}>
              <h2>
                Carwash for - <span style={{ color: '#e05545' }}>{this.state.carwash.name}</span>
              </h2>
              <Link to="/">Go Back</Link>
            </div>

            <ul className={`${ns}__signups`}>{this.renderNewSignups()}</ul>

            {this.state.carwash.users && <ul className={`${ns}__user-list`}>{this.renderCurrentSignups()}</ul>}
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

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CarwashDetailPage)
