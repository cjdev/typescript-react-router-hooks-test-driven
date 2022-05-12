import R from "ramda";

describe('learning ramda', () => {

    interface BasicTask {
        id: string,
        name: number
    }

    test('object to array via R.values', () => {

        function createBasicTask(i: number): BasicTask {
            const bc: BasicTask = {
                id: `${i}`,
                name: i
            }
            return bc
        }

        const tasksJsonStr = `[ {
            "name" : 1,
            "id" : "1"
        }, {
            "name" : 2,
            "id" : "2"
        }, {
            "name" : 3,
            "id" : "3"
        }, {
            "name" : 4,
            "id" : "4"
        } ]`

        const tasksObj = JSON.parse(tasksJsonStr)

        const actual: Array<BasicTask> = R.values(tasksObj)

        const t1: BasicTask = createBasicTask(1)
        const t2: BasicTask = createBasicTask(2)
        const t3: BasicTask = createBasicTask(3)
        const t4: BasicTask = createBasicTask(4)


        const expected: Array<BasicTask> = [t1, t2, t3, t4]

        expect(actual).toEqual(expected)
    })

})