import React, { useState } from 'react';
import axios from 'axios';
import sha from 'js-sha512';
import { MDBDataTable } from "mdbreact";
import * as util from "./util";
import loader from "./loader.gif"
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import Async from 'react-async';
import Menu from './components/Menu';
import Nav from './components/Nav';
export default function AgentTickets() {
    const [startDate, setStartDate] = useState(util.getTodayDate(new Date()));
    const [stopDate, setStopDate] = useState(util.getTodayDate(new Date()));
    const [agentId, setAgentId] = useState("");
    const [tickets, setTickets] = useState([]);
    const [ticketSummary, setTicketSummary] = useState({});
    const [ticketSummaryTotal, setTicketSummaryTotal] = useState(0);
    const [loadButtonStatus, setLoadButtonStatus] = useState(true);
    const [isLoader, setIsLoader] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);

    const ticketDataTable = {
        columns: [
            {
                label: 'S/N',
                field: 'sn',
                sort: 'asc',

            },
            {
                label: 'Ticket Id',
                field: 'ticketId',
                sort: 'asc',

            },
            {
                label: 'Tax Id',
                field: 'taxId',
                sort: 'asc',

            },
            {
                label: 'Ticket Type',
                field: 'ticketType',
                sort: 'asc',

            },
            {
                label: 'Item Name',
                field: 'itemName',
                sort: 'asc',

            },
            {
                label: 'Quantity',
                field: 'quantity',
                sort: 'asc',

            },
            {
                label: 'Amount',
                field: 'amount',
                sort: 'asc',

            },
            {
                label: 'Date',
                field: 'date',
                sort: 'asc',

            }
        ],
        rows: tickets.map((ticket, index) => ({

            sn: index + 1,
            ticketId: ticket.id,
            taxId: ticket.taxId,
            ticketType: ticket.ticketType,
            itemName: ticket.itemName,
            quantity: ticket.quantity,
            amount: util.formatMoney(ticket.fee * ticket.quantity),
            date: ticket.date
        }))
    };
    const ticketSummaryDataTable = {
        columns: [
            {
                label: 'S/N',
                field: 'sn',
                sort: 'asc',

            },
            {
                label: 'Colletion',
                field: 'collection',
                sort: 'asc',

            },
            {
                label: 'Quantity',
                field: 'quantity',
                sort: 'asc',

            },
            {
                label: 'Amount',
                field: 'amount',
                sort: 'asc',

            }
        ],
        rows: Object.entries(ticketSummary).map((ticket, index) => ({
            sn: index + 1,
            collection: ticket[0],
            quantity: ticket[1].length,
            amount: util.formatMoney(ticket[1].reduce((curr, prev) => curr + prev))
        }))
    };
    const loadAgentTickets = async (start, end) => {
        setIsLoader(true);
        setStartDate(util.getTodayDate(start));
        setStopDate(util.getTodayDate(end));
        let d = {};
        const userName = "atstest";
        const apiKey = "atstest";
        const hash = sha.sha512(userName + apiKey + agentId + util.getTodayDate(start) + util.getTodayDate(end));
        // console.log(hash);
        // console.log(userName + apiKey + agentId + startDate + stopDate);
        if (agentId === "") {
            setIsLoader(false);
            return;
        }
        try {
            const res = await axios.get("https://cors-anywhere.herokuapp.com/https://atstest.ajisaqsolutions.com/api/aggregator/getAgentTickets?userName="
                + userName + "&apiKey=" + apiKey + "&agentId="
                + agentId + "&startDate=" + util.getTodayDate(start) + "&stopDate=" + util.getTodayDate(end) + "&hash=" + hash, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
            if (res.data.status === "OK") {
                let total = 0;
                res.data.data.forEach((element) => {
                    const item = element.ticketType + "/" + element.itemName;
                    if (!d[item]) {
                        d[item] = [];
                    }

                    d[item].push(element.fee * element.quantity);
                    total += element.fee * element.quantity

                });
                // console.log(d);
                setTicketSummary(d);
                setTicketSummaryTotal(util.formatMoney(total));
                setTickets(res.data.data);

                // console.log(ticketSummary);


            }
        } catch (error) {
            console.log(error);
        }

        setIsLoader(false);
    };
    const loadAgents = async () => {
        const userName = "atstest";
        const apiKey = "atstest";
        const hash = sha.sha512(userName + apiKey);
        // console.log(hash);
        const res = await axios.get("https://cors-anywhere.herokuapp.com/https://atstest.ajisaqsolutions.com/api/aggregator/listAgent?userName="
            + userName + "&apiKey=" + apiKey + "&hash=" + hash, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        });
        // console.log(res.data);

        return res.data
    };
    return (
        <div id="wrapper" >
            <Menu setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Nav setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />
                    <div className="container-fluid">
                        <center>
                            <h2 style={{ color: "#5A0028" }}>Tickets</h2>
                            <select className="form-control-sm" style={{
                                backgroundColor: '#fff', color: '#AC3B61', border: '3px solid #AC3B61'
                            }}
                                defaultValue="selected" onChange={e => { setAgentId(e.target.value); setLoadButtonStatus(false); }}>

                                <option disabled value="selected">--Select Agent--</option>
                                <Async promiseFn={loadAgents}>
                                    {({ data, error, isPending }) => {
                                        if (data) {
                                            if (data.status === "OK") {
                                                return data.data.map((agent, index) => (
                                                    <option key={index} value={agent.id}>{agent.name}--{agent.id}</option>
                                                ))
                                            }
                                        }
                                        if (error) {
                                            return <option disabled value="selected">Error Loading</option>
                                        }
                                        if (isPending) {
                                            return <option disabled value="selected">Loading Agents ...</option>

                                        }
                                    }}

                                </Async>
                            </select>
                            <DateRangePicker startDate={new Date()}
                                endDate={new Date()}
                                ranges={{
                                    'Today': [moment(), moment()],
                                    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
                                    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
                                    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
                                    'This Month': [moment().startOf('month'), moment().endOf('month')],
                                    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
                                }}
                                showCustomRangeLabel={true}

                                onApply={(e, p) => {

                                    loadAgentTickets(p.startDate._d, p.endDate._d);

                                }}>

                                {isLoader ? <img src={loader} width="150" height="100" alt="Loading ..." /> :
                                    <button className="btn btn-user" disabled={loadButtonStatus}
                                        style={{ backgroundColor: '#AC3B61', color: '#fff' }}>
                                        <span className="fa fa-calendar-plus"></span>&nbsp;&nbsp;{startDate} - {stopDate}
                                        &nbsp;&nbsp;<span className="fa fa-caret-down"></span></button>}
                            </DateRangePicker>



                            {/* {"  "}
                From : {"  "}<input type="date" onChange={e => setStartDate(e.target.value)} defaultValue={util.getTodayDate()} />{"  "}
                To : {"  "}<input type="date" onChange={e => setStopDate(e.target.value)} defaultValue={util.getTodayDate()} />{"  "}
                {isLoader ? <img src={loader} width="150" height="100" alt="Loading ..." /> : <button onClick={loadAgentTickets} className="btn btn-user col-sm-1"
                    style={{ backgroundColor: '#AC3B61', color: '#fff' }} disabled={loadButtonStatus}>
                    Load</button>} */}

                        </center>
                        <br />
                        <div className="container-fluid">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="card shadow mb-lg-1">
                                    <div className="card-header py-3"
                                        style={{
                                            background: 'linear-gradient(to bottom, #EDC7B7, #FFFFFF)', color: '#5A0028'
                                        }}>
                                        <h6 className="font-weight-bold text-dark text-center" > Ticket Summary {ticketSummaryTotal ? ticketSummaryTotal : ""} </h6>
                                    </div>


                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {isLoader ? <center><img src={loader} alt="Loading ..." /></center> :
                                                <MDBDataTable
                                                    striped
                                                    bordered
                                                    hover
                                                    data={ticketSummaryDataTable}
                                                />
                                            }
                                        </div>

                                    </div>


                                </div>
                            </div>
                        </div>
                        <div className="container-fluid">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="card shadow mb-lg-1">
                                    <div className="card-header py-3"
                                        style={{
                                            background: 'linear-gradient(to bottom, #EDC7B7, #FFFFFF)', color: '#5A0028'
                                        }}>
                                        <h6 className="font-weight-bold text-dark text-center" > Ticket Records {agentId ? " ( " + agentId + " )" : ""} </h6>
                                    </div>


                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {isLoader ? <center><img src={loader} alt="Loading ..." /></center> :
                                                <MDBDataTable
                                                    striped
                                                    bordered
                                                    hover
                                                    data={ticketDataTable}
                                                />
                                            }
                                        </div>

                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}
