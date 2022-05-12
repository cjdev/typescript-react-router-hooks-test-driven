
import ''

// https://jestjs.io/docs/mock-functions
describe('learn spies aka mock functions', () => {

    test('spy aka mock function', () => {
        const myFunction: jest.Mock = jest.fn()

        const four: number = 4
        myFunction.mockReturnValueOnce(four)

        const five: number = 5
        myFunction.mockReturnValueOnce(five)

        const firstCall: number = myFunction(1)
        expect(firstCall).toBe(4)

        const secondCall: number = myFunction(2, 3)
        expect(secondCall).toBe(5)

        const thirdCall: number = myFunction()
        expect(thirdCall).toBe(undefined)

        const mock: jest.MockContext<number, Array<number>> = myFunction.mock
        const actualMockCalls: Array<Array<number>> = mock.calls
        const expectedMockCalls: Array<Array<number>>  = [
            [1], [2,3], []
        ]
        expect(actualMockCalls).toEqual(expectedMockCalls)
    })

})