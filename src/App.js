import logo from './logo.svg';
import './App.css';
import {  Container, Tabs, Tab } from "react-bootstrap";
import VoterList from './VoterList';
import ValidationList from './ValidationList';
import VoterForm from './VoterForm';


function App() {

 
  return (
    <Container> 
      <h2>U-Vote Admin</h2>
      <Tabs
      defaultActiveKey="voterList"
      id="uncontrolled-tab-example"
      className="mb-3"
    >
      <Tab eventKey="voterList" title="voterList">
        <h3>Add Voter</h3>
        <VoterForm></VoterForm>
        <hr></hr>
        <h3>Voter List</h3>
        <VoterList></VoterList>
      </Tab>
      <Tab eventKey="validationList" title="validationList">
        <h3>Validation List</h3>
        <ValidationList></ValidationList>
      </Tab>
    </Tabs>
      
    </Container>


  );
}

export default App;
