import { useEffect, useState } from 'react'
import { LuCalendarDays, LuClock3, LuMapPin, LuUsers, LuX } from 'react-icons/lu'
import styles from './styles.module.css'

const getToday = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const getMeetingForm = (meeting) => ({
  title: meeting?.title || '',
  date: meeting?.date || getToday(),
  startTime: meeting?.startTime || '09:00',
  location: meeting?.location || '',
  participants: meeting?.participants?.join(', ') || '',
  note: meeting?.note || '',
})

const MeetingDialog = ({ meeting, confirmationOpen, onClose, onSave, onDelete }) => {
  const [form, setForm] = useState(() => getMeetingForm(meeting))

  useEffect(() => {
    if (confirmationOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [confirmationOpen, onClose])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const submitMeeting = (event) => {
    event.preventDefault()
    if (!form.title.trim()) return
    const participants = form.participants.split(',').map((name) => name.trim()).filter(Boolean)
    onSave({
      ...meeting,
      id: meeting?.id || `meeting-${Date.now()}`,
      title: form.title.trim(),
      date: form.date,
      startTime: form.startTime,
      location: form.location.trim() || 'Location to be decided',
      participants,
      note: form.note.trim(),
      agenda: meeting?.agenda || [],
    })
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="meeting-dialog-title">
        <header className={styles['dialog-header']}>
          <span className={styles['dialog-icon']}><LuCalendarDays aria-hidden="true" /></span>
          <div>
            <p className={styles.label}>{meeting ? 'TEND TO THE DETAILS' : 'MAKE ROOM FOR A GOOD CONVERSATION'}</p>
            <h2 id="meeting-dialog-title">{meeting ? 'Edit meeting' : 'Plan a meeting'}</h2>
          </div>
          <button className={styles['close-button']} type="button" onClick={onClose} aria-label="Close meeting form">
            <LuX aria-hidden="true" />
          </button>
        </header>

        <form onSubmit={submitMeeting}>
          <label className={styles.field}>
            <span>Meeting name</span>
            <input name="title" value={form.title} onChange={updateField} placeholder="Product review" required autoFocus />
          </label>

          <div className={styles['date-row']}>
            <label className={styles.field}>
              <span><LuCalendarDays aria-hidden="true" /> Date</span>
              <input name="date" type="date" value={form.date} onChange={updateField} required />
            </label>
            <label className={styles.field}>
              <span><LuClock3 aria-hidden="true" /> Starts</span>
              <input name="startTime" type="time" value={form.startTime} onChange={updateField} required />
            </label>
          </div>

          <label className={styles.field}>
            <span><LuMapPin aria-hidden="true" /> Location</span>
            <input name="location" value={form.location} onChange={updateField} placeholder="Studio 2 or video call" />
          </label>

          <label className={styles.field}>
            <span><LuUsers aria-hidden="true" /> People at the table</span>
            <input name="participants" value={form.participants} onChange={updateField} placeholder="Add names separated by commas" />
            <small>Separate each person's name with a comma.</small>
          </label>

          <label className={styles.field}>
            <span>Intention for this meeting</span>
            <textarea name="note" value={form.note} onChange={updateField} placeholder="What should everyone leave knowing?" rows="3" />
          </label>

          <footer className={styles['form-footer']}>
            {meeting && (
              <button className={styles['delete-button']} type="button" onClick={() => onDelete(meeting.id)}>Remove meeting</button>
            )}
            <div className={styles['footer-actions']}>
              <button className={styles['cancel-button']} type="button" onClick={onClose}>Cancel</button>
              <button className={styles['save-button']} type="submit">{meeting ? 'Save changes' : 'Create meeting'}</button>
            </div>
          </footer>
        </form>
      </section>
    </div>
  )
}

export default MeetingDialog
