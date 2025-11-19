import { useCallback, useEffect } from "react";

const useKeyHook = (handler: (key: string) => void) => {
    const keydownHandler = useCallback((event: KeyboardEvent) => {
        handler(event.key);
    }, [handler]);

    useEffect(() => {
        window.addEventListener('keydown', keydownHandler);

        return () => {
            window.removeEventListener('keydown', keydownHandler);
        };
    }, [keydownHandler]);
}

export default useKeyHook;