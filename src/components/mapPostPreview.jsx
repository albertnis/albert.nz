import React from 'react'
import { Link } from 'gatsby'
import * as styles from './mapPostPreview.module.css'

const MapPostPreview = ({ title, description, slug, accent }) => (
  <div
    className={styles.mapPostPreview}
    style={accent ? { '--color-accent': accent } : {}}
  >
    <Link className={styles.link} to={slug}>
      <div className={styles.leftContent}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
      </div>
      <div className={styles.rightContent}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 8 8"
          version="1.1"
          className={styles.arrow}
        >
          <path
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            stroke="#000"
            d="M 1,1 L 4,4 L 1,7"
            className={styles.logoPath}
          />
        </svg>
      </div>
    </Link>
  </div>
)

export default MapPostPreview
