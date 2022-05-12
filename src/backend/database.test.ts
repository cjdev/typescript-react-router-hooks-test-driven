import {createDatabase, Database} from "./database";
import {stubResponse} from "../test/stubs";
import Namespace from "../namespace/namespace";


interface TestResponse {
    url: string,
    init?: RequestInit,
    response: string,
}

const setupFetchFunction = (responses: Array<TestResponse>) => {
    const handleRequest = async (input: RequestInfo, _?: RequestInit) => {

        const requestUrl: string =  ( typeof input  === "string" ) ? input : input.url

        const matchingResponse = responses.find(response => response.url === requestUrl )

        if ( matchingResponse ) {
            const response = stubResponse(matchingResponse.url, matchingResponse.response)
            const result: Promise<Response> = Promise.resolve(response)
            return result
        } else {
            const result: Promise<Response>  = Promise.reject(`no response defined for url '${requestUrl}'`)
            return result
        }
    }
    return handleRequest
}

test('add', async () => {
    // given
    const namespace = Namespace.PROFILE
    const id = 'the-id'
    const name = 'the-name'
    const value: any = { name }

    const response: TestResponse = {
        url: `/proxy/${namespace}`,
        init: {
            method: 'POST',
            body: JSON.stringify(value)
        },
        response: id,
    }

    const fetchFunction = setupFetchFunction([ response ])

    const database: Database = createDatabase(fetchFunction)

    // when
    const actual: string = await database.add(namespace, value)
    //then
    expect(actual).toEqual(id)
})

test('get', async () => {
    // given
    interface GetResponse {
        id: string
        name: string
    }
    const id = 'the-id'
    const name = 'the-name'
    const namespace= Namespace.PROFILE
    const responseJson: GetResponse= { id, name }
    const response: TestResponse = {
        url: `/proxy/${namespace}/${id}`,
        response: JSON.stringify(responseJson),
    }

    const fetchFunction = setupFetchFunction([ response ])
    const database: Database = createDatabase(fetchFunction)

    // when
    const actual: GetResponse = await database.get(namespace, id)

    // then
    expect(actual).toEqual(responseJson)
})

test('update', async () => {
    // given
    const namespace = Namespace.PROFILE
    const id = 'the-id'
    const name = 'the-name'
    const value: any = { id, name }

    const response: TestResponse = {
        url: `/proxy/${namespace}/${id}`,
        init: {
            method: 'POST',
            body: JSON.stringify(value)
        },
        response: id
    }

    const fetchFunction = setupFetchFunction([ response ])
    const database: Database = createDatabase(fetchFunction)

    // when
    const actual: String = await database.update(namespace, value)
    //then
    expect(actual).toEqual(id)
})

test('remove', async () => {
    // given
    const namespace = Namespace.PROFILE
    const id = 'the-id'

    const response = 'the-response'

    const fetchFunction = setupFetchFunction([
        {
            url: `/proxy/${namespace}/${id}`,
            init: {
                method: 'DELETE',
            },
            response
        }
    ])
    const database: Database = createDatabase(fetchFunction)

    // when
    const actual = await database.remove(namespace, id)

    // then
    expect(actual).toEqual(response)
})

test('list', async () => {

    interface ListResult {
        name: string
    }

    // given
    const namespace = Namespace.PROFILE
    const element1: ListResult = {name: 'foo'}
    const element2: ListResult = {name: 'bar'}
    const elements = [element1, element2]
    const fetchFunction = setupFetchFunction([
        {
            url: `/proxy/${namespace}`,
            response: JSON.stringify(elements)
        }
    ])
    const database = createDatabase(fetchFunction)

    // when
    const actual: Array<ListResult> = await database.list(namespace)

    // then
    expect(actual).toEqual(elements)
})

test('handle malformed json', async () => {
    // given
    const namespace = Namespace.PROFILE
    const response = '<div>this is not json</div>'
    const fetchFunction = setupFetchFunction([
        {
            url: `/proxy/${namespace}`,
            response
        }
    ])
    const database = createDatabase(fetchFunction)

    // then
    await expect(database.list(namespace)).rejects.toThrow(`fetchJson {"resourceUri":"${namespace}"}, expected json but got '${response}'`)
})



