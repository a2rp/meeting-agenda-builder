import { useEffect, useState } from 'react'
import styles from './App.module.css'
import AgendaEditor from './components/agendaEditor/index.jsx'
import Header from './components/header/index.jsx'
import MeetingList from './components/meetingList/index.jsx'
import { makeInitialMeetings } from './data/meetings.js'

const loadMeetings = () => {
  try {
    const savedMeetings = localStorage.getItem('roomnote-meetings-v1')
    if (savedMeetings) return JSON.parse(savedMeetings)
  } catch {
    return makeInitialMeetings()
  }

  return makeInitialMeetings()
}

const loadSelectedMeetingId = () => {
  try {
    return localStorage.getItem('roomnote-selected-meeting-v1') || 'meeting-product-review'
  } catch {
    return 'meeting-product-review'
  }
}

const App = () => {
  const [meetings, setMeetings] = useState(loadMeetings)
  const [selectedMeetingId, setSelectedMeetingId] = useState(loadSelectedMeetingId)
  const visibleMeetingId = meetings.some((meeting) => meeting.id === selectedMeetingId)
    ? selectedMeetingId
    : meetings[0]?.id
  const selectedMeeting = meetings.find((meeting) => meeting.id === visibleMeetingId)

  const updateAgenda = (meetingId, agenda) => {
    setMeetings((currentMeetings) => currentMeetings.map((meeting) =>
      meeting.id === meetingId ? { ...meeting, agenda } : meeting,
    ))
  }

  useEffect(() => {
    try {
      localStorage.setItem('roomnote-meetings-v1', JSON.stringify(meetings))
    } catch {
      // The planner remains usable if browser storage is unavailable.
    }
  }, [meetings])

  useEffect(() => {
    try {
      if (visibleMeetingId) localStorage.setItem('roomnote-selected-meeting-v1', visibleMeetingId)
    } catch {
      // The active meeting is still available until the page is refreshed.
    }
  }, [visibleMeetingId])

  return (
    <div className={styles.app} id="top">
      <Header />
      <main className={styles.workspace}>
        <p className={styles.kicker}>ROOMNOTE / MEETING PLANNER</p>
        <section className={styles.opening} id="overview" aria-labelledby="page-title">
          <p className={styles.eyebrow}>GOOD MEETINGS START BEFORE THE ROOM FILLS</p>
          <h1 id="page-title">Make the hour count.</h1>
          <p className={styles.introCopy}>
            Shape a clear agenda, give every topic its time, and leave with decisions everyone can act on.
          </p>
        </section>
        <div className={styles['planning-layout']}>
          <MeetingList
            meetings={meetings}
            selectedMeetingId={visibleMeetingId}
            onSelectMeeting={setSelectedMeetingId}
          />
          <AgendaEditor meeting={selectedMeeting} onUpdateAgenda={updateAgenda} />
          <section className={`${styles.placeholder} ${styles['planning-note']}`} id="notes" aria-labelledby="notes-title">
            <p className={styles.sectionLabel}>AFTER THE MEETING / 03</p>
            <h2 id="notes-title">Close with what comes next.</h2>
            <p>Decisions and follow-ups will stay with the meeting they came from.</p>
          </section>
        </div>
      </main>
    </div>
  )
}

export default App
