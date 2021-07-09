import React from 'react'
import * as styles from './bioPreview.module.css'
import Image from 'gatsby-image'
import { useStaticQuery, graphql } from 'gatsby'

const BioPreview = ({ style }) => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      avatar: file(absolutePath: { regex: "/profile-crop.jpg/" }) {
        childImageSharp {
          fixed(width: 100, height: 100, quality: 100) {
            ...GatsbyImageSharpFixed
          }
        }
      }
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
      <Image
        fixed={data.avatar.childImageSharp.fixed}
        className={styles.avatar}
      />
      <div className={`markdown-body ${styles.tagline}`}>
        <h5>Kia ora!</h5>
        <p>
          I'm Albert, a developer living and working in Wellington. I'm into
          engineering, home automation and electronics. Find me on{' '}
          <a href={`https://linkedin.com/in/${social.linkedin}`}>LinkedIn</a>{' '}
          and <a href={`https://github.com/${social.github}`}>GitHub</a>, or{' '}
          <a href={`mailto:${social.email}`}>send an email</a>.{' '}
        </p>
      </div>
    </div>
  )
}

export default BioPreview
