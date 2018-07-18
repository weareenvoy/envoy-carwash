import React, { Component } from 'react'

// Styles
import './styles.scss'

const ns = 'dialog'
class Dialog extends Component {
  state = {
    show: false
  }

  componentDidMount() {
    this.setState({
      show: this.props.show
    })

    if (this.props.show) {
      document.body.style.overflow = 'hidden'
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className={`${ns}`}>
          <div className={`${ns}__container`}>
            <dialog className="mdl-dialog" open={this.state.show === true}>
              <h4 className="mdl-dialog__title">{this.props.title}</h4>
              <div className="mdl-dialog__content">
                <p>{this.props.message}</p>
              </div>

              <div className="mdl-dialog__actions">
                <button
                  type="button"
                  className="mdl-button close"
                  onClick={e => {
                    e.preventDefault()
                    this.setState({
                      show: false
                    })

                    document.body.style.overflow = 'auto'
                  }}
                >
                  Close
                </button>
              </div>
            </dialog>
          </div>
        </div>

        <div className={this.state.show ? `${ns}__overlay show` : `${ns}__overlay`} />
      </React.Fragment>
    )
  }
}

export default Dialog
