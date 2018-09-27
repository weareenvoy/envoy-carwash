import React, { PureComponent } from 'react'

// Styles
import './styles.scss'

const ns = 'dialog'
class Dialog extends PureComponent {
  constructor(props) {
    super(props)

    this.close = this.close.bind(this)
  }

  state = {
    show: false
  }

  componentDidMount() {
    this.setState({
      show: this.props.show
    })
  }

  close(e) {
    e.preventDefault()
    this.setState({
      show: false
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className={this.state.show ? `${ns} show` : `${ns}`}>
          <div className={`${ns}__container`}>
            <dialog className="mdl-dialog" open={this.state.show === true}>
              <h4 className="mdl-dialog__title">{this.props.title}</h4>
              <div className="mdl-dialog__content">
                <p>{this.props.message}</p>
              </div>

              <div className="mdl-dialog__actions">
                <button type="button" className="mdl-button close" onClick={this.close}>
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
