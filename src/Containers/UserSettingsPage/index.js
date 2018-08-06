import React, { PureComponent } from 'react'
import { connect } from 'react-redux'

// Styles
import './styles.scss'

// Components
import Notifications from '../../Components/Notifications'
import UserInformation from '../../Components/UserInformation'

const ns = 'user-settings-page'
class UserSettingsPage extends PureComponent {
  render() {
    return (
      <div className={`${ns} padding`}>
        <h2 className={`${ns}__title`}>User Settings</h2>
        <Notifications />

        <UserInformation USERS_REF={this.props.USERS_REF} />
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    USERS_REF: state.firebase.USERS_REF
  }
}

export default connect(mapStateToProps)(UserSettingsPage)
