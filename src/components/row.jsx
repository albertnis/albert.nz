import React from 'react'
import style from './row.module.css'

const Row = ({ styles, children }) => (
  <div className={style.row} style={styles}>
    <div className={style.content}>{children}</div>
  </div>
)

export default Row
