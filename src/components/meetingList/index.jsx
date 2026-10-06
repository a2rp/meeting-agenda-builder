import { LuCalendarDays, LuChevronRight, LuClock, LuPlus } from 'react-icons/lu'
import styles from './styles.module.css'

const formatMeetingDate = (dateValue) => {
  const date = new Date(`${dateValue}T12:00:00`)
  return {
    weekday: new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date),
    day: new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(date),
  }
}

const formatMeetingTime = (dateValue, timeValue) => {
  const date = new Date(`${dateValue}T${timeValue}:00`)
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date)
}

const MeetingList = ({ meetings, selectedMeetingId, onSelectMeeting, onCreateMeeting }) => {
  const orderedMeetings = [...meetings].sort((first, second) =>
    `${first.date}T${first.startTime}`.localeCompare(`${second.date}T${second.startTime}`),
  )

  return (
    <aside className={styles.library} id="meetings" aria-labelledby="meeting-list-title">
      <header className={styles['library-heading']}>
        <div>
          <p className={styles.label}><LuCalendarDays aria-hidden="true" /> THE MEETING SHELF</p>
          <div className={styles['heading-row']}>
            <h2 id="meeting-list-title">On the calendar</h2>
            <span>{meetings.length}</span>
          </div>
        </div>
        {onCreateMeeting && (
          <button className={styles['create-button']} type="button" onClick={onCreateMeeting} aria-label="Create a meeting">
            <LuPlus aria-hidden="true" />
          </button>
        )}
      </header>

      {orderedMeetings.length ? (
        <ol className={styles['meeting-list']}>
          {orderedMeetings.map((meeting) => {
            const date = formatMeetingDate(meeting.date)
            const isSelected = meeting.id === selectedMeetingId
            const totalMinutes = meeting.agenda.reduce((total, item) => total + item.minutes, 0)

            return (
              <li key={meeting.id}>
                <button
                  className={`${styles['meeting-option']} ${isSelected ? styles.selected : ''}`}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onSelectMeeting(meeting.id)}
                >
                  <span className={styles['date-card']}>
                    <small>{date.weekday}</small>
                    <strong>{date.day}</strong>
                  </span>
                  <span className={styles['meeting-copy']}>
                    <strong>{meeting.title}</strong>
                    <span>{formatMeetingTime(meeting.date, meeting.startTime)} <span aria-hidden="true">/</span> {meeting.location}</span>
                    <small><LuClock aria-hidden="true" /> {totalMinutes} minute agenda</small>
                  </span>
                  <LuChevronRight className={styles.chevron} aria-hidden="true" />
                </button>
              </li>
            )
          })}
        </ol>
      ) : (
        <div className={styles['empty-list']}>
          <strong>No meetings on the shelf</strong>
          <p>Create a meeting to start its agenda.</p>
        </div>
      )}
    </aside>
  )
}

export default MeetingList
