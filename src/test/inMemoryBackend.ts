import {ProfileData} from "../profile/Profile";
import {CreateTaskData, TaskData} from "../task/Task";
import {Backend} from "../backend/backend";
import {SampleData} from "../test/sampleData";
import {stubBackend} from "./stubs";
import {SummaryData} from "../summary/SummaryData";

export type SetupTestBackendProps = {
    profiles: Array<ProfileData>,
    tasks: Array<TaskData>,
    sample: SampleData,
}

export interface InMemoryBackend {
    backend: Backend,
    getMutableProfilesData: () => Array<ProfileData>,
    getMutableTasksData: () => Array<TaskData>,
}

export const setupBackendInMemoryBackend = ({ profiles, tasks, sample }: SetupTestBackendProps): InMemoryBackend => {
    let mutableProfiles: Array<ProfileData> = profiles
    let mutableTasks: Array<TaskData> = tasks

    const getProfiles = async () => {
        return mutableProfiles
    }

    const addProfile = async (name: string): Promise<string> => {
        const tempProfile = sample.profile()
        const newProfile = {
            id: tempProfile.id,
            name
        }
        mutableProfiles.push(newProfile)
        const result = Promise.resolve(JSON.stringify(newProfile))
        return result
    }

    const deleteProfileAndAssociatedTasks = async (profileId: string): Promise<Array<Awaited<string | Array<string>>>> => {
        const newProfiles = mutableProfiles.filter(profile => profile.id !== profileId)
        mutableProfiles = newProfiles
        const newTasks = mutableTasks.filter(task => task.profile !== profileId)
        mutableTasks = newTasks
        const stringArrayReturn: Promise<Array<string>> = Promise.resolve([])
        const result = Promise.all([Promise.resolve(profileId), stringArrayReturn])
        return result
    }

    const getTasksForProfile = async (profileId: string): Promise<Array<TaskData>> => {
        const tasksForProfile = mutableTasks.filter(task => task.profile === profileId)
        const result = Promise.resolve(tasksForProfile)
        return result
    }

    const getProfile = async (profileId: string): Promise<ProfileData> => {
        const maybeProfile: ProfileData | undefined = mutableProfiles.find(profile => profile.id === profileId)
        if ( maybeProfile ) {
            const result: Promise<ProfileData> = Promise.resolve(maybeProfile)
            return result
        } else {
            const errorMessage = `unable to find profileId '${profileId}' in mutableProfiles`
            const result: Promise<ProfileData> = Promise.reject(errorMessage)
            return result
        }
    }

    const updateTask = async (task: TaskData): Promise<String> => {
        const index = mutableTasks.findIndex(task => task.id === task.id)
        mutableTasks[index] = task
        const result = Promise.resolve(JSON.stringify(task))
        return  result
    }

    const addTask  = async (task: CreateTaskData): Promise<string> => {
        const taskId: string = sample.task().id
        const newTask: TaskData = {
            id: taskId,
            name: task.name,
            complete: task.complete,
            profile: task.profile
        }
        mutableTasks.push(newTask)
        const result= Promise.resolve(JSON.stringify(newTask))
        return result
    }

    const deleteTask = async (id: string): Promise<string> => {
        const task = mutableTasks.find(task => task.id === id)
        const newMutableTasks = mutableTasks.filter(v => v.id !== id)
        mutableTasks = newMutableTasks
        const errorMessage = `unable to delete task with id '${id}' as it is not in mutableTasks`
        const result: Promise<string> = (task)? Promise.resolve(JSON.stringify(task)) : Promise.reject(errorMessage)
        return result
    }

    const fetchSummary = async (): Promise<SummaryData> => {
        const numberOfProfiles = mutableProfiles.length
        const numberOfTasks = mutableTasks.length
        const result: SummaryData = {
            numberOfProfiles,
            numberOfTasks
        }
        return result
    }

    const backend: Backend = {
        ...stubBackend(),
        fetchSummary,
        getProfiles,
        addProfile,
        deleteProfileAndAssociatedTasks,
        getTasksForProfile,
        getProfile,
        updateTask,
        addTask,
        deleteTask,
    }

    const getProfilesData = () => {
        return mutableProfiles
    }

    const getTasksData = () => {
        return mutableTasks
    }

    return {
        backend,
        getMutableProfilesData: getProfilesData,
        getMutableTasksData: getTasksData
    }
}