
export const handleAsyncError = async (
    setError: ((error: Error | undefined) => void),
    f: Function,
    ...args: Array<any>
) => {
    try {
        return await f(...args)
    } catch (e) {
        const err: Error = e as Error
        setError(err)
    }
}
