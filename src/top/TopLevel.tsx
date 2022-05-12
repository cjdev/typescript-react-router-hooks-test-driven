import React from "react";

interface TopLevelProps {
    Routes: React.ComponentType
    Summary: React.ComponentType
    SummaryProvider: React.ComponentType<{ children: React.ReactNode }>
}

export const TopLevel = ({ Routes, Summary, SummaryProvider }: TopLevelProps): React.ReactElement => {
    // need to set key property or else there are warnings
    return (
        <SummaryProvider>
            <Routes key={'routes'}/>
            <Summary key={'summary'}/>
        </SummaryProvider>
    )
}
