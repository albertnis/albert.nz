import React from 'react'
import { Link } from 'gatsby'
import * as styles from './mapPostPreview.module.css'

const MapPostPreview = ({ title, description, slug, accent }) => (
  <div
    className={styles.mapPostPreview}
    style={accent ? { '--color-accent': accent } : {}}
  >
    <Link className={styles.link} to={slug}>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.description}>{description}</p>
    </Link>
  </div>
)

export default MapPostPreview
