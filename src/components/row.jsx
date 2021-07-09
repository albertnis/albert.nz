import React from 'react'
import * as style from './row.module.css'

const Row = ({ styles, children, title }) => (
  <div className={style.row} style={styles}>
    {title && <div className={style.title}>{title}</div>}
    <div className={style.content}>{children}</div>
  </div>
)

export default Row
