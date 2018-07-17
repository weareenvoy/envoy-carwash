import React, { Component } from 'react'

// Styles
import './styles.scss'

const ns = 'footer'
class Footer extends Component {
  render() {
    return (
      <div className={`${ns}`}>
        <div className={`${ns}__container`}>
          <div className={`${ns}__start`} />

          <div className={`${ns}__end`}>
            <small>Copyright 2018 ENVOY Group, LLC.</small>
          </div>
        </div>
      </div>
    )
  }
}

export default Footer
