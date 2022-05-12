
import React from "react";

export interface SummaryContextData {
    updateSummary: () => Promise<void>
    numberOfProfiles: number
    numberOfTasks: number
    error: Error | undefined
}

// way around default value
// https://medium.com/@rivoltafilippo/typing-react-context-to-avoid-an-undefined-default-value-2c7c5a7d5947
export const SummaryContext: React.Context<SummaryContextData> = React.createContext<SummaryContextData>({} as SummaryContextData)
