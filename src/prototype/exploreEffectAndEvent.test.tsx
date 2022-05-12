import React, {useEffect, useState} from "react";
import {fireEvent, render, RenderResult} from "@testing-library/react";
import {act} from "react-dom/test-utils";

describe("learn effect and event",() => {

    test('state change after load', async () => {

        type ComponentProps = {
            fetchName: () => Promise<string>
        }

        function Component(props: ComponentProps): React.ReactElement {
            const originalName = 'original name'
            const [name, setName]: [string, ((value: (((prevState: string) => string) | string)) => void)] =
                useState(originalName)
            const loadName: () => void = async () => {
                const newName: string = await props.fetchName()
                setName(newName)
            }
            const onButtonClick: () => void = async () => {
                setName('updated name')
            }
            useEffect(() => {
                loadName()
            }, [])
            const node: React.ReactElement = <div>
                <span>{name}</span>
                <button onClick={onButtonClick}>The Button</button>
            </div>
            return node
        }

        const fetchName: () => Promise<string> = async () => {
            return Promise.resolve('original name')
        }
        let renderResult: RenderResult | undefined
        await act( async () => {
            const component: React.ReactElement = <Component fetchName={fetchName}/>
            renderResult = render(component)
        })
        await act( async () => {
            if (renderResult) {
                fireEvent.click(renderResult.getByRole('button'), {name: 'The Button'})
            }
        })

        if ( renderResult ) {
            expect(renderResult.getByText('updated name')).toBeInTheDocument()
        }

    })
})