import './App.css';
import { useState, useEffect } from 'react';
import { Row, Col, Form, InputGroup, Spinner, Button, Toast, ToastContainer } from "react-bootstrap";
import axios from 'axios';
import config from './config';


function VoterForm({ tabKey, voter, setCompleted, receiptHandle }) {

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [currentVoter, setCurrentVoter] = useState(voter)
    const [resultsText, setResultsText] = useState(null);
    const [resultsTitle, setResultsTitle] = useState(null);
    const [toastType, setToasttype] = useState("Success");


    useEffect(() => {
        console.log('voter changed in form to: ', voter);
        const newVoter = { ...voter };
        setCurrentVoter(newVoter);

    }, [voter])

    useEffect(() => {
        console.log('key changed - ', tabKey)
        reset();
    }, [tabKey])
    // check the voter on changes to the fields

    const reset = () => {
        const form = document.getElementById('voterForm');
        if (form) {
            form.reset();
        }
        setLoading(false);
        setShow(false);
        setCurrentVoter({
            "DOB": "",
            "address1": "",
            "address2": "",
            "gender": "",
            "city": "",
            "state": "",
            "phone": "",
            "lastname": "",
            "firstname": "",
            "valid": "",
            "idtype": "",
            "idsample": "",
            "zipcode": "",
            "keyStr": ""
        });
        setResultsText(null)
        setResultsTitle(null);
        setToasttype("Success");
        setCompleted(true);// to remove the images
    }



    //  // check fields and attempt to add
    const addValidation = async (vType) => {

        const form = document.getElementById('voterForm');
        const isValid = form.checkValidity();
        if (isValid) {
            form.classList.remove('invalid');
            var formFields = form.querySelectorAll('.form-control');
            var genderSelect = form.querySelector('#aGender');
            var idSelect = form.querySelector('#idType');
            var voter = {}
            for (let i = 0; i < formFields.length; i++) {
                console.log('val: ', formFields[i].value);
                voter[formFields[i].name] = formFields[i].value;
            }
            voter['gender'] = genderSelect.value;
            voter['valid'] = true;
            voter['idtype'] = idSelect.value;
            voter['keyStr'] = currentVoter.keyStr;
            if (vType === "visual") {
                voter['idsample'] = "OKGO";
                voter['idtype'] = "C"
            }

            voter.receiptHandle = receiptHandle;

            setLoading(true)
            try{

                let res = await axios.post(`${config.apiBaseUrl}/admin/validation-list`, voter, {
                    withCredentials: true
                });
            }catch(err){
                console.error('error ', err);
            }
            setResultsTitle('Voter validated');
            setResultsText('The voter will receive a text message to validate.')
            setToasttype('success');
            setShow(true);
            reset();
            setLoading(false)
        } else {
            form.classList.add('invalid');
        }

    }

    const rejectValidation = async () => {


        const form = document.getElementById('voterForm');
        var reasonSelect = form.querySelector('#rejectionReason');
        var payload = {
            reason: reasonSelect.value,
            phone: currentVoter.phone,
            receiptHandle: receiptHandle

        }

        setLoading(true)
        try{
            let res = await axios.post(`${config.apiBaseUrl}/admin/reject-validation`, payload, {
                withCredentials: true
            });
        }catch(err){
            console.error('error: ',err)
        }
      
        setResultsTitle('Voter rejected');
        setResultsText('The voter will receive a text message with the rejection reason.')
        setToasttype('success');
        reset();
        setShow(true);
        setLoading(false)

    }


    return (
        <>
            {loading ?
                (<div className="loading-holder">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>) :
                (<Form id="voterForm">
                    <ToastContainer className="p-3"
                        position={'middle-center'}>
                        <Toast onClose={() => setShow(false)} bg={toastType} show={show} delay={3000} autohide>
                            <Toast.Header>
                                <strong className="me-auto">{resultsTitle}</strong>
                            </Toast.Header>
                            <Toast.Body>{resultsText}</Toast.Body>
                        </Toast>
                    </ToastContainer>
                    <hr></hr>
                    <InputGroup className='mb-3' as={Row}>
                        <Col sm={12} lg={6}>
                            <Form.Label id="aidType" className='form-col'>ID Type</Form.Label>
                            <Form.Select size="lg" aria-label="id-type" name="idType" id="idType" required onChange={(e) => { setCurrentVoter({ ...currentVoter, idtype: e.target.value }) }} value={currentVoter.idtype} >
                                <option value="D">drivers license</option>
                                <option value="P">US Passport</option>
                                <option value="U">university ID</option>
                                <option value="C">conditional</option>
                            </Form.Select>
                        </Col>
                        <Col sm={12} lg={6}>
                            <Form.Label id="aidSample" className='form-col'>ID Sample</Form.Label>
                            <Form.Control id="idsample" name="idsample" size="lg" type="text" minLength={4} maxLength={4} onChange={(e) => { setCurrentVoter({ ...currentVoter, idsample: e.target.value }) }} placeholder="last 4 characters of ID" value={currentVoter.idsample} required />
                        </Col>
                    </InputGroup>
                    <Row className="mb-3">
                        <Col sm={12} lg={6}>
                            <Form.Label id="aFirst" >First</Form.Label>
                            <Form.Control id="firstName" name="firstname" size="lg" type="text" onChange={(e) => { setCurrentVoter({ ...currentVoter, firstname: e.target.value }) }} placeholder="first name" value={currentVoter.firstname} required />
                        </Col>
                        <Col sm={12} lg={6}>
                            <Form.Label id="aLast" className='form-col'>Last</Form.Label>
                            <Form.Control id="lastName" name="lastname" size="lg" type="text" onChange={(e) => { setCurrentVoter({ ...currentVoter, lastname: e.target.value }) }} placeholder="last name" value={currentVoter.lastname} required />
                        </Col>
                    </Row>
                    <InputGroup className='mb-3' as={Row}>
                        <Col sm={12} lg={6}>
                            <Form.Label id="aAddress1">Address1</Form.Label>
                            <Form.Control id="address1" name="address1" size="lg" type="text" onChange={(e) => { setCurrentVoter({ ...currentVoter, address1: e.target.value }) }} placeholder="address" value={currentVoter.address1} required />
                        </Col>
                        <Col sm={12} lg={6}>
                            <Form.Label id="aAddress1">Address2</Form.Label>
                            <Form.Control id="address2" name="address2" size="lg" type="text" onChange={(e) => { setCurrentVoter({ ...currentVoter, address2: e.target.value }) }} placeholder="address" value={currentVoter.address2} />
                        </Col>
                        <Col sm={12} lg={6}>
                            <Form.Label id="aCity">City</Form.Label>
                            <Form.Control id="city" name="city" size="lg" type="text" minLength={2} onChange={(e) => { setCurrentVoter({ ...currentVoter, city: e.target.value }) }} placeholder="city" value={currentVoter.city} required />
                        </Col>
                        <Col sm={12} lg={6}>
                            <Form.Label id="aState-addon1" className='form-col' >State</Form.Label>
                            <Form.Control aria-label="State" type="text" name="state" id="aState" onChange={(e) => { setCurrentVoter({ ...currentVoter, state: e.target.value }) }} value={currentVoter.state} required />
                        </Col>
                        <Col sm={12} lg={6}>
                            <Form.Label id="aZipcode">Zipcode</Form.Label>
                            <Form.Control id="zipcode" name="zipcode" size="lg" type="text" minLength={5} onChange={(e) => { setCurrentVoter({ ...currentVoter, zipcode: e.target.value }) }} placeholder="zipcode" value={currentVoter.zipcode} required />
                        </Col>
                    </InputGroup>
                    <InputGroup className='mb-3' as={Row}>
                        <Col md={12} lg={6}>
                            <Form.Label id="aPhone" >Phone</Form.Label>
                            <Form.Control id="phone" name="phone" size="lg" type="tel" pattern="[0-9]{10}" maxLength={10} onChange={(e) => {
                                setCurrentVoter({ ...currentVoter, phone: e.target.value })


                            }} placeholder="phone" value={currentVoter.phone} required />
                        </Col>
                        <Col md={12} lg={6}>
                            <Form.Label id="aDOB" className='form-col' >DOB</Form.Label>
                            <Form.Control id="DOB" name="DOB" size="lg" pattern="(0[1-9]|1[1,2,0])\/(0[1-9]|[12][0-9]|3[01])\/(19|20)\d{2}" onChange={(e) => { setCurrentVoter({ ...currentVoter, age: e.target.value }) }} placeholder="DOB" value={currentVoter.DOB} required />
                        </Col>
                    </InputGroup>
                    {tabKey === "voterList" ? (<InputGroup className='mb-3'>
                        <Form.Check // prettier-ignore
                            type={'checkbox'}
                            id={'opt-in'}
                            label={'Voter agrees to receive text messages'} checked={true} required
                        />
                    </InputGroup>) : (<InputGroup className='mb-3'>
                        <Form.Check // prettier-ignore
                            type={'checkbox'}
                            id={'Valid'}
                            label={'valid'} required onChange={(e) => { setCurrentVoter({ ...currentVoter, valid: e.target.value }) }} value={currentVoter.valid}
                        />
                    </InputGroup>)}
                    <InputGroup className='mb-3'>
                        <Form.Label className='form-col'>Gender</Form.Label>
                        <Form.Select aria-label="Gender" name="gender" id="aGender" required onChange={(e) => { setCurrentVoter({ ...currentVoter, gender: e.target.value }) }} value={currentVoter.gender} >
                            <option value="F">Female</option>
                            <option value="M">Male</option>
                            <option value="U">Unknown</option>
                        </Form.Select>
                    </InputGroup>

                    <InputGroup  className='mb-3'>
                        
                        <Col id="actions" lg={{span:3,offset:9}} xs={{span:6,offset:6}}>
                            <Row className='mb-1'> 
                                <Button variant='success' onClick={() => addValidation("visual")}> {loading ?
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner> : "visual validation"}</Button>
                            </Row>
                            <Row>
                                <Button variant='success' onClick={() => addValidation()} disabled={false}> {loading ?
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner> : "Accept"}</Button>
                            </Row>
                            <Row>
                                <Form.Select aria-label="rejection reason" name="reason" id="rejectionReason" defaultValue="invalid_id" >
                                    <option value="invalid_id">Invalid ID</option>
                                    <option value="picture_too_dark">Picture too dark</option>
                                    <option value="picture_poor_quality">Poor quality picture</option>
                                </Form.Select>
                            </Row>
                            <Row>
                                <Button variant="danger" onClick={() => { rejectValidation() }} disabled={false}>{loading ?
                                    <Spinner animation="border" role="status">
                                        <span className="visually-hidden">Loading...</span>
                                    </Spinner> : "Reject"}</Button>
                            </Row>
                        </Col>
                    </InputGroup>
                </Form>)
            }
        </>
    )
}

export default VoterForm;
