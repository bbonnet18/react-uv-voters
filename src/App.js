import logo from './logo.svg';
import './App.css';
import {  Container, Tabs, Tab, Row, Col, Navbar } from "react-bootstrap";
import DuplicateList from './DuplicateList';
import ValidationList from './ValidationList';
import VoterForm from './VoterForm';
import {useState, useEffect} from "react";

function App() {

  const [voter,setVoter] = useState({
    "age": "55",
    "gender": "F",
    "city": "Springfield",
    "state": "MA",
    "phone": "11233211234",
    "lastname": "Johnson",
    "firstname": "Mary",
    "valid": "false",
    "idtype":"D",
    "idsample": "ijkl"
});
  const [duplicatesFound, setDuplicatesfound] = useState(null);
//   useEffect(()=>{ 
//     console.log('voter was changed --- ', voter);
//     console.log('dups found ', duplicatesFound);
// },[voter,duplicatesFound])


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
    <VoterForm setVoter={setVoter} voter={voter} duplicatesFound={duplicatesFound} setDuplicatesfound={setDuplicatesfound}></VoterForm>
    <Tabs
      defaultActiveKey="voterList"
      id="uncontrolled-tab-example"
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
