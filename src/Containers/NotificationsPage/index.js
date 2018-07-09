import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import Notifications from '../../Components/Notifications'

const ns = 'notifications-page'
class Test extends Component {
  render() {
    return (
      <div className={`${ns}`}>
        <Notifications />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    myItem: state.myItem
  }
}

export default connect(mapStateToProps)(Test)
