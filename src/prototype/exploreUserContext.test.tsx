import React, {createContext, useContext} from "react";
import {render, RenderResult} from "@testing-library/react";

describe("learn context", () => {

    const createGenericContext: <T>(defaultValue: T) => React.Context<T> =
        <T,>(defaultValue: T) => createContext<T>(defaultValue)

    const typesAreAwesome = () => {
        const typingIsAwesome: string = 'typing is awesome'
        expect(typingIsAwesome === typingIsAwesome).toBe(true)
    }

    test('send send context value from provider to consumer', () => {
        const SomeStringContext: React.Context<string> = createGenericContext<string>('')
        const SomeComponent: (contextValue: string) => React.ReactElement = (contextValue: string) => {
            return <div>{contextValue}</div>
        }
        const element: React.ReactElement = <SomeStringContext.Provider value="hi">
            <SomeStringContext.Consumer>
                {
                    contextStringValue => SomeComponent(contextStringValue)
                }
            </SomeStringContext.Consumer>
        </SomeStringContext.Provider>
        const actual: RenderResult = render(element)

        expect(actual.container.innerHTML).toBe('<div>hi</div>')
    })

    test('inner component can access outer context', () => {
        const SomeStringContext: React.Context<string> = createGenericContext<string>('')
        const SomeComponent: () => React.ReactElement = () => {
            const stringValue = useContext(SomeStringContext)
            return <div>{stringValue}</div>
        }
        const element: React.ReactElement = <SomeStringContext.Provider value="hi">
            <SomeComponent/>
        </SomeStringContext.Provider>
        const actual: RenderResult = render(element)

        expect(actual.container.innerHTML).toBe('<div>hi</div>')
    })

    test('default context is used by consumer when no provider can be found', () => {
        const SomeStringContext: React.Context<string> = createGenericContext<string>('hello')
        const element: React.ReactElement = <SomeStringContext.Consumer>
            {
                contextValue => <div>{contextValue}</div>
            }
        </SomeStringContext.Consumer>
        const renderedElement: RenderResult = render(element)
        const actual: string = renderedElement.container.innerHTML
        const expected: string = "<div>hello</div>"
        expect(actual).toBe(expected)
    })

    test('type saves the day and makes this test invalid - default context does does not take effect if a provider is available with an omitted value', () => {
        // const SomeStringContext: React.Context<string> = createGenericContext<string>('hello')
        // const element = <SomeStringContext.Provider>
        //     <SomeStringContext.Consumer>
        //         {
        //             contextValue => <div>{contextValue}</div>
        //         }
        //     </SomeStringContext.Consumer>
        // </SomeStringContext.Provider>
        // const actual = render(element)
        // expect(actual.container.innerHTML).toBe('<div></div>')
        typesAreAwesome()
    })

    test('default context does not take effect if a provider is available with an omitted value', () => {
        // const SomeNumberContext = createContext<number>(0)
        // const SomeComponent = () => {
        //     const numberValue = useContext(SomeNumberContext)
        //     return <div>{numberValue}</div>
        // }
        // const element = <SomeNumberContext.Provider>
        //     <SomeComponent/>
        // </SomeNumberContext.Provider>
        // render(element)
        typesAreAwesome()
    })

})