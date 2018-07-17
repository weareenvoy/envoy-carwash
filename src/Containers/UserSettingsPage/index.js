import React, { Component } from 'react'

// Styles
import './styles.scss'

// Components
import Notifications from '../../Components/Notifications'

const ns = 'user-settings-page'
class Test extends Component {
  render() {
    return (
      <div className={`${ns} padding`}>
        <h2 className={`${ns}__title`}>User Settings</h2>
        <Notifications />
      </div>
    )
  }
}

export default Test
