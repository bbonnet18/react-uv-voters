import './App.css';
import axios from 'axios';
import config from './config';
import { Col, Row, Form, Button, Container, Spinner} from "react-bootstrap";
import { useState, useRef, useEffect, useContext } from 'react';
import ReCAPTCHA from "react-google-recaptcha";

function TestVoter(props) {

    const [registerToken, setRegisterToken] = useState(null);
    const [disabled, setDisabled] = useState(true);
    const [loading, setLoading] = useState(false);
    const recaptchaRef = useRef(null);

    // check captcha val
  const checkCaptcha = async () => {
    const captchaToken = recaptchaRef.current.getValue();
    //recaptchaRef.current.reset();// reset the captcha

    var payload = {};
    payload['token'] = captchaToken;
    try {
      let response = await axios.post(`${config.apiBaseUrl}/register/check-bot`, payload);//await axios.post("https://vote.u-vote.us/register", formData);

      if (response.status === 200 && response.data) {
        setRegisterToken(response.data.regToken);
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    } catch (err) {
      setDisabled(true);
    }


  }

    const createTestVoter = async (phone, passcode, city, zipcode) => {
        try {

            setLoading(true);
            const myForm = document.getElementById('testVoterForm');
            if (!myForm.checkValidity()) {
                myForm.reportValidity();
                return null;
            }

       
            const apiUrl = `${config.apiBaseUrl}/register/test-voter`;
            var formData = new FormData();
            formData.append('regToken', registerToken); 
            formData.append('phone', phone);
            formData.append('passcode', passcode);
            formData.append('city', city);
            formData.append('zipcode', zipcode);
            const resp = await axios.post(apiUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setLoading(false);
            if (resp && resp.data) {
                return resp.data;
            } else {
                return null;
            }

        } catch (err) {
            setLoading(false);
            console.error("error creating test voter: ", err);
            return null;
        }
    }

   
    return (<Container>
        <h3>Create a Test Voter</h3>
        <Form id='testVoterForm'>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aPhone" >Phone</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Control className='' id="phone" name="phone" maxLength={10} minLength={10} type="tel" pattern="[0-9]{10}" placeholder="phone" defaultValue={""} required />
                <Form.Text id="phoneHelp" muted>
                  Enter a 10 digit phone number starting with the area code
                </Form.Text>
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aPasscode" >Passcode</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Control className='' id="passcode" name="passcode" type="password" defaultValue={""} pattern="[a-z]{1,10}" required />
              </Col>
            </Row>
            <Row className='mb-2'>
              <Col lg={2}>
                <Form.Label id="aSelect">Locality</Form.Label>
              </Col>
              <Col lg={6}>
                <Form.Select id="localitySelect" name="localitySelect" defaultValue={"8"}>
                    <option value={"Arlington"}>Arlington</option>
                    <option value={"Fairfax"}>Fairfax</option>
                    <option value={"Alexandria"}>Alexandria</option>
                    <option value={"Loudon"}>Loudon</option>
                </Form.Select>
              </Col>
            </Row>
            <Row className='mb-2'>
            <Col lg={2}>
                <Form.Label id="aZipcode" >Zipcode</Form.Label>
              </Col>
              <Col lg={10}>
                <Form.Control className='' id="zipcode" name="zipcode" type="zipcode" defaultValue={"22204"} pattern="[0-9]{1,5}" required />
              </Col>
            </Row>
            <Row className='mb-4 mt-4' >
              <ReCAPTCHA ref={recaptchaRef} sitekey={"6Le-QPIoAAAAAJT5-G3P009gn52wZR3TLLSBB3Fj"} onChange={() => checkCaptcha()} />
            </Row>
            {loading && <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>}
            <Button variant="primary" type="submit" onClick={async (e) => {
              e.preventDefault();
              const phone = document.getElementById('phone');
            const passcode = document.getElementById('passcode');
            const city = document.getElementById('localitySelect');
            const cityName = city.options[city.selectedIndex].text;
            const zipcode = document.getElementById('zipcode');
              const newVoter = await createTestVoter(phone.value, passcode.value, city.value, zipcode.value);
              if(newVoter){
                
                phone.value = '';
                passcode.value = '';
                city.value = '8';
                zipcode.value = '';

                recaptchaRef.current.reset();
                setDisabled(true);
                setRegisterToken(null);
                alert(`Test voter created`);
              } else {
                alert('unable to create test voter');
              }
            }}>
                Submit
            </Button>
        </Form>
    </Container>);
}

export default TestVoter;

