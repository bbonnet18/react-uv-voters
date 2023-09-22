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
      let res = await axios.post("https://vote.u-vote.us/admin/validation-list", payload);
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
          <Form.Control id="firstName" name="firstname" size="lg" type="text" placeholder="first name" onChange={()=>{}} value={validation.firstname} required disabled />
          <InputGroup.Text id="aLast" className='form-col'>Last</InputGroup.Text>
          <Form.Control id="lastName" name="lastname" size="lg" type="text" placeholder="last name" onChange={()=>{}} value={validation.lastname} required disabled />
        </InputGroup>
        <InputGroup className='mb-3'>
          <InputGroup.Text id="aCity">City</InputGroup.Text>
          <Form.Control id="city" name="city" size="lg" type="text" minLength={2} placeholder="city" onChange={()=>{}} value={validation.city} required disabled/>
          <InputGroup.Text id="aState-addon1" className='form-col' >State</InputGroup.Text>
          {/* <Form.Control id="state" name="state" size="lg" type="text" minLength={2} maxLength={2} placeholder="state" defaultValue={currentValidation.state} required/> */}
          <Form.Control aria-label="State" name="state" id="aState" type="text"  onChange={()=>{}}  required value={validation.state} disabled/>
            
        </InputGroup>
        <InputGroup className='mb-3'>
          <InputGroup.Text id="aPhone" >Phone</InputGroup.Text>
          <Form.Control id="phone" name="phone" size="lg" type="tel" placeholder="phone" onChange={()=>{}} value={validation.phone}   required disabled/>
          <InputGroup.Text id="aAge" className='form-col' >Age</InputGroup.Text>
          <Form.Control id="age" name="age" size="lg" type="number" placeholder="age" onChange={()=>{}} value={validation.age}   required disabled/>
        </InputGroup>
        <InputGroup className='mb-3'>
            <InputGroup.Text>Gender</InputGroup.Text>
          <Form.Control aria-label="Gender" name="gender" id="aGender" type="text" onChange={(e)=>{setValidation({...validation,gender:e.target.value})}} required value={validation.gender}  disabled/>
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
        <Button variant='primary' onClick={() => addValidation()}> {loading ?
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner> : "Submit"}</Button>
        <Card style={{ width: '18rem' }}>
        <Card.Body>
          <Card.Title id="resCard">Results</Card.Title>
            <Card.Text>
              {resultsText}
            </Card.Text>
        </Card.Body>
      </Card>
      </Form>
    )
}

export default ValidationForm;
