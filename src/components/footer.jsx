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
      <div className={styles.content}>
        <span className={styles.contentLeft}>
          <a
            className={styles.footerLink}
            href={`https://linked.com/in/${social.linkedin}`}
          >
            LinkedIn
          </a>
          &nbsp;•&nbsp;
          <a
            className={styles.footerLink}
            href={`https://github.com/${social.github}`}
          >
            GitHub
          </a>
          &nbsp;•&nbsp;
          <a
            className={styles.footerLink}
            href={`https://twitter.com/${social.linkedin}`}
          >
            Twitter
          </a>
        </span>
        <span className={`${styles.contentRight}`}>
          <a className={styles.footerLink} href="/rss.xml">
            RSS
          </a>
        </span>
      </div>
    </div>
  )
}

export default Footer
