import React, { PureComponent } from 'react'
import { Link } from 'react-router-dom'

// Styles
import './styles.scss'

// Icons
import icon from '../../assets/icons/carwash-icon--black.svg'
import logo from '../../assets/images/envoy.png'

const ns = 'menu'
class Menu extends PureComponent {
  render() {
    return (
      <div className={this.props.show ? `${ns} show` : `${ns}`}>
        <div className={`${ns}__container`}>
          <div className={`${ns}__top`}>
            <div className={`${ns}__top-inner`}>
              <Link to="/" onClick={this.props.toggleMenu}>
                <img className={`${ns}__logo`} src={logo} alt="Logo" style={{ width: '90px', marginRight: '5px' }} />
                <img className={`${ns}__icon`} src={icon} alt="Icon" style={{ width: '30px' }} />
              </Link>
            </div>
          </div>

          <div className={`${ns}__bottom`}>
            <Link to="/user-settings" onClick={this.props.toggleMenu}>
              User Settings
            </Link>

            <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored" onClick={this.props.signOut}>
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
