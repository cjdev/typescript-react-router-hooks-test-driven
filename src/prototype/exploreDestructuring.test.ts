
import ''

describe("learn destructuring", () => {

    test('destructure array', () => {
        const a: number[] = [1, 2, 3]
        const [b, c]: number[] = a
        expect(b).toBe(1)
        expect(c).toBe(2)
    })

    test('destructure typed array', () => {
        const a: Array<number> = [1, 2, 3]
        const [b, c]: Array<number> = a
        expect(b).toBe(1)
        expect(c).toBe(2)
    })

    test('destructure map', () => {
        const a: { d: number; e: number; f: number } = {d: 4, e:5, f:6}
        const {d, e}: { d: number; e: number } = a
        expect(d).toBe(4)
        expect(e).toBe(5)
    })

// using any return type frees us from having to define and interface
// using object as return forces interface aka specific modeling of data
    function mapToObj<K, V>(map: Map<K, V>): any {
        const initialObject: any = {}
        let result: any = Array.from(map).reduce((obj: any, [key, value]) => {
            obj[key] = value;
            return obj;
        }, initialObject);
        return result
    }

    test('destructure typed map to any', () => {
        const map: Map<string, number> = new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
            ["d", 4],
        ])
        // have to convert to an 'any' to destructure
        const aObj: any = mapToObj(map)

        const {a, b, e}: { a: number; b: number; e: number } = aObj
        expect(a).toBe(1)
        expect(b).toBe(2)
        expect(e).toBe(undefined)
    })

// requires interface aka specific model of data
    test('destructure typed map to object', () => {
        const map: Map<string, number> = new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
            ["d", 4],
        ])

        interface Abe {
            a: number,
            b: number,
            e: undefined
        }

        const obj: any = mapToObj(map)

        const aObj: Abe = obj as Abe

        const {a,b,e} = aObj
        expect(a).toBe(1)
        expect(b).toBe(2)
        expect(e).toBe(undefined)

    })

    test('destructure typed map to object via unknown casting compiles however does not work as suggested by intellij', () => {
        const map: Map<string, number> = new Map([
            ["a", 1],
            ["b", 2],
            ["e", 3],
        ])

        interface Abe {
            a: number,
            b: number,
            e: undefined
        }

        // intellij suggestion to cast to unknown
        const obj: unknown = map as unknown

        const aObj: Abe = obj as Abe

        const {a,b,e}: Abe = aObj
        expect(a).toBe(undefined)
        expect(b).toBe(undefined)
        expect(e).toBe(undefined)

    })


    test('create map', () => {
        const b: number = 2
        const c: number = 3
        const actual: { a: number; b: number; c: number } = {a: 1, b: b, c}
        const expected = {a: 1, b: 2, c: 3}
        expect(actual).toStrictEqual(expected)
    })

    test('create typed map', () => {
        const b: number = 2
        const c: [string, number] = ["c", 3]
        // NOTE difference in type from c to d ... d type was auto generated by intellij
        // const d: (string | number)[] = ["d", 4]
        const actual: Map<string, number> = new Map([
            ["a", 1],
            ["b", b],
            c
        ])
        const expected: Map<string, number> = new Map([
            ["a", 1],
            ["b", 2],
            ["c", 3],
        ])
        expect(actual).toStrictEqual(expected)
    })
})
