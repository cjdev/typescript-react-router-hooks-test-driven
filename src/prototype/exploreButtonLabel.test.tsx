import React, {MouseEventHandler} from "react";
import {render, RenderResult} from "@testing-library/react";
import {act} from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";

describe('learn button label', () => {

    const TestButtonLabel: (onClick: MouseEventHandler<HTMLButtonElement>) => React.ReactElement =
        (onClick: (event: React.MouseEvent<HTMLButtonElement>) => void) => {
            const id: string = 'the-id'
            const text: string = 'the-text'
            const element: React.ReactElement =
                <div>
                    <label htmlFor={id}>{text}</label>
                    <button onClick={onClick} id={id}>delete</button>
                </div>
            return element
        }

    test('learn button label', async () => {
        let rendered: RenderResult
        let actualClickCount: number = 0
        const onClick: jest.Mock = jest.fn().mockImplementation(() => actualClickCount++)
        await act(async () => {
            const buttonLabel: React.ReactElement = TestButtonLabel(onClick)
            rendered = render(buttonLabel)
            const theButton = rendered.getByLabelText('the-text')
            userEvent.click(theButton)
        })
        const expectedClickCount: number = 1
        expect(actualClickCount).toEqual(expectedClickCount)
    })

})