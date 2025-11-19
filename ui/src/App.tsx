import { ChangeEvent, ReactNode, useEffect, useRef, useState } from 'react'
import TabletFrame from '@/components/dev/TabletFrame'
import PhoneFrame from '@/components/dev/PhoneFrame'
import SharedFunctions from '@/functions/shared-functions'

import './App.css'

const DEV_MODE = !window?.['invokeNative']

const App = () => {
    const [direction, setDirection] = useState('N')
    const [indicatorVisible, setIndicatorVisible] = useState(true)
    const [notificationText, setNotificationText] = useState('Notification text')

    useEffect(() => {
        if (DEV_MODE) {
            document.documentElement.style.visibility = 'visible'
            document.body.style.visibility = 'visible'
            return
        } else {
            if (!globalThis.GetParentResourceName) {
                document.body.style.visibility = 'visible'
            }
        }

        SharedFunctions.onNuiEvent<string>('updateDirection', (direction) => {
            setDirection(direction)
        })
    }, [])

    useEffect(() => {
        if (notificationText === '') {
            setNotificationText('Notification text')
        }
    }, [notificationText])

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
                        <div className='header'>
                            <div className='title'>Custom App Template</div>
                            <div className='subtitle'>Phone & Tablet - React TS</div>
                            <a className='subtitle'>{direction}</a>
                        </div>
                        <div className='button-wrapper'>
                            <button
                                id='button'
                                onClick={() => {
                                    SharedFunctions.components.setPopUp({
                                        title: 'Popup Menu',
                                        description: 'Confirm your choice',
                                        buttons: [
                                            {
                                                title: 'Cancel',
                                                color: 'red',
                                                cb: () => {
                                                    console.log('Cancel')
                                                }
                                            },
                                            {
                                                title: 'Confirm',
                                                color: 'blue',
                                                cb: () => {
                                                    console.log('Confirm')
                                                }
                                            }
                                        ]
                                    })
                                }}
                            >
                                Popup Menu
                            </button>
                            <button
                                id='context'
                                onClick={() => {
                                    SharedFunctions.components.setContextMenu({
                                        title: 'Context menu',
                                        buttons: [
                                            {
                                                title: `${device === 'phone' ? 'Phone' : 'Tablet'} Notification`,
                                                color: 'blue',
                                                cb: () => {
                                                    SharedFunctions.fetchNui('notification', {
                                                        type: 'tablet',
                                                        message: notificationText
                                                    })
                                                }
                                            },
                                            {
                                                title: 'GTA Notification',
                                                color: 'red',
                                                cb: () => {
                                                    SharedFunctions.fetchNui('notification', {
                                                        type: 'gta',
                                                        message: notificationText
                                                    })
                                                }
                                            }
                                        ]
                                    })
                                }}
                            >
                                Context menu
                            </button>

                            <button
                                id='gallery'
                                onClick={() => {
                                    SharedFunctions.setGallery({
                                        allowExternal: true,
                                        includeImages: true,
                                        includeVideos: true,
                                        multiSelect: false,

                                        onSelect(media) {
                                            SharedFunctions.components.setPopUp({
                                                title: 'Selected Media',
                                                attachment: {
                                                    src: Array.isArray(media) ? media[0].src : media.src
                                                },
                                                buttons: [
                                                    {
                                                        title: 'OK'
                                                    }
                                                ]
                                            })
                                        }
                                    })
                                }}
                            >
                                Gallery Selector
                            </button>
                            <button
                                id='indicator'
                                onClick={() => {
                                    SharedFunctions.setIndicatorVisible(!indicatorVisible)

                                    setIndicatorVisible(!indicatorVisible)
                                }}
                            >
                                {indicatorVisible ? 'Hide Indicator' : 'Show Indicator'}
                            </button>
                            <button
                                id='colorpicker'
                                onClick={() => {
                                    SharedFunctions.components.setColorPicker({
                                        onSelect(color) {},
                                        onClose(color) {
                                            SharedFunctions.components.setPopUp({
                                                title: 'Selected color',
                                                description: color,
                                                buttons: [
                                                    {
                                                        title: 'OK'
                                                    }
                                                ]
                                            })
                                        }
                                    })
                                }}
                            >
                                Color Picker
                            </button>

                            <input
                                placeholder='Notification text'
                                onChange={(e: ChangeEvent<HTMLInputElement>) => setNotificationText(e.target.value)}
                            ></input>
                        </div>
                    </div>
                </div>
            )}
        </AppProvider>
    )
}

const AppProvider = ({ children }: { children: (device: 'phone' | 'tablet') => ReactNode }) => {
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
        return <>{children(document.body.getAttribute('data-device') as 'phone' | 'tablet')}</>
    }
}

export default App
