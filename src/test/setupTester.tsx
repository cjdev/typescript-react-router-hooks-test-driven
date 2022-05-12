import {fireEvent, render, RenderResult} from "@testing-library/react";
import {setupBackendInMemoryBackend, InMemoryBackend} from "./inMemoryBackend";
import {Task, TaskData} from "../task/Task";
import {ProfileData} from "../profile/Profile";
import {SampleData} from "./sampleData";
import {SummaryContext} from "../summary/SummaryContext";
import {act} from "react-dom/test-utils";
import userEvent from "@testing-library/user-event";
import { Profile } from "../profile/Profile"
import {Backend} from "../backend/backend";
import {SummaryData} from "../summary/SummaryData";
import React, {useState} from "react";

const userParamsProfileId = 'manualTestProfileId123'

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({
        profileId: userParamsProfileId
    })
}))

type TestingSummaryContextProviderProps = {
    backend: Backend
    children: React.ReactChild
}

const TestingSummaryContextProvider = ({ backend, children }: TestingSummaryContextProviderProps) => {

    const [numberOfProfiles, setNumberOfProfiles] = useState<number>(0)

    const [numberOfTasks, setNumberOfTasks] = useState<number>(0)

    const updateSummary = async (): Promise<void> => {
        const summaryData: SummaryData = await backend.fetchSummary()
        setNumberOfProfiles(summaryData.numberOfProfiles)
        setNumberOfTasks(summaryData.numberOfTasks)
    }

    const error: Error | undefined = undefined

    return (
        <SummaryContext.Provider value={{ updateSummary, numberOfProfiles, numberOfTasks, error }}>
            {children}
        </SummaryContext.Provider>
    )
}

export type TaskTesterProps = {
    profilesData: Array<ProfileData>,
    tasks: Array<TaskData>,
    sample: SampleData,
}

export const createProfilePageTester = async ({ profilesData, tasks, sample }: TaskTesterProps ): Promise<PageTester> => {
    let profiles: Array<ProfileData> = profilesData

    const inMemoryBackend: InMemoryBackend = setupBackendInMemoryBackend({ profiles, tasks, sample })
    const backend: Backend = inMemoryBackend.backend

    const children = (
        <>
            <Profile key={'uniqueKeyRequiredHere'} backend={backend}/>
        </>
    )

    const testSummaryContextProvider = <TestingSummaryContextProvider backend={backend} children={children}/>

    return createPageTester({
        testSummaryContextProvider,
        inMemoryBackend
    })
}

export const createTaskPageTester = async ({ profilesData, tasks, sample }: TaskTesterProps ): Promise<PageTester>  => {

    const taskTestsUserParamsProfile: ProfileData = {
        id: userParamsProfileId,
        name: 'taskTestsUserParamsProfile'
    }

    let profiles: Array<ProfileData> = profilesData.concat(taskTestsUserParamsProfile)

    const inMemoryBackend: InMemoryBackend = setupBackendInMemoryBackend({ profiles, tasks, sample})
    const backend: Backend = inMemoryBackend.backend

    const children = (
        <>
            <Task key={'uniqueKeyRequiredHere'} backend={backend}/>
        </>
    )

    const testSummaryContextProvider = <TestingSummaryContextProvider backend={backend} children={children}/>

    return createPageTester({
        testSummaryContextProvider,
        inMemoryBackend
    })
}

type PageTesterProps = {
    testSummaryContextProvider: React.ReactElement
    inMemoryBackend: InMemoryBackend
}

export interface PageTester {
    rendered: RenderResult,
    inMemoryBackend: InMemoryBackend,
    clickOnTask: (task: TaskData) => Promise<void>,
    typeTaskName: (name: string) => Promise<void>,
    typeProfileName: (profileName: string) => Promise<void>
    pressKeyOnTaskInput: (key: string) => Promise<void>
    pressKeyOnProfileInput: (key: string) => Promise<void>
    clickClearCompetedTask: () => Promise<void>,
    clickDeleteProfileButton: (profileName: string) => Promise<void>
}


const createPageTester = async ({ testSummaryContextProvider, inMemoryBackend }: PageTesterProps ): Promise<PageTester> => {
    // when
    // doing the empty assign here because of strict null check being true, else you will see an error/warning
    let rendered: RenderResult = {} as RenderResult
    await act(async () => {
        rendered = render(testSummaryContextProvider)
    })

    const clickOnTask = async (task: TaskData): Promise<void> => {
        await act(async () => {
            const element = rendered.getByText(task.name)
            userEvent.click(element)
        })
    }

    const newProfileInputPlaceholder: string = 'Add new profile here'
    const newTaskInputPlaceholder: string = 'Add new task here'

    const typeTaskName = async (name: string): Promise<void> => {
        await typeName(name, newTaskInputPlaceholder)
    }

    const typeProfileName = async (profileName: string): Promise<void> => {
        await typeName(profileName, newProfileInputPlaceholder)
    }

    const typeName = async (name: string, placeHolderValue: string): Promise<void> => {
        await act(async () => {
            const element = rendered.getByPlaceholderText(placeHolderValue)
            // You need the delay here or else you get letter by letter change which results in the last letter of the name as the name
            // https://github.com/testing-library/user-event/issues/539
            const options = { delay: 1 }
            await userEvent.type(element, name, options)
        })
    }

    const pressKeyOnTaskInput = async (key: string): Promise<void> => {
        await pressKey(key, newTaskInputPlaceholder)
    }

    const pressKeyOnProfileInput = async (key: string): Promise<void> => {
        await pressKey(key, newProfileInputPlaceholder)
    }

    const pressKey = async (key: string, inputPlaceHolder: string): Promise<void> => {
        await act(async () => {
            const element = rendered.getByPlaceholderText(inputPlaceHolder)
            const options = { key }
            fireEvent.keyUp(element, options)
        })
    }

    const clickClearCompetedTask = async (): Promise<void> => {
        await act(async () => {
            const element = rendered.getByText('Clear Completed Tasks')
            userEvent.click(element)
        })
    }

    const clickDeleteProfileButton = async (_: string): Promise<void> => {
        await act(async () => {
            const element = rendered.getByRole('button', { name: 'delete' })
            userEvent.click(element)
        })
    }

    return {
        rendered,
        inMemoryBackend,
        clickOnTask,
        typeTaskName,
        typeProfileName,
        pressKeyOnTaskInput,
        pressKeyOnProfileInput,
        clickClearCompetedTask,
        clickDeleteProfileButton,
    }
}
