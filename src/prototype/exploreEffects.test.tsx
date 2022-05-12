import React, {useEffect, useState} from "react";
import {render, RenderResult} from "@testing-library/react";
import {act} from "react-dom/test-utils";

describe("learn effect", () => {

    interface User {
        name: string,
        age: string,
        address: string
    }

    type UserComponentProps = {
        id: string,
        fetchContract: (id: string) => Promise<User>
    }

    function UserComponent({id, fetchContract}: UserComponentProps): React.ReactElement {

        const initialUser: User = {
            name: '',
            age: '',
            address: '',
        }

        const [user, setUser]: [User, ((value: (((prevState: User) => User) | User)) => void)] = useState(initialUser)

        async function fetchUserData(id: string) {
            const response: User = await fetchContract('/' + id)
            setUser(response)
        }

        useEffect(() => {
            fetchUserData(id)
        },[id])

        return  <details>
            <summary>{user.name}</summary>
            <strong>{user.age}</strong>
            <br/>
            lives in {user.address}
        </details>
    }

    test('user renders user data', async () => {

        const testUser: User = {
            name: "joe bob",
            age: "15",
            address: "123 fake dr, fakerson USA"
        }
        const fetchContract: (id: string) => Promise<User> = () => {
            return Promise.resolve(testUser)
        };
        const userComponent: React.ReactElement = <UserComponent id="123" fetchContract={fetchContract}/>

        let container: RenderResult | undefined
        // Using act ensures that all the async gets resolved before checking values when using useEffect
        await act(async () => {
            container = render(userComponent);
        });

        if ( container ) {
            // container.debug()

            expect(container.getByText(testUser.name)).toBeInTheDocument()
            expect(container.getByText(testUser.age)).toBeInTheDocument()
            expect(container.getByText(/123 fake dr, fakerson USA/)).toBeInTheDocument()
        } else {
            expect('no user data').toBe('some user data from effect')
        }
    })

})