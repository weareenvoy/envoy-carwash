import React, { PureComponent } from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router-dom'

// Styles
import './styles.scss'

const ns = 'dialog-signup'
class DialogSignup extends PureComponent {
  constructor(props) {
    super(props)

    this.el = document.createElement('div')
    this.modalRoot = document.getElementById('modal-root')
  }

  state = {
    make: '',
    model: ''
  }

  componentDidMount() {
    this.modalRoot.appendChild(this.el)
    this.modalRoot.style.zIndex = '999'
    window.componentHandler.upgradeDom()

    this.setState({
      make: this.props.make,
      model: this.props.model
    })
  }

  componentWillUnmount() {
    // Remove the element from the DOM when we unmount
    this.modalRoot.removeChild(this.el)
    this.modalRoot.style.zIndex = '-1'
  }

  render() {
    const DOM = (
      <React.Fragment>
        <div className={`${ns}`}>
          <dialog className="mdl-dialog" open={this.props.open === true} style={{ width: '500px', height: 'auto' }}>
            <h4 className="mdl-dialog__title">Enter Your Car Details</h4>
            <div className="mdl-dialog__content">
              <div
                className={
                  this.state.make
                    ? 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused'
                    : 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label'
                }
              >
                <input
                  className="mdl-textfield__input"
                  type="text"
                  id="carMake"
                  value={this.state.make || ''}
                  onChange={e => {
                    this.setState({ make: e.target.value })
                  }}
                />
                <label className="mdl-textfield__label" htmlFor="carMake">
                  Make
                </label>
              </div>

              <div
                className={
                  this.state.model
                    ? 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label is-focused'
                    : 'mdl-textfield mdl-js-textfield mdl-textfield--floating-label'
                }
              >
                <input
                  className="mdl-textfield__input"
                  type="text"
                  id="carModel"
                  value={this.state.model || ''}
                  onChange={e => {
                    this.setState({ model: e.target.value })
                  }}
                />
                <label className="mdl-textfield__label" htmlFor="carModel">
                  Model
                </label>
              </div>
            </div>

            <div className={`${ns}__actions mdl-dialog__actions`}>
              <button
                type="button"
                className="mdl-button submit"
                onClick={e => {
                  this.props.signup(e, this.state.make, this.state.model)
                }}
                disabled={this.state.make && this.state.model && this.state.make.length > 0 && this.state.model.length > 0 ? false : true}
              >
                Submit
              </button>
              <button
                type="button"
                className="mdl-button close"
                onClick={e => {
                  this.props.close()
                }}
              >
                Cancel
              </button>
            </div>

            <small>
              To update these details later, go to your{' '}
              <Link style={{ fontSize: 'inherit' }} to="/user-settings" target="_blank">
                User Settings
              </Link>
              .
            </small>
          </dialog>
        </div>

        <div className={this.props.open ? `${ns}__overlay show` : `${ns}__overlay`} />
      </React.Fragment>
    )
    return ReactDOM.createPortal(
      // Any valid React child: JSX, strings, arrays, etc.
      DOM,
      // A DOM element
      this.el
    )
  }
}

export default DialogSignup
