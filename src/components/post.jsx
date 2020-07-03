import React from 'react'
import styles from './post.module.css'

const Post = ({ accent, html, frontmatter }) => (
  <article
    style={frontmatter.accent ? { '--color-accent': frontmatter.accent } : {}}
  >
    <header>
      <h1 className={styles.title}>{frontmatter.title}</h1>
      <h className={styles.divider}></h>
      <p>
        {frontmatter.date}&nbsp;
        {frontmatter.links &&
          frontmatter.links.map(l => (
            <span>
              •&nbsp;
              <span dangerouslySetInnerHTML={{ __html: l }} />
            </span>
          ))}
      </p>
    </header>
    <section
      className="markdown-body"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  </article>
)

export default Post
