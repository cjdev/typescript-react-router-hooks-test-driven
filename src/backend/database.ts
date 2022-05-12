
import * as R from 'ramda'
import Namespace, {NamespaceName} from "../namespace/namespace";

/*
 * CRUD
 * setup requests to webdb
 * * DELETE
 * * GET
 * * get json
 * * * get single
 * * * get list
 * * POST (add)
 */

// CRUD plus list
export interface Database {
    add: (namespace: NamespaceName, value: any) => Promise<string>,
    get: (namespace: NamespaceName, id: string) => Promise<any>,
    update: (namespace: NamespaceName, value: any) => Promise<String>,
    remove: (namespace: NamespaceName, id: string) => Promise<string>,
    list: (namespace: NamespaceName) => Promise<Array<any>>
}

export const createDatabase = (fetchFunction: (input: RequestInfo, init?: RequestInit) => Promise<Response>): Database => {
    const fetchText = async(resourceUri: string, init?: RequestInit): Promise<string> => {
        const resource: string = `/proxy/${resourceUri}`
        const response: Response = await fetchFunction(resource, init)
        const text: string = await response.text()
        return text
    }

    const fetchJson = async(resourceUri: string, init?: RequestInit): Promise<any | undefined> => {
        const text: string = await fetchText(resourceUri, init)
        try {
            const json: any = JSON.parse(text)
            return json
        } catch (e) {
            const inputValue: { resourceUri: string, init: RequestInit | undefined } = {resourceUri, init}
            const inputStr: string = JSON.stringify(inputValue)
            const message: string = `fetchJson ${inputStr}, expected json but got '${text}'`
            throw Error(message)
        }
    }

    function createUri(namespace: NamespaceName, id: string): string {
        return `${namespace}/${id}`
    }

    const remove  = async(namespace: NamespaceName, id: string): Promise<string> => {
        const uri: string = createUri(namespace, id)
        const init: RequestInit = {
            method: 'DELETE'
        }
        const result: string = await fetchText(uri, init)
        return result
    }

    const add  = async(namespace: NamespaceName, value: any): Promise<string> => {
        const jsonStr: string = JSON.stringify(value)
        const init: RequestInit = {
            method: 'POST',
            body: jsonStr
        }
        const result: string = await fetchText(namespace, init)
        return result
    }

    const get = async(namespace: NamespaceName, id: string): Promise<any> => {
        const uri: string = createUri(namespace, id)
        const result: any = await fetchJson(uri)
        return result
    }

    const update = async(namespace: NamespaceName, value: any): Promise<String> => {
        const id: string = value.id
        const uri: string = createUri(namespace, id)
        const bodyStr: string = JSON.stringify(value)
        const init: RequestInit = {
            method: 'POST',
            body: bodyStr
        }
        const result: String = await fetchText(uri, init)
        return result
    }

    const list = async(namespace: NamespaceName): Promise<Array<any>> => {
        const json: any = await fetchJson(namespace)
        const array: Array<any> = R.values(json)
        return array
    }

    const database: Database = {
        add,
        get,
        update,
        remove,
        list
    }

    return database
}
