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

  componentDidMount() {
    const { carwashes } = this.props

    for (let key in carwashes) {
      this.sortable.push(carwashes[key])
    }

    this.carwashes = this.sortable.sort((a, b) => {
      return new Date(b.date) - new Date(a.date)
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

  renderActiveCarwashes() {
    return this.carwashes.map(carwash => {
      const users = carwash.users ? carwash.users.length : 0

      if (carwash.isActive) {
        return (
          <div className={`${ns}__card mdl-card mdl-shadow--2dp`} key={carwash.id}>
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
      } else {
        return (
          <div className={`${ns}__card mdl-card mdl-shadow--2dp`} key={carwash.id}>
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
    })
  }

  render() {
    if (this.props.activeCarwashesLoading) {
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
