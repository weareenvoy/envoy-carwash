import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'
import formatDate from '../../utils/date'

// Styles
import './styles.scss'

const ns = 'active-carwashes'

class ActiveCarwashes extends PureComponent {
  sortable = []
  carwashes = []

  state = {
    daysLimit: 14,
    componentLoaded: false
  }

  componentDidMount() {
    let self = this
    const { carwashes } = this.props

    for (let key in carwashes) {
      this.sortable.push(carwashes[key])
    }

    this.carwashes = this.sortable.sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })

    this.props.flamelink.app.content.get('appSettings').then(settings => {
      if (settings !== null && settings.activeCarwashDays !== null && settings.activeCarwashDays !== undefined) {
        self.setState({
          ...self.state,
          daysLimit: settings.activeCarwashDays,
          componentLoaded: true
        })
      }
    })
  }

  componentDidUpdate() {
    const { carwashes } = this.props

    for (let key in carwashes) {
      this.sortable.push(carwashes[key])
    }

    this.carwashes = this.sortable.sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
    })
  }

  numDaysBetween(d1, d2) {
    // If d2 is in the future it's active
    if (d1 < d2) return true

    let diff = Math.abs(d1.getTime() - d2.getTime())

    return diff / (1000 * 60 * 60 * 24)
  }

  renderActiveCarwashes() {
    return this.carwashes.map((carwash, i) => {
      const users = carwash.users ? carwash.users.length : 0
      const d1 = new Date()
      const d2 = new Date(carwash.date)
      let daysDifference = this.numDaysBetween(d1, d2)
      let check = daysDifference <= this.state.daysLimit

      if (typeof daysDifference === 'boolean') {
        check = daysDifference
      }

      if (carwash.isActive && check) {
        return (
          <div className={`${ns}__card mdl-card mdl-shadow--2dp`} key={i}>
            <div className="mdl-card__title">
              <h2 className="mdl-card__title-text" style={{ color: 'white', position: 'absolute', top: '10px' }}>
                {formatDate(carwash.date)}
              </h2>
            </div>
            <div className="mdl-card__supporting-text">{carwash.numberOfReservations - users} Spots Remaining</div>
            <div className="mdl-card__actions mdl-card--border">
              <Link to={`/carwash/${carwash.id}`} className="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect">
                Get Started
              </Link>
            </div>
            <div className="mdl-card__menu" />
          </div>
        )
      } else if (daysDifference <= check) {
        return (
          <div className={`${ns}__card mdl-card mdl-shadow--2dp`} key={i}>
            <div className="mdl-card__title mdl-card__title--inactive">
              <h2 className="mdl-card__title-text" style={{ color: '#2c3e50', position: 'absolute', top: '10px' }}>
                {formatDate(carwash.date)}
              </h2>
            </div>
            <div className="mdl-card__supporting-text">Inactive</div>
            <div className="mdl-card__actions mdl-card--border">
              <a style={{ visibility: 'hidden' }}>Get Started</a>
            </div>
            <div className="mdl-card__menu" />
          </div>
        )
      }

      return null
    })
  }

  render() {
    if (this.props.activeCarwashesLoading && !this.state.componentLoaded) {
      return (
        <span className="loader__container">
          <SyncLoader color="#df5a4c;" />
        </span>
      )
    }

    return (
      <div className={`${ns}`}>
        <h2 className={`${ns}__title`}>{this.carwashes.length <= 1 ? 'Carwash Signup' : 'Carwash Signups'}</h2>
        <div className={`${ns}__list`}>{this.renderActiveCarwashes()}</div>
      </div>
    )
  }
}

export default ActiveCarwashes
