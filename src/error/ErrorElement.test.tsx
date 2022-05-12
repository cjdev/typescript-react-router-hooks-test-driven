import {ErrorElement} from "./ErrorElement";
import {render, RenderResult} from "@testing-library/react";
import {act} from "react-dom/test-utils";


test('ErrorElement with undefined', async () => {

    const error: Error | undefined = undefined

    const element =
        <div className={'test'}>
            <ErrorElement error={error}/>
        </div>

    let rendered: RenderResult = {} as RenderResult
    await act(async () => {
        rendered = render(element)
    })

    expect(rendered.container.getElementsByClassName('errorElement').length).toEqual(0)

})

test('ErrorElement with Error', async () => {

    const error: Error | undefined = Error('boom baby')

    const element =
        <div className={'test'}>
            <ErrorElement error={error}/>
        </div>

    let rendered: RenderResult = {} as RenderResult
    await act(async () => {
        rendered = render(element)
    })

    expect(rendered.getByText('boom baby')).toBeInTheDocument()

})
