import React, {ReactNode} from "react";
import {render, RenderResult} from "@testing-library/react";

describe("learn class vs functional components", () => {
    test('render class component',() => {

        type TestClassProps = {
            name: ReactNode
        }

        type TestState = {
        }

        class TestClassComponent extends React.Component<TestClassProps, TestState> {
            render() {
                return <div>Hello {this.props.name}</div>;
            }
        }

        const element = <TestClassComponent name="bob"/>
        const actualClassComponent = render(element)
        expect(actualClassComponent.getByText('Hello bob')).toBeInTheDocument()
    })



    test('render class component with children',() => {

        class TestClassWithChildren extends React.Component {
            render() {
                return <div>
                    <h1>hi children</h1>
                    {this.props.children}
                </div>
            }
        }

        const element: React.ReactElement = <TestClassWithChildren>
            <div>child 1</div>
            <div>child 2</div>
        </TestClassWithChildren>
        const actualClassComponent = render(element)
        expect(actualClassComponent.getByText('hi children')).toBeInTheDocument()
        expect(actualClassComponent.getByText('child 1')).toBeInTheDocument()
        expect(actualClassComponent.getByText('child 2')).toBeInTheDocument()
    })

    test('render functional component', () => {

        const FunctionComponent: (name: String) => React.ReactElement = (name: String) => <h1>What {name}</h1>

        const actualComponent: RenderResult = render(FunctionComponent('bob'))
        expect(actualComponent.getByText('What bob')).toBeInTheDocument()
    })


    test('render functional component with children',() => {
        type TestChildrenProps = {
            children: ReactNode
        }
        const FunctionComponentWithChildren: (props: TestChildrenProps) => React.ReactElement = (props: TestChildrenProps) => <h1>hello {props.children} of the world</h1>
        const element = <FunctionComponentWithChildren>
            <div>child 1</div>
            <div>child 2</div>
        </FunctionComponentWithChildren>

        const actualComponent: RenderResult = render(element)

        expect(actualComponent.getByText('hello of the world')).toBeInTheDocument()
        expect(actualComponent.getByText('child 1')).toBeInTheDocument()
        expect(actualComponent.getByText('child 2')).toBeInTheDocument()
    })
})
