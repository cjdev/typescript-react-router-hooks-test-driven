import { TaskData } from "./Task";
import {createSampleData, SampleData} from "../test/sampleData";
import {createTaskPageTester, PageTester} from "../test/setupTester";
import {ProfileData} from "../profile/Profile";

const userParamsProfileId = 'manualTestProfileId123'

describe('REQUIREMENT: Display all tasks for a particular profile', () => {

    test('render single task', async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> = [ profile ]

        const task: TaskData = sample.task({ maybeProfileId: profile.id })
        const tasks = [task]

        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // then
        expect(tester.rendered.getByText(`Tasks for profile: ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.getByText(task.name)).toBeInTheDocument()
    })

    test('render multiple tasks', async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> =  [ profile ]

        const task1: TaskData = sample.task({ maybeProfileId: profile.id })
        const task2: TaskData = sample.task({ maybeProfileId: profile.id })
        const tasks = [task1, task2]

        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // then
        expect(tester.rendered.getByText(`Tasks for profile: ${profile.name}`)).toBeInTheDocument()
        expect(tester.rendered.getByText(task1.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(task2.name)).toBeInTheDocument()
    })

    test("incomplete tasks has class 'incomplete'", async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> =  [ profile ]

        const task: TaskData = sample.task({ maybeProfileId: profile.id })
        const tasks = [task]

        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // then
        expect(tester.rendered.getByText(task.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(task.name).className).toEqual('incomplete')
    })

    test("complete tasks has class 'complete'", async () => {
        // given
        const sample: SampleData = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> =  [ profile ]

        const task: TaskData = sample.task({ maybeProfileId: profile.id, maybeComplete: true })
        const tasks = [task]

        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // then
        expect(tester.rendered.getByText(task.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(task.name).className).toEqual('complete')
    })
})

describe('REQUIREMENT: Mark a task as complete', () => {
    test('mark task complete', async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> =  [ profile ]

        const originalTask: TaskData = sample.task({ maybeProfileId: profile.id })
        const clickedOnTask: TaskData = {
            ...originalTask,
            complete: true
        }
        const tasks = [originalTask]
        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // when
        await tester.clickOnTask(originalTask)

        // then
        expect(tester.rendered.getByText(originalTask.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(originalTask.name).className).toEqual('complete')
        expect(tester.inMemoryBackend.getMutableTasksData()).toEqual([clickedOnTask])
    })
})

describe('REQUIREMENT: Add a task', () => {

    test("add task on press Enter", async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> =  [ profile ]
        const initialTask = sample.task({ maybeProfileId: profile.id } )
        const tasks: Array<TaskData> = [ initialTask ]

        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // then
        expect(tester.rendered.getByText(initialTask.name)).toBeInTheDocument()
        expect(tester.inMemoryBackend.getMutableTasksData().length).toEqual(1)

        // when
        const task = sample.task()
        await tester.typeTaskName(task.name)
        await tester.pressKeyOnTaskInput('Enter')

        // then
        expect(tester.rendered.getByText(initialTask.name)).toBeInTheDocument()
        expect(tester.rendered.getByText(task.name)).toBeInTheDocument()
        expect(tester.inMemoryBackend.getMutableTasksData().length).toEqual(2)
    })

    test("do not add task with blank name", async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> =  [ profile ]

        const tasks: Array<TaskData> = []

        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // when
        await tester.pressKeyOnTaskInput('Enter')

        // then
        expect(tester.inMemoryBackend.getMutableTasksData().length).toEqual(0)
    })

    test("do not add task if key pressed is not Enter", async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> =  [ profile ]

        const task = sample.task()
        const tasks: Array<TaskData> = []

        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // when
        await tester.typeTaskName(task.name)
        await tester.pressKeyOnTaskInput('z')

        // then
        expect(tester.inMemoryBackend.getMutableTasksData().length).toEqual(0)
    })

})


describe('REQUIREMENT: Navigate to profiles', () => {
    test("navigate to profiles", async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> =  [ profile ]

        const tasks: Array<TaskData> = []

        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // then
        expect(tester.rendered.getByText('Back to Profiles')).toBeInTheDocument()
        expect(tester.rendered.getByText('Back to Profiles')).toHaveAttribute('href', '/profile')
    })
})

describe('REQUIREMENT: Clear all completed tasks', () => {

    test("clear all completed tasks", async () => {
        // given
        const sample = createSampleData()

        const profile = sample.profile(userParamsProfileId)
        const profilesData: Array<ProfileData> =  [ profile ]

        const completedTask = sample.task({ maybeProfileId: profile.id, maybeComplete: true })
        const incompleteTask = sample.task( { maybeProfileId: profile.id })
        const tasks: Array<TaskData> = [completedTask, incompleteTask]

        const tester: PageTester = await createTaskPageTester({ profilesData, tasks, sample })

        // then
        expect(tester.inMemoryBackend.getMutableTasksData().length).toEqual(2)
        // when
        await tester.clickClearCompetedTask()

        // then
        expect(tester.rendered.getByText('Clear Completed Tasks')).toBeInTheDocument()
        expect(tester.inMemoryBackend.getMutableTasksData().length).toEqual(1)
        // https://testing-library.com/docs/react-testing-library/cheatsheet/#queries
        // getByText vs queryByText vs findByText differences in the 'Queries' section
        expect(tester.rendered.getByText(incompleteTask.name)).toBeInTheDocument()
        expect(tester.rendered.queryByText(completedTask.name)).not.toBeInTheDocument()
    })

})


