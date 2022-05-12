
import ''

describe("null handling",() => {

    test('null handled with type assertions',() => {

        interface Person {
            name: string,
            styleName?: string
        }

        const personWithNoStyle: Person = {
            name: 'bob'
        }
        expect(personWithNoStyle.name).toBe('bob')
        expect(personWithNoStyle!.styleName).toBe(undefined)

        const personWithStyle: Person = {
            name: 'jody',
            styleName: 'awesome'
        }

        expect(personWithStyle.name).toBe('jody')
        expect(personWithStyle!.styleName).toBe('awesome')

    })
})