import logo from './logo.svg';
import './App.css';
import axios from 'axios';


import { InputGroup, Form, Card, Button, Container, Image, Spinner } from "react-bootstrap";
import VoterList from './VoterList';
import { useState } from 'react';

function App() {

  const starterVoter = {
    "lastname":"",
    "firstname":"",
    "city":"",
    "state":"",
    "phone":""
  }
  const [loading, setLoading] = useState(false);
  const [currentVoter, setCurrentVoter] = useState(starterVoter)


  // check fields and attempt to add
  const addVoter = async () => {
   
    console.log('currentVoter :', currentVoter);
    const form = document.getElementById('voterForm');
    const isValid = form.checkValidity();
    if(isValid){
      form.classList.remove('invalid');
      var formFields = form.querySelectorAll('.form-control');
      var payload = {}
      for(let i=0; i<formFields.length; i++){
        console.log('val: ', formFields[i].value);
        payload[formFields[i].name] = formFields[i].value; 
      }
      let res = await axios.post("http://localhost:3003/admin/add-voter",payload);
      form.reset();
      console.log(res);
    }else{
      form.classList.add('invalid'); 
    }
   
    

  }
  return (
    <Container>
      <h2>Add Voter</h2>
      <Form id="voterForm">
      <InputGroup className="mb-3">
        <InputGroup.Text id="aFirst">First</InputGroup.Text>
        <Form.Control id="firstName" name="firstname" size="lg" type="text" placeholder="first name" defaultValue={currentVoter.firstname} required />
        <InputGroup.Text id="aLast">Last</InputGroup.Text>
        <Form.Control id="lastName" name="lastname" size="lg" type="text" placeholder="last name" defaultValue={currentVoter.lastname} required />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text id="aCity">City</InputGroup.Text>
        <Form.Control id="city" name="city" size="lg" type="text" minLength={2} placeholder="city" defaultValue={currentVoter.city} required />
        <InputGroup.Text id="aState-addon1">State</InputGroup.Text>
        <Form.Control id="state" name="state" size="lg" type="text" minLength={2} maxLength={2} placeholder="state" defaultValue={currentVoter.state} required/>
      </InputGroup>
      <InputGroup>
        <InputGroup.Text id="aPhone">Phone</InputGroup.Text>
        <Form.Control id="phone" name="phone" size="lg" type="tel" placeholder="Large text" defaultValue={currentVoter.phone}  required/>
      </InputGroup>
      <Button variant='primary' onClick={()=>addVoter()}>Submit</Button>
      </Form>
      <br/>
      <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title id="resCard">Results</Card.Title>
          {loading ? 
           <Spinner animation="border" role="status">
           <span className="visually-hidden">Loading...</span>
         </Spinner> :  <Card.Text>
          Call results will show here
        </Card.Text>}
      </Card.Body>
    </Card>
    <VoterList></VoterList>
    </Container>


  );
}

export default App;
