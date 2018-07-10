import React, { Component } from 'react'
import { connect } from 'react-redux'

import ActiveCarwashes from '../../Components/ActiveCarwashes'

const ns = 'home'

class HomePage extends Component {
  state = {
    carwashes: null
  }

  isEmpty(obj) {
    let check

    if (obj === undefined || obj === null) return true

    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && obj[prop].isActive) {
        check = false
        break
      }

      check = true
      break
    }

    return check
  }

  componentWillUnmount() {
    this.props.flamelink.app.content.unsubscribe('carwash')
  }

  componentDidMount() {
    let self = this

    // Get Initial Carwashes
    this.props.flamelink.app.content
      .get('carwash')
      .then(carwashes => {
        let isEmpty = self.isEmpty(carwashes)

        self.setState({
          carwashes,
          isEmpty
        })
      })
      .catch(error => console.error(error))

    // Subscribe to changes and update the UI after a change from the admin
    this.props.flamelink.app.content.subscribe('carwash', (error, carwashes) => {
      if (error) {
        console.error(error)
      }

      let isEmpty = self.isEmpty(carwashes)

      self.setState({
        carwashes,
        isEmpty
      })
    })
  }

  render() {
    return (
      <div className={`${ns}`}>
        <ActiveCarwashes carwashes={this.state.carwashes} empty={this.state.isEmpty} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    flamelink: state.flamelink
  }
}

export default connect(mapStateToProps)(HomePage)
