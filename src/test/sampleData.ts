import {TaskData} from "../task/Task";
import {ProfileData} from "../profile/Profile";

export type SampleDataTaskProp = {
    maybeProfileId?: string
    maybeComplete?: boolean
}

export interface SampleData {
    task: (props?: SampleDataTaskProp ) => TaskData
    taskArray: (quantity: number) => Array<TaskData>
    profile: (idMaybe?: string) => ProfileData
    profileArray: (quantity: number) => Array<ProfileData>
}

export const createSampleData = (): SampleData => {

    let index = 0

    const prefixStr = (prefix: string) => {
        return `${prefix}-${++index}`
    }

    const profile = (idMaybe?: string) => {
        return {
            id: (idMaybe) ? idMaybe : prefixStr('id'),
            name: prefixStr('name')
        }
    }


    const profileArray = (quantity: number) => {
        const profiles: Array<ProfileData> = [...Array(quantity)].map(_ => profile())
        return profiles
    }

    const task = (props?: SampleDataTaskProp): TaskData => {
        const id: string = prefixStr('id')
        const name: string = prefixStr('name')
        let complete: boolean =  false
        let profile: string =  prefixStr('profile-id')

        if ( props ) {
            if ( props.maybeProfileId ) {
                profile = props.maybeProfileId
            }
            if ( props.maybeComplete ) {
                complete = props.maybeComplete
            }
        }
        return {
            id,
            name,
            complete,
            profile
        }
    }

    const taskArray = (quantity: number) => {
        const tasks: Array<TaskData> = [...Array(quantity)].map(_ => task())
        return tasks
    }

    return {
        profile,
        profileArray,
        task,
        taskArray,
    }
}