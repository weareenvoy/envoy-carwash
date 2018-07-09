import React, { Component } from 'react'
import { Link } from 'react-router-dom'

// Styles
import './styles.scss'

// Icons
import icon from '../../assets/icons/carwash-icon--black.svg'
import logo from '../../assets/envoy.png'

const ns = 'menu'
class Menu extends Component {
  render() {
    return (
      <div className={this.props.show ? `${ns} show` : `${ns}`}>
        <div className={`${ns}__container`}>
          <div className={`${ns}__top`}>
            <div className={`${ns}__top-inner`}>
              <Link to="/">
                <img className={`${ns}__logo`} src={logo} alt="Logo" style={{ width: '90px', marginRight: '5px' }} />
                <img className={`${ns}__icon`} src={icon} alt="Icon" style={{ width: '30px' }} />
              </Link>
            </div>
          </div>

          <div className={`${ns}__bottom`}>
            <Link to="/notifications">Notifications</Link>

            <button className="button primary" onClick={this.props.signOut}>
              Logout
            </button>
          </div>
        </div>
        <div className={`${ns}__overlay`} onClick={this.props.toggleMenu} />
      </div>
    )
  }
}

export default Menu
