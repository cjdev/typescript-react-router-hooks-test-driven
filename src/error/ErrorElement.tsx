import React from "react";
import './ErrorElement.css'

type ErrorProps = {
    error?: Error
}

export const ErrorElement = ({ error }: ErrorProps): (React.ReactElement | null) => {
    if (typeof error === 'undefined') {
        return null
    } else {
        return <div className={'errorElement'}>{error.message}</div>
    }
}