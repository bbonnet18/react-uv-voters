import './App.css';
import { Container, Tabs, Tab, Row, Col } from "react-bootstrap";
import ValidationList from './ValidationList';
import VoterForm from './VoterForm';
import {useState, useEffect} from "react";
import Login from "./Login";


function Manage({user, setUser}) {

  const [voter,setVoter] = useState({
    "DOB": "",
    "address1":"",
    "gender": "",
    "city": "",
    "state": "",
    "zipcode":"",
    "phone": "",
    "lastname": "",
    "firstname": "",
    "valid": "",
    "idtype":"",
    "keyStr":"",
    "idsample": ""
});
  const [hasValidations, setHasValidations] = useState(null);
  const [key, setKey] = useState('voterList');
  const [completed,setCompleted] = useState(true); 
  const [receiptHandle,setReceiptHandle] = useState("");// used to remove messages that have been actioned


  useEffect(()=>{
    setVoter({
      "DOB": "",
      "address1":"",
      "gender": "",
      "city": "",
      "state": "",
      "zipcode":"",
      "phone": "",
      "lastname": "",
      "firstname": "",
      "valid": "",
      "idtype":"",
      "idsample": "",
      "keyStr": ""
  });
  },[key])

  



  return (
    <Container> 
      <Row className='header'>
        <Col lg={9}>
        <img
              src="/vote_draft_icon.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="U-Vote"
            />
          <div >U-Vote Admin</div>
        </Col>
        <Col lg={3}>
           <Login user={user}></Login>
        </Col>
      </Row>
        <h3>Validation List</h3>
        <ValidationList voter={voter} setVoter={setVoter} setHasValidations={setHasValidations} setReceiptHandle={setReceiptHandle}  ></ValidationList>
    <VoterForm tabKey={key} setVoter={setVoter} voter={voter} hasValidations={hasValidations} setCompleted={setCompleted} receiptHandle={receiptHandle}></VoterForm>
   
    </Container>


  );
}

export default Manage;
