import {Database} from "./database";
import {SummaryData} from "../summary/SummaryData";
import {CreateProfileData, ProfileData} from "../profile/Profile";
import {CreateTaskData, TaskData} from "../task/Task";
import Namespace from "../namespace/namespace";

export interface Backend {
    fetchSummary: () => Promise<SummaryData>,
    getProfiles: () => Promise<Array<ProfileData>>,
    deleteProfileAndAssociatedTasks: (profileId: string) => Promise<Array<Awaited<string | Array<string>>>>,
    addProfile: (name: string) => Promise<string>,
    getTasksForProfile: (profileId: string) => Promise<Array<TaskData>>
    getProfile: (profileId: string) => Promise<ProfileData>,
    addTask: (task: CreateTaskData) => Promise<string>,
    updateTask: (task: TaskData) => Promise<String>,
    deleteTask: (id: string) => Promise<string>,
}

export const createBackend = (database: Database): Backend => {
    const numOfTasks = async (): Promise<number> => {
        const tasks = await database.list(Namespace.TASK)
        return tasks.length
    }

    const numOfProfiles = async (): Promise<number> => {
        const tasks = await database.list(Namespace.PROFILE)
        return tasks.length
    }

    const fetchSummary = async (): Promise<SummaryData> => {
        const numberOfProfiles: number = await numOfProfiles()
        const numberOfTasks: number = await numOfTasks()
        const result: SummaryData = {
            numberOfProfiles,
            numberOfTasks
        }
        return result
    }

    const getProfiles = async (): Promise<ProfileData[]> => {
        const result: Array<ProfileData> = await database.list(Namespace.PROFILE)
        return result
    }

    const getTasksForProfile = async (profileId: string): Promise<TaskData[]> => {
        const allTasks: Array<TaskData> = await database.list(Namespace.TASK)
        const profileSpecificTasks: Array<TaskData> = allTasks.filter(task => task.profile === profileId)
        return profileSpecificTasks
    }

    const deleteProfile = async (id: string): Promise<string> => {
        const result: string = await database.remove(Namespace.PROFILE, id)
        return result
    }

    const deleteTask = async (id: string): Promise<string> => {
        const result: string = await database.remove(Namespace.TASK, id)
        return result
    }

    const deleteTasks = async (profileId: string) => {
        const tasks: Array<TaskData> = await getTasksForProfile(profileId)
        const taskIds: Array<string> = tasks.map(t => t.id)
        const deletesF: Array<Promise<string>> = taskIds.map(id => deleteTask(id))
        const result: Promise<Array<string>> = Promise.all(deletesF)
        return result
    }

    const deleteProfileAndAssociatedTasks = async (id: string) => {
        const deleteProfileF: Promise<string> = deleteProfile(id)
        const deleteTasksF: Promise<Array<string>> = deleteTasks(id)
        const result: Array<Awaited<string | Array<string>>> = await Promise.all([deleteProfileF, deleteTasksF])
        return result
    }

    // We do not need to set the id as webdb handles that
    const addProfile = async (name: string) => {
        const value: CreateProfileData = { name }
        const result: string = await database.add(Namespace.PROFILE, value)
        return result
    }

    // We do not need to set the id as webdb handles that
    const addTask = async (task: CreateTaskData) => {
        const result = await database.add(Namespace.TASK, task)
        return result
    }

    const getProfile = async (profileId: string) => {
        const profile: ProfileData = await database.get(Namespace.PROFILE, profileId)
        return profile
    }

    const updateTask = async (task: TaskData) => {
        const result = await database.update(Namespace.TASK, task)
        return result
    }

    const backend: Backend = {
        fetchSummary,
        getProfiles,
        deleteProfileAndAssociatedTasks,
        addProfile,
        getTasksForProfile,
        getProfile,
        addTask,
        updateTask,
        deleteTask,
    }
    return backend
}