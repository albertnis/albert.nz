import React from 'react'
import * as styles from './bioPreview.module.css'
import { StaticImage } from 'gatsby-plugin-image'
import { useStaticQuery, graphql } from 'gatsby'

const BioPreview = ({ style }) => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            github
            email
            linkedin
          }
        }
      }
    }
  `)
  const { social } = data.site.siteMetadata
  return (
    <div className={styles.biopreview} style={{ style }}>
      <StaticImage
        alt="Photo of Albert"
        className={styles.avatar}
        src="../../content/assets/profile-crop.jpg"
        width={120}
        height={120}
        quality={95}
        layout="fixed"
        formats={['AUTO', 'WEBP', 'AVIF']}
      />
      <div className={`markdown-body ${styles.tagline}`}>
        <h5>Kia ora!</h5>
        <p>
          I'm Albert, a Christchurch-based software developer. I blog about
          things that are interesting to me: these days that's largely home
          automation, electronics and the outdoors. Find me on{' '}
          <a href={`https://linkedin.com/in/${social.linkedin}`}>LinkedIn</a>{' '}
          and <a href={`https://github.com/${social.github}`}>GitHub</a>.{' '}
        </p>
      </div>
    </div>
  )
}

export default BioPreview
