import React, { Component } from 'react'
import 'material-design-lite'

// Styles
import './styles.scss'

// Images
import googleCalendar from '../../assets/images/google-calendar.png'

const ns = 'add-to-calendar'
class AddToCalendar extends Component {
  componentDidMount() {
    window.componentHandler.upgradeElement(this.tooltip)
  }

  buildUrl() {
    let startDate = new Date(this.props.date)
    startDate.setHours(9)
    let endDate = new Date(startDate.getTime())
    endDate.setHours(17)

    let calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&dates=${this.formatDate(startDate)}/${this.formatDate(
      endDate
    )}&location=${this.formatString('34 Tesla Irvine, CA 92618')}&text=${this.formatString('Carwash for ' + this.props.name)}`

    return calendarUrl
  }

  formatString(string) {
    return encodeURIComponent(string).replace(/%20/g, '+')
  }

  formatDate(date) {
    return date ? date.toISOString().replace(/-|:|\.\d+/g, '') : null
  }

  render() {
    return (
      <div className={`${ns}`}>
        <a className={`${ns}__button`} href={this.buildUrl()} target="_blank" rel="noopener noreferrer">
          <img id="tt2" className={`${ns}__logo`} src={googleCalendar} alt="Google Calendar" />
        </a>

        <div className="mdl-tooltip mdl-tooltip--large" htmlFor="tt2" ref={c => (this.tooltip = c)}>
          Add to Google Calendar
        </div>
      </div>
    )
  }
}

export default AddToCalendar
