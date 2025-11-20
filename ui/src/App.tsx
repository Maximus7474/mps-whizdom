import { type ReactNode, useEffect, useRef } from 'react'
import { Route, Routes } from 'react-router-dom'
import TabletFrame from '@/components/dev/TabletFrame'
import PhoneFrame from '@/components/dev/PhoneFrame'
import { DeviceType } from './types'
import { DEV_MODE } from './utils/misc'

import Page from './components/PageView'
import { GamePage } from './pages'

import './App.css'

const App = () => {
    useEffect(() => {
        if (DEV_MODE) {
            document.documentElement.style.visibility = 'visible';
            document.body.style.visibility = 'visible';
            return
        } else {
            if (!globalThis.GetParentResourceName) {
                document.body.style.visibility = 'visible';
            }
        }
    }, []);

    return (
        <AppProvider>
            {(device) => (
                <div className='app'>
                    <div
                        className='app-wrapper'
                        style={{
                            height: DEV_MODE ? '100%' : '100vh'
                        }}
                    >
                        <Routes>
                            <Route
                                path='game'
                                element={<Page children={<GamePage device={device} />} />}
                            />
                            <Route
                                path='*'
                                element={<Page children={<p>Wooooops</p>} />}
                            />
                        </Routes>                        
                    </div>
                </div>
            )}
        </AppProvider>
    )
}

const AppProvider = ({ children }: { children: (device: DeviceType) => ReactNode }) => {
    if (DEV_MODE) {
        const tabletFrameRef = useRef<HTMLDivElement>(null)
        const phoneFrameRef = useRef<HTMLDivElement>(null)

        const handleResize = () => {
            const { innerWidth, innerHeight } = window

            const aspectRatio = innerWidth / innerHeight

            if (aspectRatio < 14 / 9) {
                if (phoneFrameRef.current) {
                    phoneFrameRef.current.style.fontSize = '0.9vw'
                }

                if (tabletFrameRef.current) {
                    tabletFrameRef.current.style.fontSize = '1.16vw'
                }
            } else {
                if (phoneFrameRef.current) {
                    phoneFrameRef.current.style.fontSize = '1.37vh'
                }

                if (tabletFrameRef.current) {
                    tabletFrameRef.current.style.fontSize = '1.78vh'
                }
            }
        }

        useEffect(() => {
            handleResize()

            window.addEventListener('resize', handleResize)

            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }, [])

        handleResize()

        return (
            <div className='dev-wrapper'>
                <TabletFrame ref={tabletFrameRef}>{children('tablet')}</TabletFrame>
                <PhoneFrame ref={phoneFrameRef}>{children('phone')}</PhoneFrame>
            </div>
        )
    } else {
        return <>{children(document.body.getAttribute('data-device') as DeviceType)}</>
    }
}

export default App
