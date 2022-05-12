import {Routes} from "./navigation/Routes";
import {createBrowserHistory, History} from "history";
import LocationState = History.LocationState;
import { Summary} from "./summary/Summary";
import {TopLevel} from "./top/TopLevel";
import {Task} from "./task/Task";
import {createDatabase, Database} from "./backend/database";
import {Backend, createBackend} from "./backend/backend";
import { SummaryProvider } from "./summary/SummaryProvider";
import {Profile} from "./profile/Profile";
import React from "react";

const fetchContract: FetchApi = fetch

const database: Database = createDatabase(fetchContract)

const backend: Backend = createBackend(database)

const history: History<LocationState> = createBrowserHistory()

const TaskIml = () => <Task backend={backend}/>

const ProfileImpl = () => <Profile backend={backend}/>

const RoutesImpl = () => <Routes Profile={ProfileImpl} Task={TaskIml} history={history}/>

const SummaryImpl = () => <Summary/>

const SummaryProviderImpl = ({ children }: { children: React.ReactNode }) => <SummaryProvider children={children} backend={backend}/>

const TopLevelImpl = (): React.ReactElement => {
    return <TopLevel Routes={RoutesImpl} Summary={SummaryImpl} SummaryProvider={SummaryProviderImpl}/>
}

export default TopLevelImpl
