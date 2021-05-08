/* eslint-disable react/jsx-no-target-blank */
import "./App.css";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import axios from "axios";
import indiaFlag from "./assets/india-flag.png";
function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [states, setStates] = useState();
  const [selectedState, setSelectedState] = useState(0);
  const [districts, setDistricts] = useState();
  const [selectedDistrict, setSelectedDistricts] = useState(0);
  const [isDistrictEnabled, setIsDistrictEnabled] = useState(false);

  useEffect(() => {
    axios
      .get("https://cdn-api.co-vin.in/api/v2/admin/location/states")
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setStates(res.data.states);
        }
      });
  }, []);

  const nameChange = (e) => {
    setName(e.target.value);
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
  };
  const stateSelectionChange = (e) => {
    setSelectedState(e.target.value);
    getDistricts(e.target.value);
  };
  const districtSelectionChange = (e) => {
    setSelectedDistricts(e.target.value);
  };

  const getDistricts = (stateId) => {
    axios
      .get(
        `https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`
      )
      .then((res) => {
        if (res.status === 200) {
          setDistricts(res.data.districts);
          setIsDistrictEnabled(true);
        }
      });
  };

  const onSubmit = () => {
    axios
      .post(
        "https://covid-vaccination-tracker.azurewebsites.net/Register/user-registration",
        {
          id: 0,
          name: name,
          email: email,
          districtId: selectedDistrict,
          alertFrequency: 1,
        }
      )
      .then((res) => {
        if (res.status === 200) {
          alert(
            "Registration Successful \\n You Will receive emails based on notification frequency selected"
          );
        } else {
          alert(
            "Error Occured! Please Inform Us by email on shivamsingh071093@gmail.com \\n we will resolve it soon"
          );
        }
      })
      .catch((err) => {
        alert(
          "Error Occured! Please Inform Us by email on shivamsingh071093@gmail.com \\n we will resolve it soon"
        );
      });
  };
  return (
    <div className="App">
      <Navbar fixed="top" bg="dark" variant="dark">
        <Navbar.Brand href="#home">
          Covid-19 Vaccination Slot Tracker by -
          <a
            className="a-name-link"
            href="https://www.linkedin.com/in/sks71093/"
            target="_blank"
          >
            {" "}
            Shivam Singh
          </a>
        </Navbar.Brand>
        
      </Navbar>
      <div className="loginContainer">
        <div class="banner-box">
          <div className="get-vaccinated">
            <img src={indiaFlag} alt="" />
            <h1>Get yourself vaccinated</h1>
          </div>
          <h3>Receive an email when a vaccination slot opens up</h3>
        </div>
        <div className="register-box">
          <div class="login-box">
            <h3 className="heading">Get Notified</h3>
            <div>
              <Form.Control
                className="name"
                type="text"
                value={name}
                required
                placeholder="Your Name"
                autoComplete="no"
                onChange={nameChange}
              />
            </div>
            <div>
              <Form.Control
                className="name"
                type="email"
                value={email}
                autoComplete="no"
                required
                placeholder="Your Email"
                onChange={emailChange}
              />
            </div>
            <Form.Group>
              <Form.Control
                className="select"
                placeholder="Select State"
                as="select"
                value={selectedState}
                onChange={stateSelectionChange}
              >
                <option value={0}>State</option>
                {states &&
                  states.map((state, index) => {
                    return (
                      <option
                        key={`${state.state_name}_${state.state_id}_${index}`}
                        value={state.state_id}
                      >
                        {state.state_name}
                      </option>
                    );
                  })}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Control
                className="select"
                placeholder="Select District"
                disabled={!isDistrictEnabled}
                as="select"
                onChange={districtSelectionChange}
                value={selectedDistrict}
              >
                <option value={0}>District</option>
                {districts &&
                  districts.map((district, index) => {
                    return (
                      <option
                        key={`${district.district_name}_${district.district_id}_${index}`}
                        value={district.district_id}
                      >
                        {district.district_name}
                      </option>
                    );
                  })}
              </Form.Control>
            </Form.Group>

            <Button onClick={onSubmit} variant="primary" type="submit">
              Submit
            </Button>
            <div className="meta">
              <p>*Only for 18-45 year range.</p>
              <p>*Powered by information from Cowin website</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
