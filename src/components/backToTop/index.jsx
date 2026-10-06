import { useEffect, useState } from 'react'
import { LuArrowUp } from 'react-icons/lu'
import styles from './styles.module.css'

const BackToTop = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => setVisible(window.scrollY > 420)
    window.addEventListener('scroll', updateVisibility, { passive: true })
    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  if (!visible) return null

  return (
    <button
      className={styles.button}
      type="button"
      aria-label="Back to top"
      title="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
    >
      <LuArrowUp aria-hidden="true" />
    </button>
  )
}

export default BackToTop
