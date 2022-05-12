
import ''

describe("learn async", () => {

    test('without async', () => {
        const createInFuture: <T,>(f: T) => Promise<T> = <T,>(f: T) => Promise.resolve(f)
        const futureX: Promise<number> = createInFuture<number>(1)
        const futureY: Promise<number> = createInFuture<number>(2)
        const futureZ: Promise<number> = futureX
            .then(x =>
                futureY.then(y =>
                    x + y
                )
            )
        futureZ.then(z =>
            expect(z).toEqual(3)
        )
    })

    test('with async', async () => {
        // generic type followed by comma so react knows it is a type not a node
        const createInFuture: <T,>(f: T) => Promise<T> = async <T,>(f: T) => f
        const x: number = await createInFuture(1)
        const y: number = await createInFuture(2)
        const actual: number = x + y
        expect(actual).toEqual(3)
    })

})