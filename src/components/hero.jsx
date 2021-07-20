import * as React from 'react'
import * as styles from './hero.module.css'

const Hero = ({ imgSrc, title, children }) => {
  return (
    <div className={styles.hero}>
      <img className={styles.image} src={imgSrc} />
      <div className={styles.vignette} />
      <>{children}</>
    </div>
  )
}

export default Hero
