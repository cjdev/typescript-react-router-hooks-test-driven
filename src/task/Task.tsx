
import './Task.css'
import {useParams} from "react-router-dom";
import {Backend} from "../backend/backend";
import React, { useEffect, useState} from "react";
import {ProfileData} from "../profile/Profile";
import useSummaryContext from "../summary/useSummaryContext";
import {SummaryContextData} from "../summary/SummaryContext";
import {handleAsyncError} from "../error/Errors";
import {ErrorElement} from "../error/ErrorElement";

export interface CreateTaskData {
    name: string
    profile: string
    complete: boolean
}

export interface TaskData extends CreateTaskData {
    id: string
}

type TaskElementProps = {
    task: TaskData
    updateTask: (task: TaskData) => void
}

const TaskElement = ({ task, updateTask }: TaskElementProps) => {
    const className: string = (task.complete) ? 'complete' : 'incomplete'

    // REQUIREMENT: Mark a task as complete
    const onClick = (_: React.MouseEvent) => {
        const newCompletedStatus: boolean = !task.complete
        const newTask = {...task, complete: newCompletedStatus}
        updateTask(newTask)
    }

    // Do not add key prop here
    return (
        <li onClick={onClick} className={className}>
            {task.name}
        </li>
    )
}

type TaskListProps = {
    tasks: Array<TaskData>
    updateTask: (task: TaskData) => Promise<void>
}

// REQUIREMENT: Display all tasks for a particular profile
const TaskList = ({ tasks, updateTask }: TaskListProps) => {
    const taskElements = tasks.map(task =>
        // add key prop here not in the underlying <li>
        // https://revelry.co/insights/development/dynamic-child-components-with-react/
        <TaskElement key={task.id} task={task} updateTask={updateTask}/>
    )
    return <ul>
        {taskElements}
    </ul>
}

type AddTaskProps = {
    profileId: string
    backend: Backend
    updateSummary: () => Promise<void>
    loadTasks: (profileId: string) => Promise<void>
}

// REQUIREMENT: Add a task
const AddTask = ({ profileId, backend, updateSummary, loadTasks }: AddTaskProps) => {
    const [newTaskName, setNewTaskName] = useState('')

    const onKeyUp = async (event: React.KeyboardEvent) => {
        // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
        const isEnterPressed: boolean = event.key === 'Enter'
        const isNewTaskNameNonEmpty: boolean = newTaskName !== ''
        if ( isEnterPressed && isNewTaskNameNonEmpty) {
            const task: CreateTaskData = {
                name: newTaskName,
                profile: profileId,
                complete: false
            }
            await backend.addTask(task)
            await updateSummary()
            setNewTaskName('')
            await loadTasks(profileId)
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const updatedTaskName = event.target.value
        setNewTaskName(updatedTaskName)
    }

    return <input
        value={newTaskName}
        onKeyUp={onKeyUp}
        onChange={onChange}
        placeholder={'Add new task here'}/>
}

type TaskProps = {
    backend: Backend
}

type TaskParams = {
    profileId: string
}

export const Task = ({ backend }: TaskProps) => {
    const { profileId }: TaskParams = useParams()

    const summaryContext: SummaryContextData = useSummaryContext()

    const [error, setError] = useState<Error | undefined>(undefined)

    const [tasks, setTasks] = useState<TaskData[]>([])

    const [profileName, setProfileName] = useState<string>('')

    const loadTasks = async (profileId: string) => handleAsyncError(setError, async () => {
        const profile: ProfileData = await backend.getProfile(profileId)
        setProfileName(profile.name)
        const tasksForProfile: Array<TaskData> = await backend.getTasksForProfile(profileId)
        setTasks(tasksForProfile)
    })

    const updateTask = async (task: TaskData) => {
        await backend.updateTask(task)
        await loadTasks(profileId)
    }

    // REQUIREMENT: Clear all completed tasks
    const onClickClearCompletedTasks = async (_: React.MouseEvent) => handleAsyncError(setError, async () => {
        const competedTasks: Array<TaskData> = tasks.filter(task => task.complete)
        const deletesF = competedTasks.map(async task => {
            const result = await backend.deleteTask(task.id)
            return result
        })
        await Promise.all(deletesF)
        await summaryContext.updateSummary()
        await loadTasks(profileId)
    })

    useEffect(() => {
        loadTasks(profileId)
    }, [])

    // REQUIREMENT: Navigate to profiles
    return <div className={'Task'}>
        <h2>Tasks for profile: {profileName}</h2>
        <ErrorElement error={error}/>
        <TaskList tasks={tasks} updateTask={updateTask}/>
        <AddTask profileId={profileId} backend={backend} updateSummary={summaryContext.updateSummary} loadTasks={loadTasks}/>
        <button onClick={onClickClearCompletedTasks}>Clear Completed Tasks</button>
        <a href={'/profile'}>Back to Profiles</a>
    </div>
}
