import { useEffect, useRef, useState } from 'react'
import { FaGithub } from 'react-icons/fa'
import { LuNotebookPen, LuMenu, LuX } from 'react-icons/lu'
import styles from './styles.module.css'

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return undefined

    const closeOnOutsideClick = (event) => {
      if (!headerRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <header className={styles.header} ref={headerRef}>
      <a className={styles.brand} href="#top" onClick={closeMenu} aria-label="Roomnote home">
        <span className={styles['brand-mark']}><LuNotebookPen aria-hidden="true" /></span>
        <span className={styles.wordmark}>roomnote<span>.</span></span>
      </a>

      <nav
        className={`${styles.navigation} ${menuOpen ? styles['navigation-open'] : ''}`}
        id="primary-navigation"
        aria-label="Main navigation"
      >
        <a href="#overview" onClick={closeMenu}>Overview</a>
        <a href="#meetings" onClick={closeMenu}>Meetings</a>
        <a href="#agenda" onClick={closeMenu}>Agenda</a>
        <a href="#notes" onClick={closeMenu}>Notes</a>
      </nav>

      <a
        className={styles.repository}
        href="https://github.com/a2rp/meeting-agenda-builder"
        aria-label="Open the public GitHub repository"
        target="_blank"
        rel="noreferrer"
      >
        <FaGithub aria-hidden="true" /> <span>Repository</span>
      </a>

      <button
        className={styles['menu-toggle']}
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
      </button>
    </header>
  )
}

export default Header
