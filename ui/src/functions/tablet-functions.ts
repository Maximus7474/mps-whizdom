export type TabletSettings = {
    airplaneMode: boolean
    streamerMode: boolean
    apps: any
    display: {
        brightness: number
        size: number
        theme: 'light' | 'dark'
        automatic: boolean
        frameColor: string
    }
    notifications?: {
        [key: string]: {
            enabled: boolean
            sound: boolean
        }
    }
    sound: {
        volume: number
        silent: boolean
        texttone: string
    }
    lockscreen: {
        color: string
        fontStyle: number
        layout: number
    }
    locale: string
    wallpaper: {
        background: string
        blur: boolean
    }
    time: {
        twelveHourClock: boolean
    }

    name?: string
    version: string
    latestVersion: string

    [key: string]: any
}

type PopUpInput = Partial<HTMLInputElement> & {
    minCharacters?: number
    maxCharacters?: number
    onChange?: (value: string) => void
}

type PopUpTextarea = Partial<HTMLTextAreaElement> & {
    minCharacters?: number
    maxCharacters?: number
    onChange?: (value: string) => void
}

type PopUp = {
    title: string
    description?: string
    vertical?: boolean

    inputs?: PopUpInput[]
    input?: PopUpInput
    textareas?: PopUpTextarea[]
    textarea?: PopUpTextarea

    attachment?: {
        src: string
    }

    buttons: {
        title: string
        cb?: () => void
        disabled?: boolean
        bold?: boolean

        color?: 'red' | 'blue'
    }[]
}

type ContextMenu = {
    title?: string
    buttons: {
        title: string
        color?: 'red' | 'blue'
        disabled?: boolean
        cb?: () => void
    }[]
}

type Photo = {
    id: number
    src: string
    timestamp?: number

    type?: string
    favourite?: boolean
    isVideo?: boolean

    size?: number

    duration?: number
}

type Gallery = {
    includeVideos?: boolean
    includeImages?: boolean
    allowExternal?: boolean
    multiSelect?: boolean

    onSelect: (data: Photo) => void
}

type ColorPicker = {
    defaultColor?: string
    onSelect: (color: string) => void
    onClose?: (color: string) => void
}

type TabletComponentsFunctions = {
    setApp: (app: string | { name: string; data?: any }) => void
    closeApp: () => void
    setPopUp: (popUp: PopUp) => void
    setFullScreenImage: (image: string) => void
    setContextMenu: (contextMenu: ContextMenu) => void
    setControlCentreVisible: (visible: boolean) => void
    setGallery: (options: Gallery) => void
    setColorPicker: (options: ColorPicker) => void
    setIndicatorVisible: (visible: boolean) => void
}

const TabletFunctions = globalThis as any as {
    resourceName: string
    appName: string
    settings: TabletSettings
    components: TabletComponentsFunctions

    fetchNui: <T>(eventName: string, data?: unknown, mockData?: T) => Promise<T>
    onNuiEvent: <T>(eventName: string, cb: (data: T) => void) => void
    onSettingsChange: (cb: (settings: TabletSettings) => void) => void
} & TabletComponentsFunctions

export default TabletFunctions
