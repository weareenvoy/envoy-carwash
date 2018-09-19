import React, { Component } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

// Actions
import { clearUser } from '../../store/actions/user'

// Containers
import PrivateRoute from '../PrivateRoute'
import HomePage from '../HomePage'
import AuthPage from '../AuthPage'
import CarwashDetailPage from '../CarwashDetailPage'
import UserSettingsPage from '../UserSettingsPage'

// Components
import Navbar from '../../Components/Navbar'
import Footer from '../../Components/Footer'

// Styles
import './styles.scss'

const ns = 'app'

class App extends Component {
  render() {
    return (
      <Router location onUpdate={() => window.scrollTo(0, 0)}>
        <div className={`${ns}`}>
          <Navbar user={this.props.user} clearUser={this.props.clearUser} />

          <div className="page-wrapper">
            <Switch>
              <Route path="/auth" exact component={AuthPage} />
              <PrivateRoute exact path="/" component={HomePage} />
              <PrivateRoute exact path="/user-settings" component={UserSettingsPage} />
              <PrivateRoute exact path="/carwash/:id" component={CarwashDetailPage} />
            </Switch>
          </div>

          <div id="modal-root" />

          <Footer user={this.props.user} />
        </div>
      </Router>
    )
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      clearUser
    },
    dispatch
  )
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
