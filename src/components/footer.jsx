import React from 'react'
import styles from './footer.module.css'
import { useStaticQuery, Link } from 'gatsby'
import LogoMini from './logoMini'

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
    <div className={styles.footer}>
      <div>
        <div className={styles.links}>
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
        </div>
        <div>
          <span>
            <a className={styles.footerLink} href="/rss.xml">
              RSS
            </a>
          </span>
        </div>
      </div>
      <div>
        <Link to="/">
          <LogoMini />
        </Link>
      </div>
    </div>
  )
}

export default Footer
