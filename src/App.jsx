import { useEffect, useState } from 'react'
import styles from './App.module.css'
import AgendaEditor from './components/agendaEditor/index.jsx'
import FacilitatorPanel from './components/facilitatorPanel/index.jsx'
import Footer from './components/footer/index.jsx'
import Header from './components/header/index.jsx'
import MeetingList from './components/meetingList/index.jsx'
import MeetingDialog from './components/meetingDialog/index.jsx'
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
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false)
  const [meetingToEdit, setMeetingToEdit] = useState(null)
  const visibleMeetingId = meetings.some((meeting) => meeting.id === selectedMeetingId)
    ? selectedMeetingId
    : meetings[0]?.id
  const selectedMeeting = meetings.find((meeting) => meeting.id === visibleMeetingId)
  const selectedAgendaMinutes = selectedMeeting?.agenda.reduce((total, item) => total + Number(item.minutes), 0) || 0

  const updateAgenda = (meetingId, agenda) => {
    setMeetings((currentMeetings) => currentMeetings.map((meeting) =>
      meeting.id === meetingId ? { ...meeting, agenda } : meeting,
    ))
  }

  const updateMeetingNote = (meetingId, note) => {
    setMeetings((currentMeetings) => currentMeetings.map((meeting) =>
      meeting.id === meetingId ? { ...meeting, note } : meeting,
    ))
  }

  const openNewMeeting = () => {
    setMeetingToEdit(null)
    setMeetingDialogOpen(true)
  }

  const openEditMeeting = (meeting) => {
    setMeetingToEdit(meeting)
    setMeetingDialogOpen(true)
  }

  const closeMeetingDialog = () => setMeetingDialogOpen(false)

  const saveMeeting = (updatedMeeting) => {
    const alreadyExists = meetings.some((meeting) => meeting.id === updatedMeeting.id)
    if (alreadyExists) {
      setMeetings((currentMeetings) => currentMeetings.map((meeting) =>
        meeting.id === updatedMeeting.id ? updatedMeeting : meeting,
      ))
    } else {
      setMeetings((currentMeetings) => [...currentMeetings, updatedMeeting])
      setSelectedMeetingId(updatedMeeting.id)
    }
    closeMeetingDialog()
  }

  const removeMeeting = (meetingId) => {
    const meeting = meetings.find((item) => item.id === meetingId)
    if (!meeting || !window.confirm(`Remove "${meeting.title}" and its agenda?`)) return
    const remainingMeetings = meetings.filter((item) => item.id !== meetingId)
    setMeetings(remainingMeetings)
    if (meetingId === visibleMeetingId) setSelectedMeetingId(remainingMeetings[0]?.id || '')
    closeMeetingDialog()
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
            onCreateMeeting={openNewMeeting}
          />
          <AgendaEditor
            meeting={selectedMeeting}
            onUpdateAgenda={updateAgenda}
            onEditMeeting={openEditMeeting}
          />
          <FacilitatorPanel
            key={`${visibleMeetingId || 'no-meeting'}-${selectedAgendaMinutes}`}
            meeting={selectedMeeting}
            onUpdateNote={updateMeetingNote}
          />
        </div>
      </main>
      <Footer />
      {meetingDialogOpen && (
        <MeetingDialog
          key={meetingToEdit?.id || 'new-meeting'}
          meeting={meetingToEdit}
          onClose={closeMeetingDialog}
          onSave={saveMeeting}
          onDelete={removeMeeting}
        />
      )}
    </div>
  )
}

export default App
