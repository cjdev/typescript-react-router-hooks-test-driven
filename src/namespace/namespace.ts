
const Namespace = {
    PROFILE: 'profile',
    TASK: 'task'
} as const

type valueof<T> = T[keyof T]
export type NamespaceName = valueof<typeof Namespace>

export default Namespace