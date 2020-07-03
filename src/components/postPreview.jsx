import React from 'react'
import { Link } from 'gatsby'
import style from './postPreview.module.css'

const PostPreview = ({ to, title, date, description, accent }) => (
  <div
    className={style.postprev}
    style={accent ? { '--color-accent': accent } : {}}
  >
    <Link to={to} class={style.postlink}>
      <header>
        <h3 className={style.title}>{title}</h3>
      </header>
      <div class={style.date}>{date}</div>
      <section>
        <div
          class={style.description}
          dangerouslySetInnerHTML={{ __html: description }}
        ></div>
      </section>
    </Link>
  </div>
)

export default PostPreview
