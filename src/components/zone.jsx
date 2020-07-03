import React from 'react'
import styles from './zone.module.css'

const Zone = ({ style, children, className }) => (
  <div className={`${className} ${styles.zone}`} style={{ style }}>
    {children}
  </div>
)

export default Zone
