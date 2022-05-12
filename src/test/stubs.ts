import {Backend} from "../backend/backend";
import {CreateTaskData, TaskData} from "../task/Task";
import {Database} from "../backend/database";

export const stubResponse = (url: string, text: string): Response => {
    const response: Response = {
        arrayBuffer(): Promise<ArrayBuffer> {
            return Promise.resolve({} as ArrayBuffer);
        },
        blob(): Promise<Blob> {
            return Promise.resolve({} as Blob);
        },
        body: null,
        bodyUsed: false,
        clone(): Response {
            return this
        },
        formData(): Promise<FormData> {
            return Promise.resolve({} as FormData);
        },
        headers: {} as Headers,
        json(): Promise<any> {
            return Promise.resolve(JSON.parse(text));
        },
        ok: false,
        redirected: false,
        status: 0,
        statusText: "",
        text(): Promise<string> {
            return Promise.resolve(text);
        },
        type: {} as ResponseType,
        url: url

    }
    return response
}

export const stubBackend = (): Backend => {
    return {
        fetchSummary: () => Promise.reject('no fetchSummary method defined'),
        getProfiles: () => Promise.reject('no getProfiles method defined'),
        deleteProfileAndAssociatedTasks: (id: string) => Promise.reject('no deleteProfileAndAssociatedTasks method defined'),
        addProfile: (name: string) => Promise.reject('no addProfile method defined'),
        getTasksForProfile: (profileId: string) => Promise.reject('no getTasksForProfile method defined'),
        getProfile: (profileId: string) => Promise.reject('no getProfile method defined'),
        addTask: (task: CreateTaskData) => Promise.reject('no addTask method defined'),
        updateTask: (task: TaskData) => Promise.reject('no updateTask method defined'),
        deleteTask: (id: string) => Promise.reject('no deleteTask method defined'),
    }
}

export const stubDatabase: Database = {
    add(namespace: string, value: any): Promise<string> {
        return Promise.reject('add not defined')
    },
    get(namespace: string, id: string): Promise<any> {
        return Promise.reject('get not defined')
    },
    list(namespace: string): Promise<Array<any>> {
        return Promise.reject('list not defined')
    },
    remove(namespace: string, id: string): Promise<string> {
        return Promise.reject('remove not defined')
    },
    update(namespace: string, value: any): Promise<String> {
        return Promise.reject('update not defined')
    }
}