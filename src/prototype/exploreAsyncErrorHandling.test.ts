
import ''

describe("learn handle async error",() => {

    test('handle async error', async () => {
        const mySetError: jest.Mock = jest.fn()
        const error: Error = new Error('oops!')
        const myAsyncFunctionThatThrows: () => Promise<void> = async () => {
            throw error
        }
        const handleAsyncError: (setError:(e: unknown) => void) => (f: any) => () => Promise<void> =
            setError => f => async () => {
                try {
                    await f()
                } catch (e) {
                    setError(e)
                }
            }
        const myAsyncFunction: () => Promise<void> = handleAsyncError(mySetError)(myAsyncFunctionThatThrows)
        await myAsyncFunction()

        const actual: Array<any> = mySetError.mock.calls
        const expected: Array<Array<Error>> = [
            [error]
        ]

        expect(actual).toEqual(expected)
    })

})