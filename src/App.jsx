import { useEffect, useState } from 'react'
import styles from './App.module.css'
import AgendaEditor from './components/agendaEditor/index.jsx'
import BackToTop from './components/backToTop/index.jsx'
import ConfirmationDialog from './components/confirmationDialog/index.jsx'
import FacilitatorPanel from './components/facilitatorPanel/index.jsx'
import Footer from './components/footer/index.jsx'
import Header from './components/header/index.jsx'
import MeetingList from './components/meetingList/index.jsx'
import MeetingDialog from './components/meetingDialog/index.jsx'
import { makeInitialMeetings } from './data/meetings.js'

const isValidMeeting = (meeting) => meeting && typeof meeting === 'object'
  && typeof meeting.id === 'string' && typeof meeting.title === 'string'
  && /^\d{4}-\d{2}-\d{2}$/.test(meeting.date)
  && /^\d{2}:\d{2}$/.test(meeting.startTime)
  && typeof meeting.location === 'string' && typeof meeting.note === 'string'
  && Array.isArray(meeting.participants) && meeting.participants.every((person) => typeof person === 'string')
  && Array.isArray(meeting.agenda) && meeting.agenda.every((item) => item && typeof item.id === 'string'
    && typeof item.title === 'string' && typeof item.owner === 'string'
    && Number.isFinite(Number(item.minutes)) && Number(item.minutes) >= 1
    && typeof item.complete === 'boolean')

const loadMeetings = () => {
  try {
    const savedMeetings = localStorage.getItem('roomnote-meetings-v1')
    if (savedMeetings) {
      const parsedMeetings = JSON.parse(savedMeetings)
      if (Array.isArray(parsedMeetings) && parsedMeetings.every(isValidMeeting)) return parsedMeetings
    }
  } catch {
    // Start with sample meetings if stored data cannot be read.
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

const canUseStorage = () => {
  try {
    const probeKey = `roomnote-storage-probe-${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem(probeKey, '1')
    localStorage.removeItem(probeKey)
    return true
  } catch {
    return false
  }
}

const App = () => {
  const [meetings, setMeetings] = useState(loadMeetings)
  const [selectedMeetingId, setSelectedMeetingId] = useState(loadSelectedMeetingId)
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false)
  const [meetingToEdit, setMeetingToEdit] = useState(null)
  const [confirmation, setConfirmation] = useState(null)
  const [storageAvailable, setStorageAvailable] = useState(canUseStorage)
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
    if (!meeting) return

    setConfirmation({
      title: 'Remove this meeting?',
      description: 'The meeting and its full agenda will be removed. This action cannot be undone.',
      itemName: meeting.title,
      confirmLabel: 'Remove meeting',
      onConfirm: () => {
        const remainingMeetings = meetings.filter((item) => item.id !== meetingId)
        setMeetings(remainingMeetings)
        if (meetingId === visibleMeetingId) setSelectedMeetingId(remainingMeetings[0]?.id || '')
        closeMeetingDialog()
      },
    })
  }

  useEffect(() => {
    if (!storageAvailable) return
    try {
      localStorage.setItem('roomnote-meetings-v1', JSON.stringify(meetings))
    } catch {
      setStorageAvailable(false)
    }
  }, [meetings, storageAvailable])

  useEffect(() => {
    if (!storageAvailable) return
    try {
      if (visibleMeetingId) localStorage.setItem('roomnote-selected-meeting-v1', visibleMeetingId)
    } catch {
      setStorageAvailable(false)
    }
  }, [visibleMeetingId, storageAvailable])

  return (
    <div className={styles.app} id="top">
      <Header />
      <main className={styles.workspace}>
        <p className={styles.label} role="status" aria-live="polite">
          ROOMNOTE / MEETING PLANNER
          <span className={styles['storage-status']}>{storageAvailable ? '· SAVED ON THIS DEVICE' : '· SESSION ONLY / STORAGE UNAVAILABLE'}</span>
        </p>
        <section className={styles.opening} id="overview" aria-labelledby="page-title">
          <div className={styles['opening-copy']}>
            <p className={styles.label}>GOOD MEETINGS START BEFORE THE ROOM FILLS</p>
            <h1 id="page-title">Make the hour count.</h1>
            <p className={styles.introCopy}>
              Shape a clear agenda, give every topic its time, and leave with decisions everyone can act on.
            </p>
          </div>
          <figure className={styles['opening-visual']}>
            <img
              src={`${import.meta.env.BASE_URL}images/meeting-prep.jpg`}
              alt="A laptop, notebook, pen, and coffee laid out on a wooden desk for meeting preparation"
            />
            <figcaption>
              <span>THE PREP DESK / NO. 01</span>
              <p>First bring the question. Then bring the room.</p>
            </figcaption>
          </figure>
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
            onRequestConfirmation={setConfirmation}
          />
          <FacilitatorPanel
            key={`${visibleMeetingId || 'no-meeting'}-${selectedAgendaMinutes}`}
            meeting={selectedMeeting}
            onUpdateNote={updateMeetingNote}
          />
        </div>
      </main>
      <Footer />
      <BackToTop />
      {meetingDialogOpen && (
        <MeetingDialog
          key={meetingToEdit?.id || 'new-meeting'}
          meeting={meetingToEdit}
          confirmationOpen={Boolean(confirmation)}
          onClose={closeMeetingDialog}
          onSave={saveMeeting}
          onDelete={removeMeeting}
        />
      )}
      {confirmation && (
        <ConfirmationDialog
          {...confirmation}
          onClose={() => setConfirmation(null)}
        />
      )}
    </div>
  )
}

export default App
