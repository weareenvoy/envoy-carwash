import React, { Component } from 'react'

// Styles
import './styles.scss'

// Images
import googleCalendar from '../../assets/images/google-calendar.png'

const ns = 'add-to-calendar'
class AddToCalendar extends Component {
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

  add() {
    const url = this.buildUrl()
  }
  render() {
    return (
      <div className={`${ns}`}>
        <img className={`${ns}__logo`} src={googleCalendar} alt="Google Calendar" />

        <a className={`${ns}__button`} href={this.buildUrl()} target="_blank" rel="noopener noreferrer">
          Add To Google Calendar
        </a>
      </div>
    )
  }
}

export default AddToCalendar
