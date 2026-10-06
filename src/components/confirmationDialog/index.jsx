import { useEffect } from 'react'
import { LuTrash2, LuX } from 'react-icons/lu'
import styles from './styles.module.css'

const ConfirmationDialog = ({
  title,
  description,
  itemName,
  confirmLabel,
  onClose,
  onConfirm,
}) => {
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [onClose])

  const confirmRemoval = () => {
    onConfirm()
    onClose()
  }

  return (
    <div
      className={styles.backdrop}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <header className={styles['dialog-header']}>
          <span className={styles['dialog-icon']}><LuTrash2 aria-hidden="true" /></span>
          <div>
            <p className={styles.eyebrow}>PLEASE CONFIRM</p>
            <h2 id="confirmation-dialog-title">{title}</h2>
          </div>
          <button className={styles['close-button']} type="button" onClick={onClose} aria-label="Close confirmation">
            <LuX aria-hidden="true" />
          </button>
        </header>

        <div className={styles['dialog-body']}>
          <p id="confirmation-dialog-description">{description}</p>
          {itemName && <strong className={styles['item-name']}>{itemName}</strong>}
        </div>

        <footer className={styles['dialog-footer']}>
          <button className={styles['cancel-button']} type="button" onClick={onClose} autoFocus>
            Keep it
          </button>
          <button className={styles['confirm-button']} type="button" onClick={confirmRemoval}>
            {confirmLabel}
          </button>
        </footer>
      </section>
    </div>
  )
}

export default ConfirmationDialog
