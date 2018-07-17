/**
 *
 * PrivateRoute
 * Higher Order Component that blocks navigation when the user is not logged in
 * and redirect the user to login page
 *
 * Wrap your protected routes to secure your container
 */

import React from 'react'
import { Redirect, Route } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        localStorage.getItem('uid') !== null ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/auth',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

export default PrivateRoute
