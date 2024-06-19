import { useEffect, useState } from "react";

export function useDebounce(query: string, timer: number) {

    const [debouncer, setDebouncer] = useState<string>('')

    useEffect(() => {

        const timeoutId = setTimeout(() => {
            setDebouncer(query)
        }, timer)
        return () => clearTimeout(timeoutId)
    }, [query, timer])

    return debouncer
}