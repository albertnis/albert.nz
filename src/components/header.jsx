import React from 'react'
import { Link } from 'gatsby'
import Logo from './logo'
import style from './header.module.css'

const Header = () => (
  <div className={style.container}>
    <Link to={`/`} className={style.link}>
      <div className={style.content}>
        <div className={style.logoWrapper}>
          <Logo />
        </div>
        <div className={style.title}>
          <h1>Albert Nisbet</h1>
        </div>
      </div>
    </Link>
  </div>
)

export default Header
