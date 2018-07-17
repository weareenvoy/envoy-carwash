import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { SyncLoader } from 'react-spinners'

// Styles
import './styles.scss'

const ns = 'active-carwashes'

class ActiveCarwashes extends Component {
  hasLoaded = false

  state = {
    loading: true
  }

  componentDidUpdate() {
    for (let prop in this.props.carwashes) {
      if (this.props.carwashes.hasOwnProperty(prop) && !this.hasLoaded) {
        this.setState({
          loading: false
        })
        this.hasLoaded = true
      }
    }
  }

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
    if (this.state.loading) {
      return (
        <span style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <SyncLoader color="#df5a4c;" />
        </span>
      )
    }

    let emptyHtml = (
      <span>
        <h2 className={`${ns}__title`}>No Active Carwashes</h2>
        <p>Please check back again</p>
      </span>
    )

    let html = <h2 className={`${ns}__title`}>Active Carwashes</h2>

    let hasInactives = this.renderInactiveCarwashes().length > 0 ? true : false

    return (
      <div className={`${ns}`}>
        {this.props.empty ? emptyHtml : html}

        <div className={`${ns}__list`}>{this.renderActiveCarwashes()}</div>

        {hasInactives && (
          <span>
            <hr className={`${ns}__line`} />
            <h2>Inactive Carwashes</h2>
            <div className={`${ns}__list`}>{this.renderInactiveCarwashes()}</div>
          </span>
        )}
      </div>
    )
  }
}

export default ActiveCarwashes
