import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import ActiveCarwashes from '../../Components/ActiveCarwashes'

const ns = 'home'

class HomePage extends Component {
  state = {
    carwashes: null,
    isEmpty: false,
    activeCarwashesLoading: true
  }

  isEmpty(obj) {
    if (obj === undefined || obj === null) return true

    for (let prop in obj) {
      if (obj.hasOwnProperty(prop) && obj[prop].isActive) {
        return false
      }

      return true
    }
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
          isEmpty,
          activeCarwashesLoading: false
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
        isEmpty,
        activeCarwashesLoading: false
      })
    })
  }

  render() {
    return (
      <div className={`${ns} padding`}>
        <ActiveCarwashes carwashes={this.state.carwashes} empty={this.state.isEmpty} activeCarwashesLoading={this.state.activeCarwashesLoading} />
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
