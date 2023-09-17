import logo from './logo.svg';
import './App.css';
import {  Container, Tabs, Tab } from "react-bootstrap";
import DuplicateList from './DuplicateList';
import ValidationList from './ValidationList';
import VoterForm from './VoterForm';
import {useState, useEffect} from "react";

function App() {

  const [voter,setVoter] = useState({});
  
  useEffect(()=>{ 
    console.log('voter was changed --- ', voter)
   
},[voter])
  

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
        <VoterForm checkVoter={setVoter}></VoterForm>
        <hr></hr>
        <h3>Duplicates List</h3>
        <DuplicateList newVoter={voter} ></DuplicateList>
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
