import React from 'react'
import styles from './logoMinimal.module.css'

const LogoMinimalSmall = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="32"
    height="32"
    viewBox="0 0 8 8"
    version="1.1"
  >
    <path
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      stroke="#000"
      d="M 4,7 h -3 l 3,-5 3,5"
      className={styles.logoPath}
    />
  </svg>
)

export default LogoMinimalSmall
