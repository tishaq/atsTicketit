import React, { useState } from 'react';
import axios from 'axios';
import sha from 'js-sha512';
import { MDBDataTable } from "mdbreact";
import moment from "moment";
import DateRangePicker from "react-bootstrap-daterangepicker";
import * as util from "./util"
import loader from "./loader.gif"
import Async from 'react-async';
import Menu from './components/Menu';
import Nav from './components/Nav';


export default function AgentPayments() {
    const [startDate, setStartDate] = useState(util.getTodayDate(new Date()));
    const [stopDate, setStopDate] = useState(util.getTodayDate(new Date()));
    const [agentId, setAgentId] = useState("");
    const [payments, setPayments] = useState([]);
    const [paymentSummary, setPaymentSummary] = useState({});
    const [paymentSummaryTotal, setPaymentSummaryTotal] = useState("");
    const [loadButtonStatus, setLoadButtonStatus] = useState(true);
    const [isLoader, setIsLoader] = useState(false);
    const [toggleMenu, setToggleMenu] = useState(false);

    const paymentDataTable = {

        columns: [
            {
                label: 'S/N',
                field: 'sn',
                sort: 'asc',

            },
            {
                label: 'Payment Id',
                field: 'paymentId',
                sort: 'asc',

            },
            {
                label: 'Tax Id',
                field: 'taxId',
                sort: 'asc',

            },
            {
                label: 'Transaction Code',
                field: 'transactionId',
                sort: 'asc',

            },
            {
                label: 'Bill Ref.',
                field: 'billRef',
                sort: 'asc',

            },
            {
                label: 'Amount',
                field: 'totalAmount',
                sort: 'asc',

            },
            {
                label: 'Date',
                field: 'date',
                sort: 'asc',

            }
        ],
        rows: payments.map((payment, index) => ({

            sn: index + 1,
            paymentId: payment.id,
            taxId: payment.taxId,
            transactionId: payment.transactionId,
            billRef: payment.billRef,
            totalAmount: util.formatMoney(payment.totalAmount),
            date: payment.date
        }))
    };
    const paymentSummaryDataTable = {
        columns: [
            {
                label: 'S/N',
                field: 'sn',
                sort: 'asc',

            },
            {
                label: 'Tax Id',
                field: 'taxId',
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
        rows: Object.entries(paymentSummary).map((payment, index) => ({
            sn: index + 1,
            taxId: payment[0],
            quantity: payment[1].length,
            amount: util.formatMoney(payment[1].reduce((curr, prev) => curr + prev))
        }))
    };
    const loadAgentpayments = async (start, end) => {
        setIsLoader(true);
        setStartDate(util.getTodayDate(start));
        setStopDate(util.getTodayDate(end));

        const userName = "atstest";
        const apiKey = "atstest";
        const hash = sha.sha512(userName + apiKey + agentId + util.getTodayDate(start) + util.getTodayDate(end) + "-23");
        // console.log(hash);
        // console.log(userName + apiKey + agentId + startDate + stopDate);
        if (agentId === "") {
            setIsLoader(false);
            return;
        }
        try {
            const res = await axios.get("https://atstest.ajisaqsolutions.com/api/aggregator/getAgentPayments?userName="
                + userName + "&apiKey=" + apiKey + "&agentId="
                + agentId + "&startDate=" + util.getTodayDate(start) + "&stopDate=" + util.getTodayDate(end) + "-23&hash=" + hash);
            // console.log(res.data);
            if (res.data.status === "OK") {
                let d = {};
                let total = 0;
                res.data.data.forEach((element) => {
                    const taxId = element.taxId;
                    if (!d[taxId]) {
                        d[taxId] = [];
                    }

                    d[taxId].push(element.totalAmount);
                    total += element.totalAmount;

                });
                setPaymentSummary(d);
                setPaymentSummaryTotal(util.formatMoney(total));
                setPayments(res.data.data);

                // console.log(payments);


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
        const res = await axios.get("https://atstest.ajisaqsolutions.com/api/aggregator/listAgent?userName="
            + userName + "&apiKey=" + apiKey + "&hash=" + hash);
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
                            <h2 style={{ color: "#5A0028" }}>Payments</h2>
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
                            {"  "}
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

                                    loadAgentpayments(p.startDate._d, p.endDate._d);

                                }}>

                                {isLoader ? <img src={loader} width="150" height="100" alt="Loading ..." /> :
                                    <button className="btn btn-user" disabled={loadButtonStatus}
                                        style={{ backgroundColor: '#AC3B61', color: '#fff' }}>
                                        <span className="fa fa-calendar-plus"></span>&nbsp;&nbsp;{startDate} - {stopDate}
                                        &nbsp;&nbsp;<span className="fa fa-caret-down"></span></button>}
                            </DateRangePicker>


                        </center>
                        <br />
                        <div className="container-fluid">
                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="card shadow mb-lg-1">
                                    <div className="card-header py-3"
                                        style={{
                                            background: 'linear-gradient(to bottom, #EDC7B7, #FFFFFF)', color: '#5A0028'
                                        }}>
                                        <h6 className="font-weight-bold text-dark text-center" > Payments Summary {paymentSummaryTotal ? paymentSummaryTotal : ""} </h6>
                                    </div>


                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {isLoader ? <center><img src={loader} alt="Loading ..." /></center> :
                                                <MDBDataTable
                                                    striped
                                                    bordered
                                                    hover
                                                    data={paymentSummaryDataTable}
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
                                        <h6 className="font-weight-bold text-dark text-center" > Payments Records {agentId ? " ( " + agentId + " )" : ""} </h6>
                                    </div>


                                    <div className="card-body">
                                        <div className="table-responsive">
                                            {isLoader ? <center><img src={loader} alt="Loading ..." /></center> :
                                                <MDBDataTable
                                                    striped
                                                    bordered
                                                    hover
                                                    data={paymentDataTable}
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
        </div >
    )
}
