import './App.css';
import { useState, useEffect } from 'react';
import {Form, InputGroup, Card, Spinner, FormLabel, Button} from "react-bootstrap";
import axios from 'axios';


function ValidationForm({validation,setValidation}) {

    
    const [loading,setLoading] = useState(false);
    const [resultsText,setResultsText] = useState(null);

   // check fields and attempt to add
    const addValidation = async () => {

    const form = document.getElementById('ValidationForm');
    const isValid = form.checkValidity();
    if (isValid) {
      form.classList.remove('invalid');
      var formFields = form.querySelectorAll('.form-control');
      var genderSelect = form.querySelector('#aGender');
      var stateSelect = form.querySelector('#aState');
      var validCheck = form.querySelector("#Valid");
      var payload = {}
      for (let i = 0; i < formFields.length; i++) {
        console.log('val: ', formFields[i].value);
        payload[formFields[i].name] = formFields[i].value;
      }
      payload['gender'] = genderSelect.value;
      payload['state'] = stateSelect.value; 
      payload['valid'] = (validCheck.checked) ? true : false;
      console.log('payload: ', payload);

      setLoading(true)
      let res = await axios.post("http://vote.u-vote.us/admin/validation-list", payload);
      form.reset();
      console.log(res);
      setResultsText("confirmed");
      setLoading(false)
    } else {
      form.classList.add('invalid');
    }

  }


    return (
        <Form id="ValidationForm">
        <InputGroup className="mb-3">
          <InputGroup.Text id="aFirst">First</InputGroup.Text>
          <Form.Control id="firstName" name="firstname" size="lg" type="text" placeholder="first name" onChange={()=>{}} value={validation.firstname} required />
          <InputGroup.Text id="aLast" className='form-col'>Last</InputGroup.Text>
          <Form.Control id="lastName" name="lastname" size="lg" type="text" placeholder="last name" onChange={()=>{}} value={validation.lastname} required />
        </InputGroup>
        <InputGroup className='mb-3'>
          <InputGroup.Text id="aCity">City</InputGroup.Text>
          <Form.Control id="city" name="city" size="lg" type="text" minLength={2} placeholder="city" onChange={()=>{}} value={validation.city} required />
          <InputGroup.Text id="aState-addon1" className='form-col' >State</InputGroup.Text>
          {/* <Form.Control id="state" name="state" size="lg" type="text" minLength={2} maxLength={2} placeholder="state" defaultValue={currentValidation.state} required/> */}
          <Form.Select aria-label="State" name="state" id="aState"  onChange={()=>{}}  required value={validation.state} >
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
          <Form.Control id="phone" name="phone" size="lg" type="tel" placeholder="phone" onChange={()=>{}} value={validation.phone}   required />
          <InputGroup.Text id="aAge" className='form-col' >Age</InputGroup.Text>
          <Form.Control id="age" name="age" size="lg" type="number" placeholder="age" onChange={()=>{}} value={validation.age}   required />
        </InputGroup>
        <InputGroup className='mb-3'>
            <InputGroup.Text>Gender</InputGroup.Text>
          <Form.Select aria-label="Gender" name="gender" id="aGender"  onChange={(e)=>{setValidation({...validation,gender:e.target.value})}} required value={validation.gender}  >
            <option value="F">Female</option>
            <option value="M">Male</option>
            <option value="U">Unknown</option>
          </Form.Select>
        </InputGroup>
        <InputGroup className='mb-3'>
          <Form.Check // prettier-ignore
            type={'checkbox'}
            id={'Valid'}
            label={'valid'} required  onChange={(e)=>{setValidation({...validation,valid:e.target.value})}}  value={validation.valid}
          />
        </InputGroup>
        <InputGroup className='mb-3'>
          <FormLabel>ID sample</FormLabel>
          <Form.Control id="idsample" name="idsample" size="lg" type="text" onChange={(e)=>{setValidation({...validation,idsample:e.target.value})}}  placeholder="idsample" value={validation.idsample}  required />
        </InputGroup>
        <Button variant='primary' onClick={() => addValidation()}>Submit</Button>
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

export default ValidationForm;
