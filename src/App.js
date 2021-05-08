/* eslint-disable react/jsx-no-target-blank */
import "./App.css";
import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import axios from "axios";
import indiaFlag from "./assets/india-flag.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import validator from 'validator';
function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [states, setStates] = useState();
  const [selectedState, setSelectedState] = useState(0);
  const [districts, setDistricts] = useState();
  const [selectedDistrict, setSelectedDistricts] = useState(0);
  const [isDistrictEnabled, setIsDistrictEnabled] = useState(false);
  const [isBtnDisabled, setBtnDisabled] = useState(true);
  const [isNameValid, setIsNameValid] = useState();
  const [isEmailValid, setIsEmailValid] = useState();
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
    if(validator.isAlpha(e.target.value)){
      setIsNameValid(true)
      setBtnDisabled(false);
    }
    else{
      setIsNameValid(false)
    }
  };

  const emailChange = (e) => {
    setEmail(e.target.value);
    if(validator.isEmail(e.target.value)){
      setIsEmailValid(true);
      setBtnDisabled(false);
    }else{
      setIsEmailValid(false);
    }
  };

  const validateEmail = () => {
    if(validator.isEmail(email)){
      setIsEmailValid(true);
      setBtnDisabled(false);
      return true;
    }else{
      setIsEmailValid(false);
      setBtnDisabled(true);
      return false;
    }
  }

  const validateName = () => {
    if(validator.isAlpha(name)){
      setIsNameValid(true)
      setBtnDisabled(false);
      return true;
    }
    else{
      setIsNameValid(false)
      setBtnDisabled(true);
      return false;
    }
  }
  const stateSelectionChange = (e) => {
    setSelectedState(e.target.value);
    getDistricts(e.target.value);
    setBtnDisabled(true);
  };
  const districtSelectionChange = (e) => {
    setSelectedDistricts(e.target.value);
    if (parseInt(e.target.value) === 0) {
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
    }
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
    if(validateEmail() && validateName()){
      setBtnDisabled(true);
    axios
      .post("https://covid-vaccination-tracker.azurewebsites.net/Register/user-registration", {
        id: 0,
        name: name,
        email: email,
        districtId: selectedDistrict,
        alertFrequency: 1,
      })
      .then((res) => {
        if (res.status === 200) {
          toast(
            "Registration Successful! You will receive emails on provided email.",
            {
              type: "success",
            }
          );
          setBtnDisabled(true);
          setName("");
          setEmail("");
          setIsDistrictEnabled(false);
          setSelectedDistricts(0);
          setSelectedState(0);
        } else {
          toast(res.data.message, {
            type: "warning",
          });
          setBtnDisabled(false);
        }
      })
      .catch((err) => {
        toast(
          "Error Occured! Please Inform Us by email on shivamsingh071093@gmail.com. we will resolve it soon",
          {
            type: "error",
          }
        );
        setBtnDisabled(false);
      });
    }
  };
  const notify = () => toast("Wow so easy!");
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
                className={`name ${isNameValid === false ? 'name-invalid': ''}`}
                type="text"
                value={name}
                required
                placeholder="Your Name"
                autoComplete="no"
                onChange={nameChange}
              />
              { (isNameValid===false)? <p className="name-invalid-p">Please enter a valid name.</p> : ''}
            </div>
            <div>
              <Form.Control
                className={`name ${isEmailValid === false ? 'name-invalid': ''}`}
                type="email"
                value={email}
                autoComplete="no"
                required
                placeholder="Your Email"
                onChange={emailChange}
              />
              { (isEmailValid===false)? <p className="name-invalid-p">Please enter a valid email.</p> : ''}
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

            <Button
              disabled={isBtnDisabled}
              onClick={onSubmit}
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
            <div className="meta">
              <p>*Only for 18-45 year range.</p>
              <p>*Powered by information from Cowin website</p>
            </div>
          </div>
        </div>
      </div>
      <div className="faq">
        <h2>Frequently asked questions</h2>
        <Accordion defaultActiveKey="0">
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="0">
              How does this work?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="0">
              <Card.Body>
                <p>
                  Once you register with your location information. We would
                  periodically check for slot availability (typically every 5
                  mins).
                </p>
                <p>
                  {" "}
                  When we see a slot opening up, we would immediately send
                  across an email to your email-id. Emails would be sent every 3
                  hours till the time you don't notify us that you have booked
                  your slot.
                </p>
                <p>
                  {" "}
                  You can notify us by clicking on "Have booked my slot" button
                  in the email.
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="1">
              Who runs this site?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <p>
                  <a href="https://www.linkedin.com/in/sks71093/">
                    Shivam Singh
                  </a>
                  , a software developer from bengaluru has developed and
                  manages this site.
                </p>
                <p>
                  {" "}
                  I tried getting vaccination slots for myself and whenever i
                  tried i couldn't book one. That is where i felt i could write
                  a small program to get notified when a vaccination slot opens
                  up.{" "}
                </p>
                <p>
                  This page is an attempt to help people like me to avoid
                  frustrations and save time trying to book a slot for
                  themselves.
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2">
              How would you utilize my email?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <p>
                  Your email is stored for the sole purpose to notify you
                  whenever a vaccination slot opens up. Once you book your
                  vaccination slot, simply click on "Unsubscribe" button in the
                  email and your email-id would be removed from our database.
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2">
              How do i stop new slot open emails?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <p>
                  In the email you received there is a button "Have booked my
                  slot" or "Unsubscribe" once you click on any of this button
                  you would stop receiving email from us.
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
          <Card>
            <Accordion.Toggle as={Card.Header} eventKey="2">
              What can i do to help you?
            </Accordion.Toggle>
            <Accordion.Collapse eventKey="2">
              <Card.Body>
                <p>
                  Simply share this site and message to as many people as
                  possible. So they can get vaccinated as soon as possible and
                  we can come out of this pandemic and get our lives back on
                  track.
                </p>
                <p>
                  If you are willing to help me coverup the hosting & mail
                  charges <a href="#">click here</a>
                </p>
              </Card.Body>
            </Accordion.Collapse>
          </Card>
        </Accordion>
      </div>
      <button onClick={notify}>Notify!</button>
      <ToastContainer />
    </div>
  );
}

export default App;
