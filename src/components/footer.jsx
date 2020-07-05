import React from 'react'
import styles from './footer.module.css'
import { useStaticQuery } from 'gatsby'

const Footer = () => {
  const data = useStaticQuery(graphql`
    query FooterQuery {
      site {
        siteMetadata {
          social {
            github
            email
            linkedin
            twitter
          }
        }
      }
    }
  `)
  const { social } = data.site.siteMetadata
  return (
    <div>
      <h className={styles.divider}></h>
      <div className={`${styles.content} markdown-body`}>
        <span className={`${styles.contentLeft}`}>
          <a href={`https://linked.com/in/${social.linkedin}`}>LinkedIn</a>
          &nbsp;•&nbsp;
          <a href={`https://github.com/${social.github}`}>GitHub</a>
          &nbsp;•&nbsp;
          <a href={`https://twitter.com/${social.linkedin}`}>Twitter</a>
        </span>
        <span className={`${styles.contentRight}`}>
          <a href="/rss.xml">RSS</a>
        </span>
      </div>
    </div>
  )
}

export default Footer
