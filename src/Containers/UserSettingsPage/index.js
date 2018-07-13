import React, { Component } from 'react'

// Components
import Notifications from '../../Components/Notifications'

const ns = 'notifications-page'
class Test extends Component {
  render() {
    return (
      <div className={`${ns} padding`}>
        <h2>User Settings</h2>
        <Notifications />
      </div>
    )
  }
}

export default Test
