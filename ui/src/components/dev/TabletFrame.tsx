import { ReactNode, RefObject, useEffect, useState } from 'react'
import './TabletFrame.css'

export default function TabletFrame({ children, ref }: { children: ReactNode; ref: RefObject<HTMLDivElement> }) {
    const [time, setTime] = useState('00:00')

    useEffect(() => {
        const interval = setInterval(() => {
            const date = new Date()

            setTime(`${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`)
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    return (
        <div ref={ref} className='tablet-frame'>
            <div className='tablet-time'>{time}</div>
            <div className='tablet-indicator'></div>
            <div className='tablet-content'>{children}</div>
        </div>
    )
}
