import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import ActiveCarwashes from '../../Components/ActiveCarwashes'

const ns = 'home'

class HomePage extends Component {
  state = {
    carwashes: null
  }

  componentDidMount() {
    let self = this

    // Get Initial Carwashes
    this.props.flamelink.app.content
      .get('carwash')
      .then(carwashes => {
        self.setState({
          carwashes
        })
      })
      .catch(error => console.error(error))

    // Subscribe to changes and update the UI after a change from the admin
    this.props.flamelink.app.content.subscribe('carwash', (error, carwashes) => {
      self.setState({
        carwashes
      })
    })
  }

  render() {
    return (
      <div className={`${ns}`}>
        <ActiveCarwashes carwashes={this.state.carwashes} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    flamelink: state.flamelink
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch)
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)
