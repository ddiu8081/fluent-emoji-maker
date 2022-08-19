/* @refresh reload */
import { render } from 'solid-js/web'
import '@unocss/reset/eric-meyer.css'
import 'uno.css'
import './style.css'

import App from './App'

render(() => <App />, document.getElementById('root') as HTMLElement)
