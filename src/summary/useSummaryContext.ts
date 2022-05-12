import {useContext} from "react";
import {SummaryContext, SummaryContextData} from "./SummaryContext";

const useSummaryContext = (): SummaryContextData => useContext(SummaryContext)

export default useSummaryContext
