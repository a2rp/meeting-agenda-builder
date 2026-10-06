import { FaFacebookF, FaGithub, FaLinkedinIn, FaPatreon, FaYoutube } from 'react-icons/fa'
import { LuCoffee, LuCode, LuCodepen, LuGlobe, LuHeart, LuMail } from 'react-icons/lu'
import styles from './styles.module.css'

const footerLinks = [
  { label: 'Portfolio', href: 'https://www.ashishranjan.net', icon: <LuGlobe aria-hidden="true" /> },
  { label: 'GitHub', href: 'https://github.com/a2rp', icon: <FaGithub aria-hidden="true" /> },
  { label: 'CodePen', href: 'https://codepen.io/ash1198', icon: <LuCodepen aria-hidden="true" /> },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/aashishranjan', icon: <FaLinkedinIn aria-hidden="true" /> },
  { label: 'Facebook', href: 'https://www.facebook.com/theash.ashish/', icon: <FaFacebookF aria-hidden="true" /> },
  { label: 'YouTube', href: 'https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1', icon: <FaYoutube aria-hidden="true" /> },
  { label: 'Email', href: 'mailto:ash.ranjan09@gmail.com', icon: <LuMail aria-hidden="true" /> },
  { label: 'Support', href: 'https://a2rp-donation-page.netlify.app/', icon: <LuHeart aria-hidden="true" /> },
  { label: 'Buy Me a Coffee', href: 'https://buymeacoffee.com/ashishranjan', icon: <LuCoffee aria-hidden="true" /> },
  { label: 'Patreon', href: 'https://www.patreon.com/ashishranjan', icon: <FaPatreon aria-hidden="true" /> },
  { label: 'Source code', href: 'https://github.com/a2rp/meeting-agenda-builder', icon: <LuCode aria-hidden="true" /> },
]

const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles['footer-left']}>
      <a className={styles['footer-logo']} href="https://www.ashishranjan.net" target="_blank" rel="noreferrer">
        <img src={`${import.meta.env.BASE_URL}logo.png`} alt="Ashish Ranjan" />
      </a>
      <p>© {new Date().getFullYear()} <a href="https://github.com/a2rp" target="_blank" rel="noreferrer">Ashish Ranjan</a>. All rights reserved.</p>
    </div>
    <nav className={styles['footer-links']} aria-label="Footer links">
      {footerLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target={link.href.startsWith('mailto:') ? undefined : '_blank'}
          rel={link.href.startsWith('mailto:') ? undefined : 'noreferrer'}
        >
          {link.icon}<span>{link.label}</span>
        </a>
      ))}
    </nav>
  </footer>
)

export default Footer
