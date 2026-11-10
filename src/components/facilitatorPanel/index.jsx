import { useEffect, useRef, useState } from 'react'
import { LuPause, LuPlay, LuRotateCcw, LuUsers } from 'react-icons/lu'
import styles from './styles.module.css'

const formatCountdown = (totalSeconds) => {
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')
  return `${minutes}:${seconds}`
}

const getInitials = (name) => name
  .split(/\s+/)
  .map((part) => part[0])
  .slice(0, 2)
  .join('')
  .toUpperCase()

const FacilitatorPanel = ({ meeting, onUpdateNote }) => {
  const totalMinutes = meeting?.agenda.reduce((total, item) => total + Number(item.minutes), 0) || 0
  const totalSeconds = totalMinutes * 60
  const [remainingSeconds, setRemainingSeconds] = useState(totalSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const deadlineRef = useRef(null)
  const timerProgress = totalSeconds ? Math.round((remainingSeconds / totalSeconds) * 100) : 0
  const participants = meeting?.participants || []

  useEffect(() => {
    if (!isRunning || !deadlineRef.current) return undefined
    const deadline = deadlineRef.current
    const timerId = window.setInterval(() => {
      if (deadlineRef.current !== deadline) return
      const next = Math.max(0, Math.ceil((deadline - Date.now()) / 1000))
      setRemainingSeconds((current) => current === next ? current : next)
      if (next === 0) {
        deadlineRef.current = null
        setIsRunning(false)
      }
    }, 250)
    return () => window.clearInterval(timerId)
  }, [isRunning])

  const toggleTimer = () => {
    if (!totalSeconds) return
    if (isRunning) {
      const next = deadlineRef.current
        ? Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000))
        : remainingSeconds
      deadlineRef.current = null
      setRemainingSeconds(next)
      setIsRunning(false)
      return
    }
    const next = remainingSeconds === 0 ? totalSeconds : remainingSeconds
    if (remainingSeconds === 0) setRemainingSeconds(totalSeconds)
    deadlineRef.current = Date.now() + next * 1000
    setIsRunning(true)
  }

  const resetTimer = () => {
    deadlineRef.current = null
    setIsRunning(false)
    setRemainingSeconds(totalSeconds)
  }

  return (
    <aside className={styles.panel} id="notes" aria-label="Meeting preparation">
      <section className={styles['timer-card']} aria-labelledby="timer-title">
        <p className={styles.label}>KEEP THE ROOM ON TIME</p>
        <h2 id="timer-title">Session clock</h2>
        <div className={styles['timer-dial']} style={{ '--timer-progress': `${timerProgress}%` }}>
          <div>
            <strong>{formatCountdown(remainingSeconds)}</strong>
            <span>remaining</span>
          </div>
        </div>
        <p className={styles['timer-caption']}>
          {totalMinutes ? `${totalMinutes} minutes on the agenda` : 'Add a topic to set the clock'}
        </p>
        <div className={styles['timer-controls']}>
          <button className={styles['timer-start']} type="button" onClick={toggleTimer} disabled={!totalSeconds}>
            {isRunning && remainingSeconds > 0 ? <LuPause aria-hidden="true" /> : <LuPlay aria-hidden="true" />}
            {isRunning && remainingSeconds > 0 ? 'Pause clock' : 'Start clock'}
          </button>
          <button className={styles['timer-reset']} type="button" onClick={resetTimer} aria-label="Reset session clock" disabled={!totalSeconds}>
            <LuRotateCcw aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className={styles['people-card']} aria-labelledby="people-title">
        <header>
          <p className={styles.label}><LuUsers aria-hidden="true" /> AT THE TABLE</p>
          <span>{participants.length}</span>
        </header>
        <h2 id="people-title">People in the room</h2>
        {participants.length ? (
          <ul className={styles['attendee-list']}>
            {participants.map((person) => (
              <li key={person}>
                <span className={styles.avatar} aria-hidden="true">{getInitials(person)}</span>
                <span>{person}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className={styles['empty-people']}>Add people when you create the meeting.</p>
        )}
      </section>

      <section className={styles['notes-card']} aria-labelledby="prep-note-title">
        <label htmlFor="prep-note">
          <span className={styles.label}>A NOTE FOR THE FACILITATOR</span>
          <strong id="prep-note-title">Set the intention.</strong>
        </label>
        <textarea
          id="prep-note"
          value={meeting?.note || ''}
          onChange={(event) => meeting && onUpdateNote(meeting.id, event.target.value)}
          placeholder="What should everyone leave knowing?"
          rows="4"
          disabled={!meeting}
        />
        <p>Saved with this meeting.</p>
      </section>
    </aside>
  )
}

export default FacilitatorPanel
