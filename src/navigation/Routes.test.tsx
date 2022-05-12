import {render, RenderResult} from "@testing-library/react";
import {Routes} from "./Routes";
import {createMemoryHistory, History, LocationState} from "history";

const testRoute: (path: string, expected: string) => void =
    (path: string, expected: string) => {

        const history: History<LocationState> = createMemoryHistory()
        history.push(path)

        const profile = () => {
            return <div>test profile</div>
        }

        const task = () => {
            return <div>test task</div>
        }

        const routes = <Routes Profile={profile} Task={task} history={history}/>

        const rendered: RenderResult = render(routes)

        expect(rendered.getByText(expected)).toBeInTheDocument()
    }

test("/profile", () => {
    testRoute('/profile', 'test profile')
})

test("/", () => {
    testRoute('/', 'test profile')
})

test("/unexpected", () => {
    testRoute('/unexpected', 'test profile')
})

test("/task", () => {
    testRoute('/task', 'test profile')
})

test("/task/taskIdHere", () => {
    testRoute('/task/taskIdHere', 'test task')
})





