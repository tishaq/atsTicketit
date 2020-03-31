import React from 'react'
import {
    Switch,
    Route,
    BrowserRouter

} from "react-router-dom";
import App from './App';
import AgentPayments from './AgentPayments'
import AgentTickets from './AgentTickets'
export default function Router() {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/"><App /></Route>
                <Route exact path="/payments"><AgentPayments /></Route>
                <Route exact path="/tickets"><AgentTickets /></Route>
            </Switch>
        </BrowserRouter>
    )
}