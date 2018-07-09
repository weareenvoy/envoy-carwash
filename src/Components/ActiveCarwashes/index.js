import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Styles
import './styles.scss'

const ns = 'active-carwashes'

class ActiveCarwashes extends Component {
  renderCarwashes() {
    const { carwashes } = this.props
    let collection = []

    for (let key in carwashes) {
      const users = carwashes[key].users ? carwashes[key].users.length : 0

      collection.push(
        <div className={`${ns}__carwash`} key={carwashes[key].id}>
          <Link className={`${ns}__button button primary`} to={`/carwash/${carwashes[key].id}`}>
            {carwashes[key].name}
          </Link>

          <h6 className="active-carwashes__remaining">{carwashes[key].numberOfReservations - users} Spots Remaining</h6>
        </div>
      )
    }

    return collection
  }

  render() {
    return (
      <div className={`${ns}`}>
        <h2>Active Carwashes</h2>

        <div className={`${ns}__list`}>{this.renderCarwashes()}</div>
      </div>
    )
  }
}

export default ActiveCarwashes
