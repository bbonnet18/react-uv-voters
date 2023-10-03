import logo from './logo.svg';
import './App.css';
import {  Container, Tabs, Tab, Row, Col, Navbar } from "react-bootstrap";
import DuplicateList from './DuplicateList';
import ValidationList from './ValidationList';
import VoterForm from './VoterForm';
import {useState, useEffect} from "react";

function App() {

  const [voter,setVoter] = useState({
    "age": "",
    "gender": "",
    "city": "",
    "state": "",
    "phone": "",
    "lastname": "",
    "firstname": "",
    "valid": "",
    "idtype":"",
    "idsample": ""
});
  const [duplicatesFound, setDuplicatesfound] = useState(null);
  const [key, setKey] = useState('voterList');


  useEffect(()=>{
    setVoter({
      "age": "",
      "gender": "",
      "city": "",
      "state": "",
      "phone": "",
      "lastname": "",
      "firstname": "",
      "valid": "",
      "idtype":"",
      "idsample": ""
  });
  },[key])

   



  return (
    <Container> 
      <Row className='header'>
        <Col lg={12}>
        <img
              src="/vote_draft_icon.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="U-Vote"
            />
          <div >U-Vote Admin</div>
        </Col>
      </Row>
    <VoterForm tabKey={key} setVoter={setVoter} voter={voter} duplicatesFound={duplicatesFound} setDuplicatesfound={setDuplicatesfound}></VoterForm>
    <Tabs
      activeKey={key}
      onSelect={(k) => {console.log('k is ',k); setKey(k);}}
      className="mb-3"
    >
      <Tab eventKey="voterList" title="voterList">
        <h3>Add Voter</h3>
        <DuplicateList newVoter={voter} setDuplicatesfound={setDuplicatesfound} ></DuplicateList>
      </Tab>
      <Tab eventKey="validationList" title="validationList">
        <h3>Validation List</h3>
        <ValidationList voter={voter} setVoter={setVoter}></ValidationList>
      </Tab>
    </Tabs>
    </Container>


  );
}

export default App;
