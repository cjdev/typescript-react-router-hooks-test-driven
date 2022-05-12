import React, {useEffect, useState} from "react";
import {SummaryContext} from "./SummaryContext";
import {Backend} from "../backend/backend";
import {SummaryData} from "./SummaryData";
import {handleAsyncError} from "../error/Errors";

export type SummaryProps = {
    backend: Backend,
    children: React.ReactNode,
}

export const SummaryProvider = ({ backend, children }: SummaryProps) => {
    const [numberOfProfiles, setNumberOfProfiles] = useState<number>(0)

    const [numberOfTasks, setNumberOfTasks] = useState<number>(0)

    const [error, setError] = useState<Error | undefined>(undefined)

    const updateSummary = async () => handleAsyncError(setError, async () => {
        const summaryData: SummaryData = await backend.fetchSummary()
        setNumberOfProfiles(summaryData.numberOfProfiles)
        setNumberOfTasks(summaryData.numberOfTasks)
    })

    useEffect(() => {
        updateSummary()
    }, [])

    return (
        <SummaryContext.Provider value={{updateSummary, numberOfProfiles, numberOfTasks, error}}>
            {children}
        </SummaryContext.Provider>
    )
}
