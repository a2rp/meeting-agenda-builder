import { useState } from 'react'
import {
  LuArrowDown,
  LuArrowUp,
  LuCheck,
  LuClock3,
  LuPencil,
  LuPlus,
  LuTrash2,
  LuUserRound,
  LuX,
} from 'react-icons/lu'
import styles from './styles.module.css'

const makeBlankTopic = () => ({ title: '', owner: '', minutes: 10 })

const formatClockTime = (totalMinutes) => {
  const date = new Date(2000, 0, 1, Math.floor(totalMinutes / 60) % 24, totalMinutes % 60)
  return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' }).format(date)
}

const formatMeetingDate = (dateValue) => new Intl.DateTimeFormat('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric',
}).format(new Date(`${dateValue}T12:00:00`))

const AgendaEditor = ({ meeting, onUpdateAgenda, onEditMeeting }) => {
  const [addOpen, setAddOpen] = useState(false)
  const [editingItemId, setEditingItemId] = useState(null)
  const [topicForm, setTopicForm] = useState(makeBlankTopic)
  const agenda = meeting?.agenda || []
  const totalMinutes = agenda.reduce((total, item) => total + Number(item.minutes), 0)
  const completedItems = agenda.filter((item) => item.complete).length
  const startTimeParts = (meeting?.startTime || '09:00').split(':').map(Number)
  const startTimeInMinutes = startTimeParts[0] * 60 + startTimeParts[1]
  const timedAgenda = agenda.map((item, index) => {
    const minutesBefore = agenda.slice(0, index).reduce((total, previousItem) => total + Number(previousItem.minutes), 0)
    const start = startTimeInMinutes + minutesBefore
    const end = start + Number(item.minutes)
    return { ...item, startLabel: formatClockTime(start), endLabel: formatClockTime(end) }
  })

  const updateTopicForm = (event) => {
    const { name, value } = event.target
    setTopicForm((currentForm) => ({ ...currentForm, [name]: value }))
  }

  const closeTopicForm = () => {
    setTopicForm(makeBlankTopic())
    setEditingItemId(null)
    setAddOpen(false)
  }

  const saveTopic = (event) => {
    event.preventDefault()
    const title = topicForm.title.trim()
    if (!meeting || !title || Number(topicForm.minutes) < 1) return

    if (editingItemId) {
      const updatedAgenda = agenda.map((item) => item.id === editingItemId
        ? { ...item, title, owner: topicForm.owner.trim(), minutes: Number(topicForm.minutes) }
        : item)
      onUpdateAgenda(meeting.id, updatedAgenda)
    } else {
      onUpdateAgenda(meeting.id, [
        ...agenda,
        {
          id: `topic-${Date.now()}`,
          title,
          owner: topicForm.owner.trim(),
          minutes: Number(topicForm.minutes),
          complete: false,
        },
      ])
    }

    closeTopicForm()
  }

  const editTopic = (item) => {
    setTopicForm({ title: item.title, owner: item.owner || '', minutes: item.minutes })
    setEditingItemId(item.id)
    setAddOpen(false)
  }

  const toggleComplete = (itemId) => {
    const updatedAgenda = agenda.map((item) => item.id === itemId
      ? { ...item, complete: !item.complete }
      : item)
    onUpdateAgenda(meeting.id, updatedAgenda)
  }

  const moveTopic = (itemId, direction) => {
    const currentIndex = agenda.findIndex((item) => item.id === itemId)
    const nextIndex = currentIndex + direction
    if (nextIndex < 0 || nextIndex >= agenda.length) return
    const updatedAgenda = [...agenda]
    const currentItem = updatedAgenda[currentIndex]
    updatedAgenda[currentIndex] = updatedAgenda[nextIndex]
    updatedAgenda[nextIndex] = currentItem
    onUpdateAgenda(meeting.id, updatedAgenda)
  }

  const removeTopic = (item) => {
    if (!window.confirm(`Remove "${item.title}" from this agenda?`)) return
    onUpdateAgenda(meeting.id, agenda.filter((agendaItem) => agendaItem.id !== item.id))
  }

  const openAddForm = () => {
    setEditingItemId(null)
    setTopicForm(makeBlankTopic())
    setAddOpen(true)
  }

  return (
    <section className={styles.editor} id="agenda" aria-labelledby="agenda-title">
      {meeting ? (
        <>
          <header className={styles['editor-heading']}>
            <div>
              <p className={styles.eyebrow}>THE RUN OF SHOW / 02</p>
              <h2 id="agenda-title">{meeting.title}</h2>
              <p className={styles['meeting-meta']}>
                {formatMeetingDate(meeting.date)} <span aria-hidden="true">/</span> {meeting.location}
              </p>
            </div>
            <div className={styles['heading-actions']}>
              <button className={styles['edit-meeting-button']} type="button" onClick={() => onEditMeeting(meeting)}>
                <LuPencil aria-hidden="true" /> <span>Edit meeting</span>
              </button>
              <button className={styles['add-topic-button']} type="button" onClick={openAddForm}>
                <LuPlus aria-hidden="true" /> <span>Add a topic</span>
              </button>
            </div>
          </header>

          <div className={styles['agenda-overview']}>
            <span><LuClock3 aria-hidden="true" /> Starts {formatClockTime(startTimeInMinutes)}</span>
            <strong>{totalMinutes} <small>minutes</small></strong>
            <span>{completedItems} of {agenda.length} topics checked off</span>
          </div>

          {agenda.length ? (
            <ol className={styles['topic-list']}>
              {timedAgenda.map((item, index) => (
                <li className={styles['topic-row']} key={item.id}>
                  <div className={styles['timeline-mark']}>
                    <button
                      className={`${styles['complete-button']} ${item.complete ? styles.completed : ''}`}
                      type="button"
                      aria-label={item.complete ? `Mark ${item.title} not discussed` : `Mark ${item.title} discussed`}
                      aria-pressed={item.complete}
                      onClick={() => toggleComplete(item.id)}
                    >
                      <LuCheck aria-hidden="true" />
                    </button>
                  </div>
                  <div className={`${styles['topic-card']} ${item.complete ? styles['topic-done'] : ''}`}>
                    {editingItemId === item.id ? (
                      <form className={styles['topic-form']} onSubmit={saveTopic}>
                        <div className={styles['form-fields']}>
                          <label>
                            <span>Topic</span>
                            <input name="title" value={topicForm.title} onChange={updateTopicForm} required autoFocus />
                          </label>
                          <label>
                            <span>Owner</span>
                            <input name="owner" value={topicForm.owner} onChange={updateTopicForm} placeholder="Assign a facilitator" />
                          </label>
                          <label>
                            <span>Minutes</span>
                            <input name="minutes" type="number" min="1" max="240" value={topicForm.minutes} onChange={updateTopicForm} required />
                          </label>
                        </div>
                        <div className={styles['form-actions']}>
                          <button className={styles['quiet-button']} type="button" onClick={closeTopicForm}>Cancel</button>
                          <button className={styles['save-button']} type="submit">Save topic</button>
                        </div>
                      </form>
                    ) : (
                      <>
                        <div className={styles['topic-topline']}>
                          <span className={styles['topic-time']}>{item.startLabel} - {item.endLabel}</span>
                          <span className={styles['topic-length']}>{item.minutes} min</span>
                        </div>
                        <h3 className={item.complete ? styles['topic-title-done'] : ''}>{item.title}</h3>
                        <p className={styles['topic-owner']}><LuUserRound aria-hidden="true" /> {item.owner || 'Facilitator to be assigned'}</p>
                        <div className={styles['topic-actions']}>
                          <button type="button" aria-label={`Move ${item.title} earlier`} disabled={index === 0} onClick={() => moveTopic(item.id, -1)}>
                            <LuArrowUp aria-hidden="true" />
                          </button>
                          <button type="button" aria-label={`Move ${item.title} later`} disabled={index === agenda.length - 1} onClick={() => moveTopic(item.id, 1)}>
                            <LuArrowDown aria-hidden="true" />
                          </button>
                          <button type="button" aria-label={`Edit ${item.title}`} onClick={() => editTopic(item)}>
                            <LuPencil aria-hidden="true" />
                          </button>
                          <button type="button" aria-label={`Remove ${item.title}`} onClick={() => removeTopic(item)}>
                            <LuTrash2 aria-hidden="true" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <div className={styles['empty-agenda']}>
              <strong>This agenda is still a blank page.</strong>
              <p>Add a topic and decide how much time it needs.</p>
              <button className={styles['quiet-button']} type="button" onClick={openAddForm}><LuPlus aria-hidden="true" /> Add the first topic</button>
            </div>
          )}

          {addOpen && (
            <form className={styles['topic-form']} onSubmit={saveTopic}>
              <p className={styles['form-heading']}>ADD TO THE RUN OF SHOW</p>
              <div className={styles['form-fields']}>
                <label>
                  <span>Topic</span>
                  <input name="title" value={topicForm.title} onChange={updateTopicForm} placeholder="What should the room cover?" required autoFocus />
                </label>
                <label>
                  <span>Owner</span>
                  <input name="owner" value={topicForm.owner} onChange={updateTopicForm} placeholder="Assign a facilitator" />
                </label>
                <label>
                  <span>Minutes</span>
                  <input name="minutes" type="number" min="1" max="240" value={topicForm.minutes} onChange={updateTopicForm} required />
                </label>
              </div>
              <div className={styles['form-actions']}>
                <button className={styles['quiet-button']} type="button" onClick={closeTopicForm}><LuX aria-hidden="true" /> Cancel</button>
                <button className={styles['save-button']} type="submit">Add topic</button>
              </div>
            </form>
          )}
        </>
      ) : (
        <div className={styles['empty-agenda']}>
          <p className={styles.eyebrow}>THE RUN OF SHOW / 02</p>
          <h2 id="agenda-title">Choose a meeting first.</h2>
          <p>Select a session from the meeting shelf to shape its agenda.</p>
        </div>
      )}
    </section>
  )
}

export default AgendaEditor
