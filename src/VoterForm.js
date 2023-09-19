import './App.css';
import { useState } from 'react';
import { Form, InputGroup, Card, Spinner, Button } from "react-bootstrap";
import axios from 'axios';


function VoterForm({ checkVoter }) {

    const starterVoter = {
        "lastname": "",
        "firstname": "",
        "city": "",
        "state": "",
        "phone": ""
    }

    const [loading, setLoading] = useState(false);
    const [currentVoter, setCurrentVoter] = useState(starterVoter)
    const [resultsText, setResultsText] = useState(null);
    // check the voter on changes to the fields
    const checkDuplicates = () => {
        const form = document.getElementById('voterForm');
        const isValid = form.checkValidity();
        console.log(' checking for duplicates ')
        if (isValid) {
            form.classList.remove('invalid');
            var formFields = form.querySelectorAll('.form-control');
            var genderSelect = form.querySelector('#aGender');
            var stateSelect = form.querySelector('#aState');

            var payload = {}
            for (let i = 0; i < formFields.length; i++) {
                console.log('val: ', formFields[i].value);
                payload[formFields[i].name] = formFields[i].value;
            }
            payload['gender'] = genderSelect.value;
            payload['state'] = stateSelect.value;


            console.log('payload: ', payload);

            checkVoter(payload);
        }
    }

    // check fields and attempt to add
    const addVoter = async () => {

        console.log('currentVoter :', currentVoter);
        const form = document.getElementById('voterForm');
        const isValid = form.checkValidity();
        if (isValid) {
            form.classList.remove('invalid');
            var formFields = form.querySelectorAll('.form-control');
            var genderSelect = form.querySelector('#aGender');
            var stateSelect = form.querySelector('#aState');
            var idSelect = form.querySelector('#idType');
            var payload = {}
            for (let i = 0; i < formFields.length; i++) {
                console.log('val: ', formFields[i].value);
                payload[formFields[i].name] = formFields[i].value;
            }
            payload['gender'] = genderSelect.value;
            payload['state'] = stateSelect.value;
            payload['idtype'] = idSelect.value;

            console.log('payload: ', payload);

            setLoading(true)
            let res = await axios.post("http://vote.u-vote.us/admin/add-voter", payload);
            form.reset();
            console.log(res);
            setResultsText("confirmed");
            setLoading(false)
        } else {
            form.classList.add('invalid');
        }

    }


    return (
        <Form id="voterForm">
            <InputGroup className="mb-3">
                <InputGroup.Text id="aFirst">First</InputGroup.Text>
                <Form.Control id="firstName" name="firstname" size="lg" type="text" placeholder="first name" defaultValue={currentVoter.firstname} required />
                <InputGroup.Text id="aLast" className='form-col'>Last</InputGroup.Text>
                <Form.Control id="lastName" name="lastname" size="lg" type="text" placeholder="last name" defaultValue={currentVoter.lastname} required />
            </InputGroup>
            <InputGroup className='mb-3'>
                <InputGroup.Text id="aCity">City</InputGroup.Text>
                <Form.Control id="city" name="city" size="lg" type="text" minLength={2} placeholder="city" defaultValue={currentVoter.city} required />
                <InputGroup.Text id="aState-addon1" className='form-col' >State</InputGroup.Text>
                {/* <Form.Control id="state" name="state" size="lg" type="text" minLength={2} maxLength={2} placeholder="state" defaultValue={currentVoter.state} required/> */}
                <Form.Select aria-label="State" name="state" id="aState" required defaultValue="F">
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="DC">District Of Columbia</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                </Form.Select>
            </InputGroup>
            <InputGroup className='mb-3'>
                <InputGroup.Text id="aPhone" >Phone</InputGroup.Text>
                <Form.Control id="phone" name="phone" size="lg" type="tel" placeholder="phone" defaultValue={currentVoter.phone} required />
                <InputGroup.Text id="aAge" className='form-col' >Age</InputGroup.Text>
                <Form.Control id="age" name="age" size="lg" type="number" placeholder="age" defaultValue={currentVoter.state} required />
            </InputGroup>
            <InputGroup className='mb-3'>
                <Form.Check // prettier-ignore
                    type={'checkbox'}
                    id={'opt-in'}
                    label={'Agree to receive text messages'} required
                />
            </InputGroup>
            <InputGroup className='mb-3'>
                <Form.Select aria-label="Gender" name="gender" id="aGender" required defaultValue="F">
                    <option value="F">Female</option>
                    <option value="M">Male</option>
                    <option value="U">Unknown</option>
                </Form.Select>
            </InputGroup>
            <hr></hr>
            <InputGroup className='mb-3'>
                <InputGroup.Text id="aidType" className='form-col'>ID Type</InputGroup.Text>
                <Form.Select aria-label="id-type" name="idType" id="idType" required defaultValue="D">
                    <option value="D">drivers license</option>
                    <option value="P">US Passport</option>
                    <option value="U">university ID</option>
                </Form.Select>
                <InputGroup.Text id="aidSample" className='form-col'>ID Sample</InputGroup.Text>
                <Form.Control id="idsample" name="idsample" size="lg" type="text" minLength={4} maxLength={4} placeholder="last 4 characters of ID" required />
            </InputGroup>
            <Button variant='warning' onClick={() => checkDuplicates()}>Check Duplicates</Button>

            <Button variant='primary' onClick={() => addVoter()}>Submit</Button>
            <Card style={{ width: '18rem' }}>
                <Card.Body>
                    <Card.Title id="resCard">Results</Card.Title>
                    {loading ?
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner> : <Card.Text>
                            {resultsText}
                        </Card.Text>}
                </Card.Body>
            </Card>
        </Form>
    )
}

export default VoterForm;
