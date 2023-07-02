import logo from './logo.svg';
import './App.css';


import { InputGroup, Form, Card, Button, Container, Image, Spinner } from "react-bootstrap";
import { useState } from 'react';

function App() {

  const [loading, setLoading] = useState(false);

  // function getData() {

  // }

  // (async function() {
  //   const response = await getData();
  //   console.log(response);
  // })();

  const getVoters = () => {
    console.log('getting voters')
  }

  return (
    <Container>
      <Card>
        <Image src={logo} className="App-logo" alt="logo" />

      </Card>
      <Button onClick={getVoters}>Get Voters</Button>
      <Form>
      <InputGroup className="mb-3">
        <InputGroup.Text id="aFirst">First</InputGroup.Text>
        <Form.Control id="lastName" size="lg" type="text" placeholder="first name" />
        <InputGroup.Text id="aLast">Last</InputGroup.Text>
        <Form.Control id="firstName" size="lg" type="text" placeholder="last name" />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text id="aCity">City</InputGroup.Text>
        <Form.Control id="city" size="lg" type="text" placeholder="Large text" />
        <InputGroup.Text id="aState-addon1">State</InputGroup.Text>
        <Form.Control id="state" size="lg" type="text" placeholder="Large text" />
      </InputGroup>
      <InputGroup>
        <InputGroup.Text id="aPhone">Phone</InputGroup.Text>
        <Form.Control id="phone" size="lg" type="tel" placeholder="Large text" />
      </InputGroup>
      <Button variant='primary' onClick={()=>setLoading(!loading)}>Submit</Button>
      </Form>
      <br/>
      <Card style={{ width: '18rem' }}>
      <Card.Body>
        <Card.Title>Results</Card.Title>
          {loading ? 
           <Spinner animation="border" role="status">
           <span className="visually-hidden">Loading...</span>
         </Spinner> :  <Card.Text>
          Call results will show here
        </Card.Text>}
      </Card.Body>
    </Card>
    </Container>


  );
}

export default App;
