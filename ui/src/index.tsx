import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from '@/App'

import './colors.css'
import './index.css'

const DEV_MODE = !window?.['invokeNative']
const root = ReactDOM.createRoot(document.getElementById('root'))

if (window.name === '' || DEV_MODE) {
    const renderApp = () => {
        root.render(
            <React.StrictMode>
                <HashRouter>
                    <App />
                </HashRouter>
            </React.StrictMode>
        )
    }

    if (DEV_MODE) {
        renderApp()
    } else {
        window.addEventListener('message', (event) => {
            if (event.data === 'componentsLoaded') {
                renderApp()
            }
        })
    }
}
