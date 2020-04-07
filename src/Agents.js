import React, { useState, useEffect } from 'react'
import DateRangePicker from "react-bootstrap-daterangepicker";
import { MDBDataTable } from "mdbreact";
import Menu from './components/Menu';
import Nav from './components/Nav';
import loader from "./loader.gif"
import { Async } from 'react-async';
import axios from 'axios';
import sha from 'js-sha512';
import * as util from "./util";


export default function Agents() {
    const [toggleForm, setToggleForm] = useState(true);
    const [formErrors, setFormErrors] = useState("");
    const [toggleMenu, setToggleMenu] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [agents, setAgents] = useState([]);

    const [agentName, setAgentName] = useState("");
    const [agentPhoneNumber, setAgentPhoneNumber] = useState("");
    const [agentLoginPin, setAgentLoginPin] = useState("");
    const [initialWalletAmount, setInitialWalletAmount] = useState("");
    const [printerType, setPrinterType] = useState("");
    const [deviceLocation, setDeviceLocation] = useState("");
    const [state, setState] = useState("");
    const [lga, setLga] = useState("");
    const [agentEmail, setAgentEmail] = useState("");
    const [agentNIN, setAgentNIN] = useState("");
    const [userName, setUserName] = useState("");

    const [loadButtonStatus, setLoadButtonStatus] = useState(true);
    const [AggregatorId, setAggregatorId] = useState("");
    const [aggregators, setAggregators] = useState([]);


    useEffect(() => {
        loadAggregators();
    }, []);
    const agentsTableData = {

        columns: [
            {
                label: 'S/N',
                field: 'sn',
                sort: 'asc',

            },
            {
                label: 'Name',
                field: 'name',
                sort: 'asc',

            },
            {
                label: 'Email',
                field: 'email',
                sort: 'asc',

            },
            {
                label: 'Phone No',
                field: 'phoneNo',
                sort: 'asc',
            },
            {
                label: 'Wallet Amount',
                field: 'initialWallet',
                sort: 'asc',
            },
            {
                label: 'NIN Number',
                field: 'nin',
                sort: 'asc',
            }
        ],
        rows: agents.map((agent, index) => (
            {
                sn: index + 1,
                name: agent.name,
                email: agent.email,
                phoneNo: agent.id,
                initialWallet: util.formatMoney(agent.initialWallet),
                nin: agent.nin,

            }
        ))

    };
    const loadAggregators = async () => {
        const userName = "admin";
        const apiKey = "1234567890";
        const hash = sha.sha512(userName + apiKey);
        // console.log(hash);
        const res = await axios.get("https://cors-anywhere.herokuapp.com/https://atstest.ajisaqsolutions.com/api/admin/listAggregators?userName="
            + userName + "&apiKey=" + apiKey + "&hash=" + hash, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        });
        console.log(res.data.data);

        setAggregators(res.data.data)
    };
    const loadAgents = async () => {
        setIsLoader(true);
        const hash = sha.sha512(AggregatorId + AggregatorId);
        // console.log(hash);
        try {
            const res = await axios.get("https://cors-anywhere.herokuapp.com/https://atstest.ajisaqsolutions.com/api/aggregator/listAgent?userName="
                + AggregatorId + "&apiKey=" + AggregatorId + "&hash=" + hash, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
            console.log(res.data);
            setAgents(res.data.data);
        } catch (error) {
            console.log(error.response);
        }

        setIsLoader(false);
        // return "OK";
    }
    const createAgent = async () => {
        setIsLoader(true);
        const hash = sha.sha512(userName + userName + agentName
            + agentPhoneNumber
            + agentLoginPin
            + initialWalletAmount
            + printerType
            + deviceLocation
            + state
            + lga);
        console.log("https://cors-anywhere.herokuapp.com/https://atstest.ajisaqsolutions.com/api/aggregator/createAgent?userName=" +
            userName + "&apiKey=" + userName + "&agentName=" + agentName + "&agentPhoneNumber=" + agentPhoneNumber +
            "&agentLoginPin=" + agentLoginPin +
            "&initialWalletAmount=" + initialWalletAmount + "&printerType=" + printerType + "&deviceLocation=" + deviceLocation +
            "&state=" + state + "&lga=" + lga + "&agentEmail=" + agentEmail + "&agentNIN=" + agentNIN + "&hash=" + hash);
        const res = await axios.get("https://cors-anywhere.herokuapp.com/https://atstest.ajisaqsolutions.com/api/aggregator/createAgent?userName=" +
            userName + "&apiKey=" + userName + "&agentName=" + agentName + "&agentPhoneNumber=" + agentPhoneNumber +
            "&agentLoginPin=" + agentLoginPin +
            "&initialWalletAmount=" + initialWalletAmount + "&printerType=" + printerType + "&deviceLocation=" + deviceLocation +
            "&state=" + state + "&lga=" + lga + "&agentEmail=" + agentEmail + "&agentNIN=" + agentNIN + "&hash=" + hash, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        });
        console.log(res.data);
        if (res.data.status === "OK") {
            //setToggleForm(!toggleForm);
            setFormErrors("Agent Added Successfull");
        } else {
            setFormErrors(res.data.description);
        }
        setIsLoader(false);

        // loadAgents();
        // return { result: res.data.status };
    }
    return (
        <div id="wrapper" >
            <Menu setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Nav setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />

                    <div className="container-fluid">
                        <center>
                            <h2 style={{ color: "#5A0028" }}>Agents</h2>
                            <select className="form-control-sm" style={{
                                backgroundColor: '#fff', color: '#AC3B61', border: '3px solid #AC3B61'
                            }}
                                defaultValue="selected" onChange={e => { setAggregatorId(e.target.value); setLoadButtonStatus(false); }}>

                                <option disabled value="selected">--Select Aggregator--</option>

                                {aggregators.map((aggregator, index) => (
                                    <option key={index} value={aggregator.userName}> {aggregator.name}</option>
                                ))}

                            </select>

                            {isLoader ? <img src={loader} width="150" height="100" alt="Loading ..." /> :
                                <button className="btn btn-user" disabled={loadButtonStatus} onClick={loadAgents}
                                    style={{ backgroundColor: '#AC3B61', color: '#fff' }}>Load</button>}



                        </center>
                        <br />
                        <button onClick={(e) => { setToggleForm(!toggleForm) }} className="btn btn-user" style={{ backgroundColor: "#AC3B61", color: "white" }}>
                            {toggleForm ? <span className="fa fa-1x fa-plus-circle">&nbsp; Agent</span> : <span className="fa fa-1x fa-times-circle">&nbsp;Cancel</span>}</button>
                        {!toggleForm ?


                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="card shadow mb-lg-1">
                                    <div className="card-header py-3"
                                        style={{
                                            background: 'linear-gradient(to bottom, #EDC7B7, #FFFFFF)', color: '#5A0028'
                                        }}>
                                        <h6 className="font-weight-bold text-dark text-center" > Agents</h6>
                                    </div>

                                    <div className="card-body">
                                        {isLoader ? <center><img src={loader} alt="Loading ..." /></center>
                                            :

                                            <form className="user" onSubmit={(e) => { e.preventDefault(); createAgent(); }} >
                                                {formErrors || ""}
                                                <div className="form-group">
                                                    <label htmlFor="agentName">Agent Name</label>
                                                    <input onChange={(e) => { setAgentName(e.target.value) }} className="form-control" id="agentName" type="text"
                                                        required="required" placeholder="Agent Name" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="agentPhoneNumber">User Name</label>
                                                    <input onChange={(e) => { setAgentPhoneNumber(e.target.value) }} className="form-control" id="agentPhoneNumber" type="text"
                                                        required="required" placeholder="2348012345678" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="initialWalletAmount">Initial Wallet Amount</label>
                                                    <input onChange={(e) => { setInitialWalletAmount(e.target.value) }} className="form-control" id="initialWalletAmount" type="number"
                                                        required="required" placeholder="10000" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="printerType">Printer Type</label>
                                                    <select defaultValue="selected" onChange={(e) => { setPrinterType(e.target.value) }} className="form-control" id="printerType"
                                                        required="required" >
                                                        <option disabled value="selected">--Select Printer Type--</option>

                                                        <option value="Inbuilt Printer">Inbuilt Printer</option>
                                                        <option value="Bluetooth Printer">Bluetooth Printer</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="deviceLocation">Device Location</label>
                                                    <input onChange={(e) => { setDeviceLocation(e.target.value) }} className="form-control" id="deviceLocation" type="text"
                                                        required="required" placeholder="JUMM/Gate1" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="state">State</label>
                                                    <select defaultValue="selected" onChange={(e) => { setState(e.target.value) }} className="form-control" id="state"
                                                        required="required" >
                                                        <option disabled value="selected">--Select State--</option>
                                                        <option value="Adamawa">Adamawa</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="lga">LGA</label>
                                                    <select defaultValue="selected" onChange={(e) => { setLga(e.target.value) }} className="form-control" id="lga"
                                                        required="required" >
                                                        <option disabled value="selected">--Select LGA--</option>

                                                        <option value="Yola North">Yola North</option>
                                                        <option value="Yola South">Yola South</option>
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="agentEmail">Agent Email</label>
                                                    <input onChange={(e) => { setAgentEmail(e.target.value) }} className="form-control" id="agentEmail" type="email"
                                                        required="required" placeholder="abc@abc.com" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="agentNIN">Agent NIN </label>
                                                    <input onChange={(e) => { setAgentNIN(e.target.value) }} className="form-control" id="agentNIN" type="number"
                                                        required="required" placeholder="12345678900" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="aggregator">Aggregator</label>
                                                    <select defaultValue="selected" onChange={(e) => { setUserName(e.target.value) }} className="form-control" id="aggregator"
                                                        required="required" >
                                                        <option disabled value="selected">--Select Aggregator--</option>

                                                        {aggregators.map((aggregator, index) => (
                                                            <option key={index} value={aggregator.userName}> {aggregator.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <center>
                                                    <input value="Submit" type="submit" className="btn btn-user btn-block col-sm-6" style={{ backgroundColor: "#5A0028", color: "white", borderRadius: '50px' }} />

                                                </center>
                                            </form>
                                        }
                                    </div>
                                </div>
                            </div>

                            :

                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="card shadow mb-lg-1">
                                    <div className="card-header py-3"
                                        style={{
                                            background: 'linear-gradient(to bottom, #EDC7B7, #FFFFFF)', color: '#5A0028'
                                        }}>
                                        <h6 className="font-weight-bold text-dark text-center" > agents</h6>
                                    </div>

                                    <div className="card-body">
                                        <div className="table-responsive">

                                            {isLoader ? <center><img src={loader} alt="Loading ..." /></center> :
                                                <MDBDataTable
                                                    striped
                                                    bordered
                                                    hover
                                                    data={agentsTableData}
                                                />
                                            }
                                        </div>

                                    </div>
                                </div>
                            </div>

                        }
                    </div>




                </div>
            </div>
        </div>
    )
}
