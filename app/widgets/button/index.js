import React from 'react'
import styles from './button.scss'

export default ({ children }) =>
  <button className={styles.button}>{children}</button>
