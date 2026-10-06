import styles from './App.module.css'
import Header from './components/header/index.jsx'

const App = () => (
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
      <section className={styles.placeholder} id="meetings" aria-labelledby="meetings-title">
        <p className={styles.sectionLabel}>YOUR WEEK / 01</p>
        <h2 id="meetings-title">Meetings, in good order.</h2>
        <p>Your upcoming sessions will appear here.</p>
      </section>
      <section className={styles.placeholder} id="agenda" aria-labelledby="agenda-title">
        <p className={styles.sectionLabel}>THE RUN OF SHOW / 02</p>
        <h2 id="agenda-title">A little structure goes a long way.</h2>
        <p>Each topic will have an owner, a timebox, and a clear next step.</p>
      </section>
      <section className={styles.placeholder} id="notes" aria-labelledby="notes-title">
        <p className={styles.sectionLabel}>AFTER THE MEETING / 03</p>
        <h2 id="notes-title">Close with what comes next.</h2>
        <p>Decisions and follow-ups will stay with the meeting they came from.</p>
      </section>
    </main>
  </div>
)

export default App
