import PhoneFunctions from '@/functions/phone-functions'
import TabletFunctions from '@/functions/tablet-functions'

type Media = {
    id: number
    src: string
    timestamp?: number

    type?: string
    favourite?: boolean
    isVideo?: boolean

    size?: number

    duration?: number
}

type GalleryOptions = {
    includeVideos?: boolean
    includeImages?: boolean
    allowExternal?: boolean
    multiSelect?: boolean

    onSelect: (media: Media | Media[]) => void
}

const compatibilityFunctions = {
    setGallery: (options: GalleryOptions) => {
        return globalThis?.components?.setGallery(options)
    },
    setIndicatorVisible: (visible: boolean) => {
        if (globalThis?.components?.setHomeIndicatorVisible) {
            return globalThis.components.setHomeIndicatorVisible(visible)
        } else if (globalThis?.setIndicatorVisible) {
            return globalThis.setIndicatorVisible(visible)
        }
    },
    onNuiEvent: <T>(eventName: string, cb: (data: T) => void) => {
        if (globalThis?.onNuiEvent) {
            return globalThis.onNuiEvent(eventName, cb)
        } else if (globalThis?.useNuiEvent) {
            return globalThis.useNuiEvent(eventName, cb)
        }
    }
}

const SharedFunctions = new Proxy(compatibilityFunctions, {
    get(target, prop) {
        return target[prop] || PhoneFunctions[prop] || TabletFunctions[prop]
    }
}) as (typeof PhoneFunctions | typeof TabletFunctions) & typeof compatibilityFunctions

export default SharedFunctions
