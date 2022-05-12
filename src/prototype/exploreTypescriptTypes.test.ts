
import ''

describe("learning Typescript types", () => {

    // for working through the following -- https://www.typescriptlang.org/docs/handbook/basic-types.html#table-of-contents

    test('boolean and Boolean', () => {
        // This code works despite the error for '0n' below that is showing up in Intellij
        // Error: TS2737: BigInt literals are not available when targeting lower than ES2020
        const falsyValues: (string | number | bigint | null | undefined)[] = [
            '',
            0,
            -0,
            BigInt(0),
            "",
            null,
            undefined,
            NaN
        ]
        falsyValues.forEach(function (value){
            expect(Boolean(value)).toBe(false)
        })

        const truthy: Boolean = Boolean('value')
        expect(truthy).toBe(true)

        const unexpectedExplicitApplyFalsy: boolean = Boolean.apply('va')
        expect(unexpectedExplicitApplyFalsy).toBe(false)

        const unexpectedExplicitApplyFalsy1: boolean = Boolean.apply('va', [0])
        expect(unexpectedExplicitApplyFalsy1).toBe(false)

        const wierdExplicitApplyTruthy: boolean = Boolean.apply('va', [1])
        expect(wierdExplicitApplyTruthy).toBe(true)

        const wierdExplicitApplyTruthy2: boolean = Boolean.apply('va', [2])
        expect(wierdExplicitApplyTruthy2).toBe(true)

        const wierdExplicitApplyTruthy3: boolean = Boolean.apply('va', [3])
        expect(wierdExplicitApplyTruthy3).toBe(true)

        const wierdExplicitApplyTruthy100: boolean = Boolean.apply('va', [100])
        expect(wierdExplicitApplyTruthy100).toBe(true)

    })

    test('numbers and Number', () => {
        const decimal: number = 6;
        expect(decimal).toBe(6)

        const hex: number = 0xf00d;
        expect(hex).toBe(61453)

        const binary: number = 0b1010;
        expect(binary).toBe(10)

        const octal: number = 0o744;
        expect(octal).toBe(484)

        const big: bigint = BigInt(100);
        expect(big).toBe(BigInt(100))

        const capNum: Number = 1.0001
        const primitiveNum: number = 1.0001

        expect(capNum).toBe(primitiveNum)
        expect(capNum.valueOf()).toBe(primitiveNum)

        const CapNumFixed: Number = 2.0001
        expect(CapNumFixed.toFixed(0)).toBe("2")
        expect(CapNumFixed.toFixed(1)).toBe("2.0")
        expect(CapNumFixed.toFixed(2)).toBe("2.00")
        expect(CapNumFixed.toFixed(3)).toBe("2.000")
        expect(CapNumFixed.toFixed(4)).toBe("2.0001")
        expect(CapNumFixed.toFixed(5)).toBe("2.00010")

        const capNumPrecision: Number = 10.0001
        const precisionError: () => void = () => {
            capNumPrecision.toPrecision(0)
        }
        expect(precisionError).toThrow("toPrecision() argument must be between 1 and 100")
        expect(capNumPrecision.toPrecision(1)).toBe("1e+1")
        expect(capNumPrecision.toPrecision(2)).toBe("10")
        expect(capNumPrecision.toPrecision(3)).toBe("10.0")
        expect(capNumPrecision.toPrecision(4)).toBe("10.00")

        const capNum2: Number = 2
        expect(capNum2.toExponential(0)).toBe("2e+0")
        expect(capNum2.toExponential(1)).toBe("2.0e+0")
        expect(capNum2.toExponential(2)).toBe("2.00e+0")

        expect(capNum2.toString()).toBe("2")

    })

    test('string and String', () => {
        const str: string = "abc"
        expect(str).toBe("abc")
        expect(str.includes('b')).toBe(true)
        expect(str.includes('B')).toBe(false)

        const str1: string = `${str}def`
        expect(str1).toBe("abcdef")

        const str2: string = 'abc' + 'def'
        expect(str2).toBe("abcdef")

        const capStr: String = String('value')
        expect(capStr).toBe("value")

        const booleanStr: string = String(true)
        expect(booleanStr).toBe("true")

        const booleanStr0: string = String.apply(true, [0])
        expect(booleanStr0).toBe("0")

        const booleanStr1: string = String.apply(true, [1])
        expect(booleanStr1).toBe("1")

        const booleanStr2: string = String.apply('abc', [2])
        expect(booleanStr2).toBe("2")

        const booleanStr3: string = String.apply(true, ['truthyValue'])
        expect(booleanStr3).toBe("truthyValue")

        const booleanStr4: string = String.apply(false, ['falsyValue'])
        expect(booleanStr4).toBe("falsyValue")

    })

    test('array', () => {

        const arr: number[] = [0, 1, 2]

        expect(arr[0]).toBe(0)
        expect(arr[1]).toBe(1)
        expect(arr[2]).toBe(2)
        expect(arr[3]).toBe(undefined)

        const arrMapped: number[] = arr.map(function (x: number) {
            return 1 + x
        })

        expect(arrMapped[0]).toBe(1)
        expect(arrMapped[1]).toBe(2)
        expect(arrMapped[2]).toBe(3)
        expect(arrMapped[3]).toBe(undefined)

        const reduceToSum: number = arr.reduce(function (acc: number, value: number){
            return acc + value
        })

        expect(reduceToSum).toBe(3)

        const filterArr: Array<number> = arr.filter(function (value: number, index: number, array: number[]){
            return value >= 1
        })
        expect(filterArr).toStrictEqual([1, 2])

        const arrConcat: number[] = arr.concat([3,4])
        expect(arrConcat).toStrictEqual([0, 1, 2, 3, 4])

        const nullCheck: boolean = arr[3] === null
        expect(nullCheck).toBe(false)

        const arr1: Array<String> = ['a', 'b', 'c']

        expect(arr1[0]).toBe('a')
        expect(arr1[1]).toBe('b')
        expect(arr1[2]).toBe('c')
        expect(arr1[3]).toBe(undefined)



    })

    test('tuple is really an array', () => {
        const tuple: [number, string] = [1, 'tuple']
        const isTupleArray: boolean = Array.isArray(tuple)
        expect(isTupleArray).toBe(true)
    })

    test('tuple with explicit type added', () => {
        const doubleTuple: [string, number] = ['a', 1]

        expect(doubleTuple[0]).toBe('a')
        expect(doubleTuple[1]).toBe(1)
        // does not compile - yay
        // expect(doubleTuple[2]).toBe(undefined)

    })

    test('"tuple" without explicit type added', () => {
        // note this is being auto typed as an array
        const tripleTuple: (string | number | boolean)[] = ['b', 2, true]

        expect(tripleTuple[0]).toBe('b')
        expect(tripleTuple[1]).toBe(2)
        expect(tripleTuple[2]).toBe(true)
        expect(tripleTuple[3]).toBe(undefined)

        const tripleTupleWithAutoTypeFromIntellij: (string | number | boolean)[] = ['b', 2, true]

        expect(tripleTupleWithAutoTypeFromIntellij[0]).toBe('b')
        expect(tripleTupleWithAutoTypeFromIntellij[1]).toBe(2)
        expect(tripleTupleWithAutoTypeFromIntellij[2]).toBe(true)
        expect(tripleTupleWithAutoTypeFromIntellij[3]).toBe(undefined)

    })

    test('enum', () => {
        enum CompassDirections {
            North,
            East,
            South,
            West
        }

        expect(CompassDirections.North).toBe(0)
        expect(CompassDirections.East).toBe(1)
        expect(CompassDirections.South).toBe(2)
        expect(CompassDirections.West).toBe(3)

        const north: CompassDirections = CompassDirections.North
        const northStringViaRevserMap: string = CompassDirections[north]
        expect(northStringViaRevserMap).toBe("North")

    })

    test('unknown', () => {
        let unknownValue: unknown = 'true'
        expect(unknownValue).toBe('true')

        const isString: boolean = typeof unknownValue === 'string'
        expect(isString).toBe(true)

        const isBoolean: boolean = typeof unknownValue === 'boolean'
        expect(isBoolean).toBe(false)

        // mutate value
        unknownValue = 0
        expect(unknownValue).toBe(0)

    })

})