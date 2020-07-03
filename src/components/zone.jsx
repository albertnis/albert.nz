import React from 'react'
import styles from './zone.module.css'

const Zone = ({ style, children }) => (
  <div className={styles.zone} style={{ style }}>
    {children}
  </div>
)

export default Zone
