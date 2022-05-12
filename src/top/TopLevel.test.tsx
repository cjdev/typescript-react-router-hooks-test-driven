import {TopLevel} from "./TopLevel";
import {render, RenderResult} from "@testing-library/react";
import {SummaryContext, SummaryContextData} from "../summary/SummaryContext";
import React from "react";

test("render top level", () => {

    const routes = () => {
        return <div>routes component</div>
    }

    const summary = () => {
        return <div>summary component</div>
    }

        const value: SummaryContextData = {
            updateSummary: () => Promise.reject('no update to summary '),
            numberOfProfiles: -1,
            numberOfTasks: -1,
            error: undefined
        }

    const summaryProvider = ({ children }: {children: React.ReactNode}) => {
        return (
            <SummaryContext.Provider value={value}>
                <div>summary context</div>
                {children}
            </SummaryContext.Provider>
        )
    }

    const topLevel = <TopLevel Routes={routes} Summary={summary} SummaryProvider={summaryProvider}/>
    const rendered: RenderResult = render(topLevel)

    expect(rendered.getByText('routes component')).toBeInTheDocument()
    expect(rendered.getByText('summary component')).toBeInTheDocument()
    expect(rendered.getByText('summary context')).toBeInTheDocument()

})
