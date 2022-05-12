import React from "react";
import {Redirect, Route, Router, Switch} from "react-router-dom";
import {History} from "history";
import LocationState = History.LocationState;

/*
 * DONE
 * * REQUIREMENT: Profiles and Tasks are displayed on different pages
 * * REQUIREMENT: Bookmarked pages should work
 * * REQUIREMENT: Back button should work
 */

export interface RoutesProps {
    history: History<LocationState>
    Task: React.ComponentType
    Profile: React.ComponentType
}

export const Routes = ({ history, Task, Profile }: RoutesProps) => {
    return (
        <Router history={history}>
            <Switch>
                <Route path={'/profile'}>
                    <Profile/>
                </Route>
                <Route path={'/task/:profileId'}>
                    <Task/>
                </Route>
                <Route>
                    <Redirect to={'/profile'}/>
                </Route>
            </Switch>
        </Router>
    )
}