import React, { Component } from 'react'
import * as FIREBASE_AUTH from 'firebase/auth' // eslint-disable-line
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Actions
import { setUser } from '../../store/actions/user'

const ns = 'auth-page'

class AuthPage extends Component {
  state = {
    email: '',
    password: ''
  }

  handleSubmit(e) {
    e.preventDefault()
  }

  emailChange(event) {
    this.setState({ email: event.target.value })
  }

  passwordChange(event) {
    this.setState({ password: event.target.value })
  }

  render() {
    return (
      <div className={`${ns}`}>
        <h3>Auth Admin Page</h3>

        <form onSubmit={this.handleSubmit}>
          <label>
            Email:
            <input type="email" value={this.state.value} onChange={this.emailChange.bind(this)} />
          </label>

          <label>
            Password:
            <input type="password" value={this.state.value} onChange={this.passwordChange.bind(this)} />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    // firebase: state.firebase.FIREBASE_APP
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      setUser
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthPage)
