import React, { PureComponent } from 'react'
import formatDate from '../../utils/date'

// Components
import AddToCalendar from '../../Components/AddToCalendar'
import Paid from '../../Components/Paid'

// Styles
import './styles.scss'

// Images
const emptyAvatar =
  'https://firebasestorage.googleapis.com/v0/b/envoy-carwash.appspot.com/o/empty-avatar.png?alt=media&token=b32ae978-0e72-41ff-ada6-e964e1a06f62'

const ns = 'current-signups'
class CurrentSignups extends PureComponent {
  render() {
    const {
      carwash,
      carwash: { users },
      id,
      currentUser,
      cancel,
      CARWASH_REF
    } = this.props

    return users.map((user, i) => (
      <li className={`${ns}__card`} key={i}>
        <div className={`${ns}__card-top`}>
          <div className={`${ns}__user-detail`}>
            <img
              className={`${ns}__profile-image`}
              alt="Avatar"
              src={user.photoURL || emptyAvatar}
              style={{ width: '40px', height: '40px', borderRadius: '50%' }}
            />
            <h4 className={`${ns}__display-name`}>{user.displayName}</h4>
          </div>

          <span className={`${ns}__actions`}>
            {user.uid === currentUser.uid && (
              <button className="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onClick={cancel}>
                Cancel
              </button>
            )}

            {user.uid === currentUser.uid && <AddToCalendar date={carwash.date} name={formatDate(carwash.date)} />}
          </span>
        </div>

        <div className={`${ns}__card-bottom`}>
          <Paid user={user} currentUser={currentUser} i={i} CARWASH_REF={CARWASH_REF} id={id} />

          <div
            className={`${ns}__car-details`}
            onClick={e => {
              e.preventDefault()

              if (!e.target.parentElement.classList.contains('show')) {
                e.target.parentElement.classList.add('show')
              } else {
                e.target.parentElement.classList.remove('show')
              }
            }}
          >
            <h6 className={`${ns}__car-details-title`}>Car Details</h6>

            <div className={`${ns}__car-details-wrapper`}>
              <span className={`${ns}__car-detail`}>
                <p className={`${ns}__car-detail-headline`}>Make</p>
                <p className={`${ns}__car-detail-copy`}>{user.carMake}</p>
              </span>

              <span className={`${ns}__car-detail`}>
                <p className={`${ns}__car-detail-headline`}>Model</p>
                <p className={`${ns}__car-detail-copy`}>{user.carModel}</p>
              </span>
            </div>
          </div>
        </div>
      </li>
    ))
  }
}

export default CurrentSignups
