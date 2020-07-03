import React from 'react'
import styles from './footer.module.css'

const Footer = () => (
  <div>
    <h className={styles.divider}></h>
    <div className={`${styles.content} markdown-body`}>
      <a href="/rss.xml">RSS</a>
    </div>
  </div>
)

export default Footer
