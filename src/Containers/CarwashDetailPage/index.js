import React, { Component } from 'react'
import { connect } from 'react-redux'
import { SyncLoader } from 'react-spinners'
import { Link } from 'react-router-dom'
import { alert, confirm } from 'notie'
import formatDate from '../../utils/date'

// Styles
import './styles.scss'

// Components
import Dialog from '../../Components/Dialog'
import CurrentSignups from '../../Components/CurrentSignups'
import NewSignups from '../../Components/NewSignups'

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
        if (carwash == null) return

        self.setState({
          carwash,
          users: carwash !== null && carwash.users ? carwash.users : []
        })
      })
      .catch(error => console.error(error))

    // Subscribe to changes and update the UI after a change from the admin
    this.props.flamelink.app.content.subscribe('carwash', id, (error, carwash) => {
      if (error) {
        console.error(error)
      }

      if (carwash == null) return

      let counter = 0

      if (carwash !== null && carwash.users && carwash.users.length) {
        carwash.users.forEach(el => {
          counter += 1
        })
      }

      self.setState({
        carwash,
        users: carwash !== null && carwash.users ? carwash.users : [],
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

  signup(e, make, model) {
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
            photoURL: currentUser.photoURL,
            carMake: make,
            carModel: model
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
      text: 'Are you sure you would like to cancel your reservation?',
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

  render() {
    const {
      currentUser: { currentUser },
      match: {
        params: { id }
      }
    } = this.props

    if (this.state.carwash) {
      return (
        <div className={`${ns} padding`}>
          <Dialog show={this.state.carwash.message.length > 0} message={this.state.carwash.message} title={`Message From The Admin`} />

          <div className={`${ns}__container`}>
            <div className={`${ns}__top`}>
              <h2 className={`${ns}__title`}>
                Carwash for - <span className="orange">{formatDate(this.state.carwash.date)}</span>
              </h2>
              <Link className="mdl-button mdl-js-button mdl-button--primary" to="/">
                Go Back
              </Link>
            </div>

            {this.state.carwash.users && (
              <ul className={`${ns}__current-signups`}>
                <CurrentSignups
                  currentUser={currentUser}
                  id={id}
                  carwash={this.state.carwash}
                  cancel={this.cancel.bind(this)}
                  CARWASH_REF={this.props.CARWASH_REF}
                />
              </ul>
            )}

            <ul className={`${ns}__new-signups`}>
              <NewSignups
                counter={this.state.counter}
                carwash={this.state.carwash}
                signup={this.signup.bind(this)}
                USERS_REF={this.props.USERS_REF}
              />
            </ul>
          </div>
        </div>
      )
    }

    return (
      <span className="loader__container">
        <SyncLoader color="#df5a4c;" />
      </span>
    )
  }
}

function mapStateToProps(state) {
  return {
    flamelink: state.flamelink,
    CARWASH_REF: state.firebase.CARWASH_REF,
    USERS_REF: state.firebase.USERS_REF,
    currentUser: state.user
  }
}

export default connect(mapStateToProps)(CarwashDetailPage)
