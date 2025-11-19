import React from 'react'
import ReactDOM from 'react-dom/client'
import App from '@/App'

import './colors.css'
import './index.css'

const DEV_MODE = !window?.['invokeNative']
const root = ReactDOM.createRoot(document.getElementById('root'))

if (window.name === '' || DEV_MODE) {
    const renderApp = () => {
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        )
    }

    console.log(1)

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
