import {Summary} from "./Summary";
import {render, RenderResult} from "@testing-library/react";
import React from "react";
import {act} from "react-dom/test-utils";
import {SummaryProvider} from "./SummaryProvider";
import {stubBackend} from "../test/stubs";
import {Backend} from "../backend/backend";
import useSummaryContext from "./useSummaryContext";
import userEvent from "@testing-library/user-event";

const numberOfProfilesStr = (quantity: number) => {
    return `Number of profiles = ${quantity}`
}

const numberOfTasksStr = (quantity: number) => {
    return `Number of tasks across all profiles = ${quantity}`
}

describe('display total profiles and tasks', () => {

    const setupRender = async (): Promise<RenderResult> => {
        const fetchSummary = jest.fn()
            .mockResolvedValueOnce({ numberOfProfiles: 1, numberOfTasks: 2 })

        const backend: Backend = {
            ...stubBackend(),
            fetchSummary
        }

        const ComponentThatTriggersUpdate = () => {
            const summary = useSummaryContext()
            const onClick = () => {
                summary.updateSummary()
            }
            return <div>
                <button onClick={onClick}>Update Summary</button>
            </div>
        }

        const children: React.ReactChild = (
            <>
                <Summary key={'uniqueKeyHere'}/>
                <ComponentThatTriggersUpdate key={'anotherUniqueKeyHere'}/>
            </>
        )

        // given
        const element = <SummaryProvider backend={backend} children={children}/>

        // when
        let rendered: RenderResult = {} as RenderResult
        await act( async () => {
            rendered = render(element)
        })
        return rendered
    }

    test('REQUIREMENT: Display the total number of profiles', async () => {
        // when
        const rendered = await setupRender()

        // then
        expect(rendered.getByText('Summary')).toBeInTheDocument()
        expect(rendered.container.firstChild).toHaveClass('Summary')
        expect(rendered.getByText(numberOfProfilesStr(1))).toBeInTheDocument()
    })

    test('REQUIREMENT: Display the total number of tasks', async () => {
        // when
        const rendered = await setupRender()

        // then
        expect(rendered.getByText('Summary')).toBeInTheDocument()
        expect(rendered.container.firstChild).toHaveClass('Summary')
        expect(rendered.getByText(numberOfTasksStr(2))).toBeInTheDocument()
    })
})

test('REQUIREMENT: Immediately update as the underlying data changes', async () => {

    const fetchSummary = jest.fn()
        .mockResolvedValueOnce({ numberOfProfiles: 1, numberOfTasks: 2 })
        .mockResolvedValueOnce({ numberOfProfiles: 3, numberOfTasks: 5 })

    const backend: Backend = {
        ...stubBackend(),
        fetchSummary
    }

    const ComponentThatTriggersUpdate = () => {
        const summary = useSummaryContext()
        const onClick = () => {
            summary.updateSummary()
        }
        return <div>
            <button onClick={onClick}>Update Summary</button>
        </div>
    }

    const children: React.ReactChild = (<>
            <Summary key={'uniqueKeyHere'}/>
            <ComponentThatTriggersUpdate key={'anotherUniqueKeyHere'}/>
        </>)

    // given
    const element = <SummaryProvider backend={backend} children={children}/>

    // when
    let rendered: RenderResult = {} as RenderResult
    await act( async () => {
        rendered = render(element)
    })

    // then
    expect(rendered.getByText('Summary')).toBeInTheDocument()
    expect(rendered.container.firstChild).toHaveClass('Summary')
    expect(rendered.getByText(numberOfProfilesStr(1))).toBeInTheDocument()
    expect(rendered.getByText(numberOfTasksStr(2))).toBeInTheDocument()

    // when
    await act(async () => {
        userEvent.click(rendered.getByRole('button', {name: 'Update Summary'}))
    })
    expect(rendered.getByText(numberOfProfilesStr(3))).toBeInTheDocument()
    expect(rendered.getByText(numberOfTasksStr(5))).toBeInTheDocument()

})
