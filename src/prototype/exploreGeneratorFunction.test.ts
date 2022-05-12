
import ''

describe("learn generator", () => {

    test('simple generator - return ends iterator', () => {

        const generatorFxn: () => Generator<number | undefined> = function* foo() {
            yield 1
            yield 2
            yield 3
            return 4
            yield 5
        }

        const iterator: Generator<number | undefined> = generatorFxn()

        const one: IteratorYieldResult<number | undefined> | IteratorReturnResult<any> =
            iterator.next()
        const oneExpected: IteratorYieldResult<number> =
            {done: false, value: 1}
        expect(one).toEqual(oneExpected)

        const two: IteratorYieldResult<number | undefined> | IteratorReturnResult<any> =
            iterator.next()
        const twoExpected: IteratorYieldResult<number | undefined> =
            { done: false, value: 2 }
        expect(two).toEqual(twoExpected)

        const three: IteratorYieldResult<number | undefined> | IteratorReturnResult<any> =
            iterator.next()
        const threeExpected: IteratorYieldResult<number> =
            { done: false, value: 3 }
        expect(three).toEqual(threeExpected)

        const four: IteratorYieldResult<number | undefined> | IteratorReturnResult<any> =
            iterator.next()
        const fourExpected: IteratorReturnResult<number> =
            { done: true, value: 4 }
        expect(four).toEqual(fourExpected)

        const five: IteratorYieldResult<number | undefined> | IteratorReturnResult<any> =
            iterator.next()
        const fiveExpected: IteratorReturnResult<number | undefined> =
            { done: true, value: undefined }
        expect(five).toEqual(fiveExpected)

    })

    test('yield array', () => {

        // need the '| undefined' to stop intellij from showing error for four, even though the code runs and works
        const myGenerator: () => Generator<number | undefined> = function* () {
            yield* [1, 2, 3]
        }
        const iterator: Iterator<number | undefined> = myGenerator()

        const one: IteratorYieldResult<number | undefined> | IteratorReturnResult<any> =
            iterator.next()
        const oneExpected: IteratorYieldResult<number| undefined> =
            {done: false, value: 1}
        expect(one).toEqual(oneExpected)

        const two: IteratorYieldResult<number| undefined> | IteratorReturnResult<any> =
            iterator.next()
        const twoExpected: IteratorYieldResult<number| undefined> =
            { done: false, value: 2 }
        expect(two).toEqual(twoExpected)

        const three: IteratorYieldResult<number | undefined> | IteratorReturnResult<any> =
            iterator.next()
        const threeExpected: IteratorYieldResult<number | undefined> =
            { done: false, value: 3 }
        expect(three).toEqual(threeExpected)

        const four: IteratorYieldResult<number | undefined> | IteratorReturnResult<any> =
            iterator.next()
        const fourExpected: IteratorReturnResult<number | undefined > =
            { done: true, value: undefined }
        expect(four).toEqual(fourExpected)

    })

    test('send data back to generator, throw',() => {
        const myGenerator: () => Generator<string> = function* () {
            const one: any = yield 'one is special'
            const two: any = yield 'two ' + one
            throw("throw three error " + two)
        }
        const iterator = myGenerator()

        const one: IteratorYieldResult<string> | IteratorReturnResult<any> =
            iterator.next("first parameter not used")
        const oneExpected: IteratorYieldResult<string> =
            {done: false, value: "one is special"}
        expect(one).toEqual(oneExpected)

        const two: IteratorYieldResult<string> | IteratorReturnResult<any> =
            iterator.next("= 2")
        const twoExpected: IteratorYieldResult<string> =
            {done: false, value: "two = 2"}
        expect(two).toEqual(twoExpected)

        const three: () => IteratorYieldResult<string> | IteratorReturnResult<any> =
            () => iterator.next("= 3")
        const threeExpected: string = "throw three error = 3"
        expect(three).toThrow(threeExpected)

    })
})