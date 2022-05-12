import {SummaryData} from "../summary/SummaryData";
import {Backend, createBackend} from "./backend";
import {Database} from "./database";
import Namespace, {NamespaceName} from "../namespace/namespace";
import {ProfileData} from "../profile/Profile";
import {CreateTaskData, TaskData} from "../task/Task";
import * as R from 'ramda'
import {createSampleData} from "../test/sampleData";
import {stubDatabase} from "../test/stubs";

const createDataMap = (profiles: Array<ProfileData>, tasks: Array<TaskData>) => {
    const dataMap = {
        [Namespace.PROFILE]: profiles,
        [Namespace.TASK]: tasks
    }

    return (namespace: NamespaceName): Promise<Array<ProfileData | TaskData>> => {
        const errorMessage: string = `No value defined for key '${namespace}'`

        const maybeValueToReturn = dataMap[namespace]
        return maybeValueToReturn ? Promise.resolve(maybeValueToReturn) : Promise.reject(errorMessage)
    }
}

test('fetchSummary', async () => {
    // given
    const sample = createSampleData()

    const profiles = sample.profileArray(2)
    const tasks = sample.taskArray(4)

    const list = async (namespace: NamespaceName) => {
        return await createDataMap(profiles, tasks)(namespace)
    }

    const database: Database = {
        ...stubDatabase,
        list
    }

    const backend: Backend = createBackend(database)

    // when
    const summary: SummaryData = await backend.fetchSummary()

    // then
    expect(summary.numberOfProfiles).toEqual(2)
    expect(summary.numberOfTasks).toEqual(4)
})

test('getProfiles', async () => {
    // given

    const sample = createSampleData()

    const profile: ProfileData = sample.profile()
    const id = profile.id

    const expected = profile

    const get = async (namespace: NamespaceName, id: string) => {
        const profileArray = await createDataMap([profile], [])(namespace)
        const maybeProfile: ProfileData | TaskData | undefined = profileArray.find(p => p.id === id)
        const errorMessage = `unable to find profile with id '${id}'`
        const result: Promise<any> = (maybeProfile) ? Promise.resolve(maybeProfile) : Promise.reject(errorMessage)
        return result
    }

    const database: Database = {
        ...stubDatabase,
        get
    }

    const backend: Backend = createBackend(database)

    // when
    const actual = await backend.getProfile(id)

    // then
    expect(actual).toEqual(expected)
})

test('deleteProfileAndAssociatedTasks', async () => {
    // given
    const sample = createSampleData()
    const profile: ProfileData = sample.profile()
    const firstProfileTask: TaskData = {
        id: 'first profile task id',
        name: 'first profile task name',
        complete: false,
        profile: profile.id
    }

    const irrelevantTask = sample.task()

    const list = async (namespace: NamespaceName) => {
        return await createDataMap([], [irrelevantTask, firstProfileTask])(namespace)
    }

    const remove = jest.fn()

    const database: Database = {
        ...stubDatabase,
        remove,
        list
    }

    const backend: Backend = createBackend(database)

    // when
    await backend.deleteProfileAndAssociatedTasks(profile.id)

    // then
    expect(remove.mock.calls.length).toEqual(2)
    expect(remove.mock.calls).toContainEqual([Namespace.PROFILE, profile.id])
    expect(remove.mock.calls).toContainEqual([Namespace.TASK, firstProfileTask.id])
})

test('addProfile', async () => {
    // given

    const sample = createSampleData()
    const profile = sample.profile()
    const add = jest.fn()

    const database: Database = {...stubDatabase, add}
    const backend: Backend = createBackend(database)

    // when
    const profileName = profile.name
    await backend.addProfile(profileName)

    // then
    const expected = [
        [Namespace.PROFILE, {'name': profileName}]
    ]
    expect(add.mock.calls).toEqual(expected)
})

test('getTasksForProfile', async () => {
    // given
    const sample = createSampleData()
    const profile: ProfileData = sample.profile()
    const firstProfileTask: TaskData = {
        id: 'first profile task id',
        name: 'first profile task name',
        complete: false,
        profile: profile.id
    }
    const irrelevantTask = sample.task()
    const tasks = [irrelevantTask, firstProfileTask]

    const expected = [firstProfileTask]

    const list = async (namespace: NamespaceName) => {
        return await createDataMap([], tasks)(namespace)
    }

    const database: Database = {
        ...stubDatabase,
        list
    }

    const backend: Backend = createBackend(database)

    // when
    const actual = await backend.getTasksForProfile(profile.id)

    // then
    expect(actual).toEqual(expected)
})

test('getProfile', async () => {
    // given
    const sample = createSampleData()
    const profiles: Array<ProfileData> = sample.profileArray(2)
    const profile: ProfileData = profiles[0]
    const profileId = profile.id

    const expected = profile

    const tasks: Array<TaskData> = []

    const get = async (namespace: NamespaceName, id: string) => {
        const data = await createDataMap(profiles, tasks)(namespace)
        const errorMessage = `no profile found for id '${id}'`
        const result: Promise<any> = (data) ? Promise.resolve(data.find(v => v.id === id)) : Promise.reject(errorMessage)
        return result
    }

    const database: Database = {
        ...stubDatabase,
        get
    }

    const backend: Backend = createBackend(database)

    // when
    const actual = await backend.getProfile(profileId)

    // then
    expect(actual).toEqual(expected)
})

test('addTask', async () => {
    // given
    const sample = createSampleData()

    const task0: TaskData = sample.task()

    const task: CreateTaskData = R.omit(['id'], task0)

    const add = jest.fn()

    const database: Database = {
        ...stubDatabase,
        add
    }

    const backend: Backend = createBackend(database)

    // when
    await backend.addTask(task)

    // then
    expect(add.mock.calls).toEqual([ [Namespace.TASK, task] ])
})

test('updateTask', async () => {
    // given
    const sample = createSampleData()

    const task = sample.task()

    const update = jest.fn()

    const database: Database = {
        ...stubDatabase,
        update
    }

    const backend: Backend = createBackend(database)

    // when
    await backend.updateTask(task)
    const actual = update.mock.calls

    // then
    expect(actual).toEqual([ [Namespace.TASK, task] ])
})

test('deleteTask', async () => {
    // given
    const sample = createSampleData()

    const task = sample.task()

    const taskId = task.id

    const expected = [
        [ Namespace.TASK, taskId]
    ]

    const remove = jest.fn()

    const database: Database = {
        ...stubDatabase,
        remove
    }
    const backend: Backend = createBackend(database)
    // when
    await backend.deleteTask(taskId)
    const actual = remove.mock.calls

    // then
    expect(actual).toEqual(expected)
})

