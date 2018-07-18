import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'

// Styles
import './styles.scss'

const ns = 'active-carwashes'

class ActiveCarwashes extends Component {
  renderActiveCarwashes() {
    const { carwashes } = this.props
    let collection = []

    for (let key in carwashes) {
      const users = carwashes[key].users ? carwashes[key].users.length : 0

      if (carwashes[key].isActive) {
        collection.push(
          <div className={`${ns}__carwash`} key={carwashes[key].id}>
            <Link className={`${ns}__button mdl-button mdl-js-button mdl-button--raised mdl-button--colored`} to={`/carwash/${carwashes[key].id}`}>
              {carwashes[key].name}
            </Link>

            <h6 className="active-carwashes__remaining">{carwashes[key].numberOfReservations - users} Spots Remaining</h6>
          </div>
        )
      }
    }

    return collection
  }

  renderInactiveCarwashes() {
    const { carwashes } = this.props
    let collection = []

    for (let key in carwashes) {
      if (!carwashes[key].isActive) {
        collection.push(
          <div className={`${ns}__carwash disabled`} key={carwashes[key].id}>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">{carwashes[key].name}</button>
          </div>
        )
      }
    }

    return collection
  }

  render() {
    let emptyHtml = (
      <span>
        <h2 className={`${ns}__title`}>No Active Carwashes</h2>
        <p>Please check back soon, or subscribe to push updates in User Settings, or watch for notifications in the 'general-irvine' Slack channel</p>
      </span>
    )
    let html = <h2 className={`${ns}__title`}>Active Carwashes</h2>
    let hasInactives = this.renderInactiveCarwashes().length > 0 ? true : false

    if (this.props.activeCarwashesLoading) {
      return (
        <span style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <SyncLoader color="#df5a4c;" />
        </span>
      )
    }

    return (
      <div className={`${ns}`}>
        {this.props.empty ? emptyHtml : html}

        <div className={`${ns}__list`}>{this.renderActiveCarwashes()}</div>

        {hasInactives && (
          <span style={{ marginTop: '30px', display: 'block' }}>
            <h2>Inactive Carwashes</h2>
            <div className={`${ns}__list`}>{this.renderInactiveCarwashes()}</div>
          </span>
        )}
      </div>
    )
  }
}

export default ActiveCarwashes
