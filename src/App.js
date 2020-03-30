import React, { useState, useEffect } from 'react';
import { MDBContainer } from "mdbreact";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import sha from "js-sha512";
import DateRangePicker from "react-bootstrap-daterangepicker";
import moment from "moment";
import * as util from "./util";
import Menu from './components/Menu';
import Nav from './components/Nav';

import loader from "./loader.gif";

function App() {
  const [startDate, setStartDate] = useState(util.getTodayDate(new Date()));
  const [stopDate, setStopDate] = useState(util.getTodayDate(new Date()));
  const [ticketSummary, setTicketSummary] = useState({});
  // const [loadButtonStatus, setLoadButtonStatus] = useState(true);
  const [isLoader, setIsLoader] = useState(false);
  const [toggleMenu, setToggleMenu] = useState(false);

  useEffect(() => {
    loadAgentTickets(new Date(), new Date());
  }, []);
  const dataBar = {
    labels: Object.keys(ticketSummary).map(value => value),
    datasets: [
      {
        label: "Total Amount (NGN)",
        data: Object.values(ticketSummary).map(value => value),
        backgroundColor: Object.keys(ticketSummary).map((value) =>
          `rgba(${util.getRandomColorValue()}, ${util.getRandomColorValue()},${util.getRandomColorValue()},0.4)`
        ),
        borderWidth: 2,
        borderColor: Object.keys(ticketSummary).map((value) =>
          `rgba(${util.getRandomColorValue()}, ${util.getRandomColorValue()},${util.getRandomColorValue()},0.4)`
        )
      }
    ]
  };
  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      xAxes: [
        {
          // barPercentage: 1,
          gridLines: {
            display: true,
            color: "rgba(0, 0, 0, 0.1)"
          }
        }
      ],
      yAxes: [
        {
          gridLines: {
            display: true,
            color: "rgba(0, 0, 0, 0.1)"
          },
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  };
  const loadAgentTickets = async (start, end) => {
    setIsLoader(true);
    setStartDate(util.getTodayDate(start));
    setStopDate(util.getTodayDate(end));

    let d = {};
    const userName = "atstest";
    const apiKey = "atstest";
    // const start = util.getTodayDate(p.startDate._d);
    // const end = util.getTodayDate(p.endDate._d);
    const hash = sha.sha512(userName + apiKey + util.getTodayDate(start) + util.getTodayDate(end));
    // console.log("https://cors-anywhere.herokuapp.com/https://atstest.ajisaqsolutions.com/api/admin/ticketsSummary?userName="
    //   + userName + "&apiKey=" + apiKey + "&startDate=" + util.getTodayDate(start) + "&stopDate=" + util.getTodayDate(end) + "&hash=" + hash);
    try {
      const res = await axios.get("https://cors-anywhere.herokuapp.com/https://atstest.ajisaqsolutions.com/api/admin/ticketsSummary?userName="
        + userName + "&apiKey=" + apiKey + "&startDate=" + util.getTodayDate(start) + "&stopDate=" + util.getTodayDate(end) + "&hash=" + hash);
      if (res.data.status === "OK") {
        res.data.data.forEach((element) => {
          const agent = element.agent.name + "\n(" + element.agent.id + ")";
          if (!d[agent]) {
            d[agent] = 0;
          }

          d[agent] += element.fee * element.quantity;

        });
        // console.log(d);
        setTicketSummary(d);

      } else {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoader(false);

  };

  return (
    <div id="wrapper" >
      <Menu setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Nav setToggleMenu={setToggleMenu} toggleMenu={toggleMenu} />
          <div className="container-fluid">
            <div className="col-lg-12 col-md-12 col-sm-12">
              <div className="card shadow mb-lg-1">
                <div className="card-header py-3"
                  style={{
                    background: 'linear-gradient(to bottom, #EDC7B7, #FFFFFF)', color: '#5A0028'
                  }}>
                  <h6 className="font-weight-bold text-dark text-center" > Ticket Pool

                  </h6>
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
                    <button className="btn btn-user"
                      style={{ backgroundColor: '#AC3B61', color: '#fff' }}><span className="fa fa-calendar-plus"></span>&nbsp;{startDate} - {stopDate} <span className="fa fa-caret-down"></span></button>
                  </DateRangePicker>
                </div>


                <div className="card-body">
                  <div className="table-responsive">
                    {isLoader ? <center><img src={loader} alt="Loading ..." /> </center> :

                      <MDBContainer>
                        <Bar data={dataBar} options={barChartOptions} />
                      </MDBContainer>
                    }
                  </div>

                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
}

export default App;
