import styles from './App.module.css'

const App = () => (
  <div className={styles.app}>
    <main className={styles.workspace}>
      <p className={styles.kicker}>ROOMNOTE / MEETING PLANNER</p>
      <section className={styles.opening}>
        <p className={styles.eyebrow}>GOOD MEETINGS START BEFORE THE ROOM FILLS</p>
        <h1>Make the hour count.</h1>
        <p className={styles.introCopy}>
          Shape a clear agenda, give every topic its time, and leave with decisions everyone can act on.
        </p>
      </section>
      <div className={styles.setupNote}>
        <span className={styles.noteNumber}>01</span>
        <p>Your planning room is ready to take shape.</p>
      </div>
    </main>
  </div>
)

export default App
