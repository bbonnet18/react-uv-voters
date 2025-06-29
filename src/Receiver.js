import './App.css';
import axios from 'axios';
import config from './config';
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import { useState } from 'react';


// this will be the main way a voter enters their information after they are hit with the quote
// and the check is made for the existing comment
function Receiver(props) {
    const starterReceiver = {
        "firstname":"",
        "lastname":"",
        "office":"",
        "status":"",
        "website":"",
        "social":"",
        "locality":"",
    }
    const [firstName,setFirstName] = useState("");
    const [currentReceiver,setCurrentReceiver] = useState(starterReceiver);

    const submitReceiver = async (e) => {
        const form = document.getElementById('receiverForm');
        try{
            
            const isValid = form.checkValidity();
            if(!isValid){
                var formFields = form.querySelectorAll('.form-control');
                for (let i = 0; i < formFields.length; i++) {
                    let field = formFields[i];
                    console.log('val: ',field.value); 
                    console.log('Name: ',field.name," isValid: ",field.checkValidity());
                }
            }

            if(isValid){
                form.classList.remove('.error');
                var formFields = form.querySelectorAll('.form-control');
                var partySelect = form.querySelector('#party');
                var formVals = {}
                for (let i = 0; i < formFields.length; i++) {
                        formVals[formFields[i].name] =  formFields[i].value;
                }
                formVals.party = partySelect.value;

                let res = await axios.post(`${config.apiBaseUrl}/conduit/create-receiver`, formVals, {
                            withCredentials: true
                })
                if(res && res.status === 200){
                    props.hide(false);
                }
            }else{
                form.classList.add('.error');
            }
            
        }catch(err){
            alert('Error ',err);
        }
        

    }


    return (
        <Modal show={props.show} onHide={props.hide} className='receiver-dialog'>

            <Modal.Dialog className="receiver-dialog">
                    <><Modal.Header closeButton>
                        <Modal.Title className='receiver-title'>Receiver</Modal.Title>
                    </Modal.Header>
                        <Modal.Body>
                            {/* <Form id="receiverForm" >
                                <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rFirst">First:</Form.Label>
                                    </Col>
                                        <Col lg={10} md={12}>
                                            <Form.Control id="firstName" name="firstname" lg={6} type="text" placeholder="first name" value={firstName} onChange={(e)=>{
                                                setFirstName(e.target.value); 
                                            }} required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rLast">Last:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                            <Form.Control id="lastName" name="lastname" lg={6} type="text" placeholder="last name" defaultValue={currentReceiver.lastname} required />
                                    </Col>
                                </Row>
                                 <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rLocality">Locality:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                            <Form.Control id="locality" name="locality" lg={6} type="text" placeholder="state abbreviation or town name" defaultValue={currentReceiver.locality} required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rOffice">Office:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                            <Form.Control id="office" name="office" lg={6} type="text" placeholder="office" defaultValue={currentReceiver.office} required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rStatus">Status:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                            <Form.Control id="status" name="status" lg={6} type="text" placeholder="status: incumbant | challenger" defaultValue={currentReceiver.status} required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rParty">Party:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                        <Form.Select aria-label="party" name="party" id="party" required defaultValue="D">
                                            <option value="D">Democrat</option>
                                            <option value="R">Republican</option>
                                            <option value="I">Independent</option>
                                            <option value="G">Green</option>
                                            <option value="L">Libertarian</option>
                                        </Form.Select>
                                    </Col>
                                </Row>
                                 <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rWebsite">Website:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                            <Form.Control id="website" name="website" lg={6} type="url" placeholder="main website" defaultValue={currentReceiver.website} />
                                    </Col>
                                </Row>
                                 <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rSocial">Social Media:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                            <Form.Control id="social" name="social" lg={6} type="text" placeholder="social media handles" defaultValue={currentReceiver.social} />
                                    </Col>
                                </Row>
                            </Form> */}
                        </Modal.Body>

                        <Modal.Footer>
                            <Button variant="secondary" onClick={(e) => {
                                props.hide(false);
                            }}>Close</Button>
                            <Button variant="primary" onClick={async (e) => {
                                await submitReceiver(); 
                            }}>Submit</Button>
                        </Modal.Footer>
                    </>
            </Modal.Dialog>
        </Modal>

    )
}

export default Receiver; 