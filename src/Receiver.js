import './App.css';
import axios from 'axios';
import config from './config';
import { Button, Form, Row, Col, Modal } from "react-bootstrap";
import { useState,useEffect } from 'react';


// this will be the main way a voter enters their information after they are hit with the quote
// and the check is made for the existing comment
function Receiver(props) {
        //    const starterReceiver = {
        //     "firstname":"",
        //     "lastname":"",
        //     "office":"",
        //     "category":"",
        //     "party":"",
        //     "website":"",
        //     "social":"",
        //     "locality":"",
        // }
    const [currentReceiver,setCurrentReceiver] = useState(props.receiver);
    const [firstName,setFirstName] = useState("");

    useEffect(()=>{
        let newReceiver = {};
        let receiverKeys = Object.keys(props.receiver); 
        for(let k in receiverKeys){
            newReceiver[receiverKeys[k]] = props.receiver[receiverKeys[k]].S;
        }
        setCurrentReceiver(newReceiver);
    },[props.receiver])

    const submitReceiver = async (e) => {
        const form = document.getElementById('receiverForm');
        try{
            
            const isValid = form.checkValidity();
      
            if(isValid){
                form.classList.remove('.error');
                const formFields = form.querySelectorAll('.form-control');
                const partySelect = form.querySelector('#party');
                const categorySelect = form.querySelector('#category');
                const localitySelect = form.querySelector('#locality');

                var formVals = {}
                for (let i = 0; i < formFields.length; i++) {
                        formVals[formFields[i].name] =  formFields[i].value;
                }
                formVals.party = partySelect.value;
                formVals.category = categorySelect.value;
                formVals.locality = localitySelect.value;
                if(props.isNew){
                    await props.createReceiver(formVals);
                }else{
                    formVals.receiverId = currentReceiver.receiverId;
                    await props.updateReceiver(formVals); 
                }
                
                props.hide(false);
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
                            <Form id="receiverForm" >
                                <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rLast">Last:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                            <Form.Control id="lastName" name="lastname" lg={6} type="text" placeholder="last name" defaultValue={currentReceiver.lastname} disabled={currentReceiver.lastname !== ""}    required />
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rFirst">First:</Form.Label>
                                    </Col>
                                        <Col lg={10} md={12}>
                                            <Form.Control id="firstName" name="firstname" lg={6} type="text" placeholder="first name" defaultValue={currentReceiver.firstname} disabled={currentReceiver.firstname !== ""} required />
                                    </Col>
                                </Row>
                                 <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rLocality">Locality:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                        <Form.Select aria-label="locality" name="locality" id="locality" required defaultValue={currentReceiver.locality}>
                                            <option value="US">United States</option>
                                            <option value="LOCAL">LOCAL</option>
                                            <option value="AL">Alabama</option>
                                            <option value="AK">Alaska</option>
                                            <option value="AZ">Arizona</option>
                                            <option value="AR">Arkansas</option>
                                            <option value="CA">California</option>
                                            <option value="CO">Colorado</option>
                                            <option value="CT">Connecticut</option>
                                            <option value="DE">Delaware</option>
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
                                        <Form.Label id="rStatus">Category:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                            <Form.Select id="category" name="category" lg={6} type="text" placeholder="local" defaultValue={currentReceiver.category} required >
                                                <option value="local">local</option>
                                                <option value="state">state</option>
                                                <option value="federal">federal</option>
                                            </Form.Select>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col lg={2} md={12}>
                                        <Form.Label id="rParty">Party:</Form.Label>
                                    </Col>
                                    <Col lg={10} md={12}>
                                        <Form.Select aria-label="party" name="party" id="party" required defaultValue="D">
                                            <option value="D">Democratic</option>
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
                            </Form>
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