import React, { useState, useEffect } from 'react'
import DateRangePicker from "react-bootstrap-daterangepicker";
import { MDBDataTable } from "mdbreact";
import Menu from './components/Menu';
import Nav from './components/Nav';
import loader from "./loader.gif"
import { Async } from 'react-async';
import axios from 'axios';
import sha from 'js-sha512';
export default function Aggregator() {
    const [toggleForm, setToggleForm] = useState(true);
    const [toggleMenu, setToggleMenu] = useState(false);
    const [isLoader, setIsLoader] = useState(false);
    const [aggregators, setAggregators] = useState([]);
    const [name, setName] = useState("");
    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    useEffect(() => {
        loadAggregators();
    }, []);
    const aggregatorsTableData = {

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
                label: 'User Name',
                field: 'userName',
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
            }
        ],
        rows: aggregators.map((aggregator, index) => (
            {
                sn: index + 1,
                name: aggregator.name,
                userName: aggregator.userName,
                email: aggregator.email,
                phone: aggregator.phone

            }
        ))

    };
    const loadAggregators = async () => {
        setIsLoader(true);
        const user = "admin";
        const apiKey = "1234567890";
        const hash = sha.sha512(user + apiKey);
        // console.log(hash);
        try {
            const res = await axios.get("https://atstest.ajisaqsolutions.com/api/admin/listAggregators?userName="
                + user + "&apiKey=" + apiKey + "&hash=" + hash, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                }
            });
            // console.log(res.data);
            setAggregators(res.data);
        } catch (error) {
            console.log(error.response);
        }

        setIsLoader(false);
        // return "OK";
    }
    const createAggregator = async () => {
        setIsLoader(true);
        const user = "admin";
        const apiKey = "1234567890";
        const password = "pass1234"
        const hash = sha.sha512(user + apiKey + name + userName + password + email + phone);
        // console.log(hash);
        const res = await axios.get("https://atstest.ajisaqsolutions.com/api/admin/createAggregator?userName="
            + user + "&apiKey=" + apiKey + "&name=" + name + "&username=" + userName +
            "&password=" + password + "&email=" + email + "&phone=" + phone + "&hash=" + hash, {
            headers: {
                'Access-Control-Allow-Origin': '*',
            }
        });
        console.log(res.data);

        setIsLoader(false);
        setToggleForm(!toggleForm);
        return { result: res.data.status };
    }
    return (
        <div id="wrapper" >
            <Menu setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />
            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Nav setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />

                    <div className="container-fluid">

                        <button onClick={(e) => { setToggleForm(!toggleForm) }} className="btn btn-user" style={{ backgroundColor: "#5A0028", color: "white", borderRadius: '50px' }}>
                            {toggleForm ? <span className="fa fa-1x fa-plus-circle">&nbsp; Aggregator</span> : <span className="fa fa-1x fa-times-circle">&nbsp;Cancel</span>}</button>
                        {!toggleForm ?


                            <div className="col-lg-12 col-md-12 col-sm-12">
                                <div className="card shadow mb-lg-1">
                                    <div className="card-header py-3"
                                        style={{
                                            background: 'linear-gradient(to bottom, #EDC7B7, #FFFFFF)', color: '#5A0028'
                                        }}>
                                        <h6 className="font-weight-bold text-dark text-center" > Aggregators</h6>
                                    </div>

                                    <div className="card-body">
                                        {isLoader ? <center><img src={loader} alt="Loading ..." /></center>
                                            :
                                            <form className="user" onSubmit={(e) => { e.preventDefault(); createAggregator(); console.log("hello") }} >
                                                <div className="form-group">
                                                    <label htmlFor="name">Name</label>
                                                    <input onChange={(e) => { setName(e.target.value) }} className="form-control" id="name" type="text"
                                                        required="required" placeholder="Name" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="username">User Name</label>
                                                    <input onChange={(e) => { setUserName(e.target.value) }} className="form-control" id="username" type="text"
                                                        required="required" placeholder="User Name" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="email">Email</label>
                                                    <input onChange={(e) => { setEmail(e.target.value) }} className="form-control" id="email" type="email"
                                                        required="required" placeholder="Email" />
                                                </div>
                                                <div className="form-group">
                                                    <label htmlFor="phoneno">Phone Number</label>
                                                    <input onChange={(e) => { setPhone(e.target.value) }} className="form-control" id="phoneno" type="number"
                                                        required="required" placeholder="Phone Number" />
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
                                        <h6 className="font-weight-bold text-dark text-center" > Aggregators</h6>
                                    </div>

                                    <div className="card-body">
                                        <div className="table-responsive">

                                            {isLoader ? <center><img src={loader} alt="Loading ..." /></center> :
                                                <MDBDataTable
                                                    striped
                                                    bordered
                                                    hover
                                                    data={aggregatorsTableData}
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
