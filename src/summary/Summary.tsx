import React from "react";
import './Summary.css'
import useSummaryContext from "./useSummaryContext";
import {SummaryContextData} from "./SummaryContext";

/*
 * DONE
 *  REQUIREMENT: Immediately update as the underlying data changes
 *  REQUIREMENT: Display the total number of profiles
 *  REQUIREMENT: Display the total number of tasks
 *  REQUIREMENT: Be visible on every page
 */

export const Summary = () => {
    const summary: SummaryContextData = useSummaryContext()
    const numberOfTasks: number  = summary.numberOfTasks
    const numberOfProfiles: number  = summary.numberOfProfiles

    return (
        <div className={'Summary'}>
            <div>Summary</div>
            <div>Number of profiles = {numberOfProfiles}</div>
            <div>Number of tasks across all profiles = {numberOfTasks}</div>
        </div>
    )
}