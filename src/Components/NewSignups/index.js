import React, { PureComponent } from 'react'

// Styles
import './styles.scss'

const ns = 'new-signups'
class NewSignups extends PureComponent {
  render() {
    const {
      carwash: { numberOfReservations },
      counter,
      signup
    } = this.props

    const limit = numberOfReservations - (counter + 1)
    let signupButtons = []

    for (let i = 0; i <= limit; i += 1) {
      signupButtons.push(
        <li className={`${ns}__signup`} key={i}>
          <div className={`${ns}__start`}>
            <p>Click the 'Reserve' button to fill your spot.</p>
          </div>

          <div className={`${ns}__end`}>
            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={signup}>
              Reserve
            </button>
          </div>
        </li>
      )
    }

    return signupButtons
  }
}

export default NewSignups
