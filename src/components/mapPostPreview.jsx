import React from 'react'
import { Link } from 'gatsby'

const MapPostPreview = ({ title, description, slug }) => (
  <div>
    <Link to={slug}>
      <h3>{title}</h3>
      <p>{description}</p>
    </Link>
  </div>
)

export default MapPostPreview
