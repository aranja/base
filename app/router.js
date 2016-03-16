import React from 'react'
import { Router as ReactRouter, browserHistory } from 'react-router'

export const history = browserHistory
export const Router = () =>
  <ReactRouter history={history} />
