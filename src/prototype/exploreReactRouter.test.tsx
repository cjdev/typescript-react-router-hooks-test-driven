import {createMemoryHistory, History, MemoryHistory} from "history";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {render, RenderResult} from "@testing-library/react";
import React from "react";

// https://testing-library.com/docs/example-react-router/
describe("learning react router", () => {

    const Foo: () => React.ReactElement =
        () => <div>Foo</div>
    const Bar: () => React.ReactElement =
        () => <div>Bar</div>

    const fooPath: string = '/foo'

    const TestRoutes: (history: History) => React.ReactElement =
        (history: History) => (
            <Router history={history}>
                <Switch>
                    <Route exact path={fooPath}>
                        <Foo/>
                    </Route>
                    <Route path='/foo/bar'>
                        <Bar/>
                    </Route>
                    <Route path='/bar'>
                        <Bar/>
                    </Route>
                    <Route>
                        <Redirect to={fooPath}/>
                    </Route>
                </Switch>
            </Router>
        )

    test("react router foo",() => {

        const history: MemoryHistory = createMemoryHistory()
        const route: string = '/foo'
        history.push(route)

        const containerElem: React.ReactElement = TestRoutes(history)
        const renderedContainer: RenderResult = render(containerElem)

        const actualHtmlStr: string = renderedContainer.container.innerHTML
        expect(actualHtmlStr).toMatch('Foo')

        const actualPathName: string = history.location.pathname
        expect(actualPathName).toBe('/foo')


    })

    test("react router bar",() => {

        const history: MemoryHistory = createMemoryHistory()
        const route: string = '/bar'
        history.push(route)

        const containerElem: React.ReactElement = TestRoutes(history)
        const renderedContainer: RenderResult = render(containerElem)

        const actualHtmlStr: string = renderedContainer.container.innerHTML
        expect(actualHtmlStr).toMatch('Bar')

        const actualPathName: string = history.location.pathname
        expect(actualPathName).toBe('/bar')


    })

    test("react router bar - exercising 'exact' parameter",() => {

        const history: MemoryHistory = createMemoryHistory()
        const route: string = '/foo/bar'
        history.push(route)

        const containerElem: React.ReactElement = TestRoutes(history)
        const renderedContainer: RenderResult = render(containerElem)

        const actualHtmlStr: string = renderedContainer.container.innerHTML
        expect(actualHtmlStr).toMatch('Bar')

        const actualPathName: string = history.location.pathname
        expect(actualPathName).toBe('/foo/bar')


    })

    test("react router unexpected default",() => {

        const history: MemoryHistory = createMemoryHistory()

        const containerElem: React.ReactElement = TestRoutes(history)
        const renderedContainer: RenderResult = render(containerElem)

        const container: HTMLElement = renderedContainer.container

        const actualPathName: string = history.location.pathname
        expect(actualPathName).toBe('/foo')

        const actualHtmlStr: string = container.innerHTML
        expect(actualHtmlStr).toMatch('Foo')

        expect(renderedContainer.getByText('Foo')).toBeInTheDocument()

    })

    test("react router unexpected baz",() => {

        const history: MemoryHistory = createMemoryHistory()

        const route: string = '/baz'
        history.push(route)

        const containerElem: React.ReactElement = TestRoutes(history)
        const renderedContainer: RenderResult = render(containerElem)

        const container: HTMLElement = renderedContainer.container

        const actualPathName: string = history.location.pathname
        expect(actualPathName).toBe('/foo')

        const actualHtmlStr: string = container.innerHTML
        expect(actualHtmlStr).toMatch('Foo')

        expect(renderedContainer.getByText('Foo')).toBeInTheDocument()

    })

})