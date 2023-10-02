import './App.css';
import { useState, useEffect } from 'react';
import { Row, Col, Form, InputGroup, Spinner, Button, Toast } from "react-bootstrap";
import axios from 'axios';


function VoterForm({ tabKey, voter, setVoter, duplicatesFound, setDuplicatesfound}) {

    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [currentVoter, setCurrentVoter] = useState(voter)
    const [resultsText, setResultsText] = useState(null);
    const [resultsTitle, setResultsTitle] = useState(null);
    const [toastType, setToasttype] = useState("Success");
    const [hasDups, setHasDups] = useState(true); 
    const [dupsChecked, setDupsChecked] = useState(true);

    useEffect(()=>{
        console.log('duplicates changed now: ', duplicatesFound);
        if(duplicatesFound === true){
            setHasDups(true);
            setResultsTitle('Duplicate Voter(s)!');
            setResultsText('Duplicate voter(s) found, do not add this voter.')
            setToasttype('danger');
            setDupsChecked(false);
            setShow(true);
        }else if(duplicatesFound === false){
            setHasDups(false);
            setResultsTitle('Not a duplicate');
            setResultsText('This is a new voter, please add.')
            setToasttype('success');
            setShow(true);
        }

    },[duplicatesFound])

    useEffect(()=>{
        console.log('voter changed in form to: ', voter);
        const newVoter = {...voter};
        setCurrentVoter(newVoter);
    },[voter])

    useEffect(()=>{
        console.log('key changed - ',tabKey)
    },[tabKey])
    // check the voter on changes to the fields
    const checkDuplicates = () => {
        setDuplicatesfound(null);
        const form = document.getElementById('voterForm');
        const isValid = form.checkValidity();
        if (isValid) {
            form.classList.remove('invalid');
            var formFields = form.querySelectorAll('.form-control');
            var genderSelect = form.querySelector('#aGender');
            var stateSelect = form.querySelector('#aState');

            var payload = {}
            for (let i = 0; i < formFields.length; i++) {
                console.log('val: ', formFields[i].value);
                payload[formFields[i].name] = formFields[i].value;
            }
            payload['gender'] = genderSelect.value;
            payload['state'] = stateSelect.value;


            console.log('payload: ', payload);

            setVoter(payload);
        }
    }

    const reset = ()=>{
        const form = document.getElementById('voterForm');
        form.reset();
        setLoading(false);
        setShow(false);
        setCurrentVoter({
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
        setResultsText(null)
        setResultsTitle(null);
        setToasttype("Success");
        setHasDups(true);
        setDupsChecked(true);
    }

    // check fields and attempt to add
    const addVoter = async () => {

        console.log('currentVoter :', currentVoter);
        const form = document.getElementById('voterForm');
        const isValid = form.checkValidity();
        if (isValid) {
            form.classList.remove('invalid');
            var formFields = form.querySelectorAll('.form-control');
            var genderSelect = form.querySelector('#aGender');
            var stateSelect = form.querySelector('#aState');
            var idSelect = form.querySelector('#idType');
            var payload = {}
            for (let i = 0; i < formFields.length; i++) {
                console.log('val: ', formFields[i].value);
                payload[formFields[i].name] = formFields[i].value;
            }
            payload['gender'] = genderSelect.value;
            payload['state'] = stateSelect.value;
            payload['idtype'] = idSelect.value;

            console.log('payload: ', payload);

            setLoading(true)
            let res = await axios.post("https://vote.u-vote.us/admin/add-voter", payload);
            console.log(res);
            form.reset();
            setLoading(false);
            setCurrentVoter({});
            setResultsTitle('Voter added');
            setResultsText('The voter was added sucessfully.')
            setToasttype('success');
            setShow(true);
            setHasDups(true);
            setDupsChecked(true);
        } else {
            form.classList.add('invalid');
        }

    }

     // check fields and attempt to add
     const addValidation = async () => {

        const form = document.getElementById('voterForm');
        const isValid = form.checkValidity();
        if (isValid) {
          form.classList.remove('invalid');
          var formFields = form.querySelectorAll('.form-control');
          var genderSelect = form.querySelector('#aGender');
          var stateSelect = form.querySelector('#aState');
          var payload = {}
          for (let i = 0; i < formFields.length; i++) {
            console.log('val: ', formFields[i].value);
            payload[formFields[i].name] = formFields[i].value;
          }
          payload['gender'] = genderSelect.value;
          payload['state'] = stateSelect.value; 
          payload['valid'] =  true;
          console.log('payload: ', payload);
    
          setLoading(true)
          let res = await axios.post("http://localhost:3003/admin/validation-list", payload);
          form.reset();
          console.log(res);
          setLoading(false)
        } else {
          form.classList.add('invalid');
        }
    
      }
    
    
      const rejectValidation = async () => {
    
        const form = document.getElementById('voterForm');
       
          var reasonSelect = form.querySelector('#rejectionReason');
          var payload = {
            reason:reasonSelect.value,
            phone:currentVoter.phone
          }
    
          setLoading(true)
          let res = await axios.post("http://localhost:3003/admin/reject-validation", payload);
          form.reset();
          console.log(res);
          setResultsText("confirmed");
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
                <InputGroup className="mb-3" as={Row} >
                    <Col sm={12} lg={6}>
                        <InputGroup.Text id="aFirst" >First</InputGroup.Text>
                        <Form.Control id="firstName" name="firstname" type="text" onChange={(e)=>{setCurrentVoter({...currentVoter,firstname:e.target.value})}} placeholder="first name" value={currentVoter.firstname} required />
                    </Col>
                    <Col sm={12} lg={6}>
                        <InputGroup.Text id="aLast" className='form-col'>Last</InputGroup.Text>
                        <Form.Control id="lastName" name="lastname" size="lg" type="text" onChange={(e)=>{setCurrentVoter({...currentVoter,lastname:e.target.value})}}  placeholder="last name" value={currentVoter.lastname} required />
                    </Col>
                </InputGroup>
                <InputGroup className='mb-3'>
                    <InputGroup.Text id="aCity">City</InputGroup.Text>
                    <Form.Control id="city" name="city" size="lg" type="text" minLength={2} onChange={(e)=>{setCurrentVoter({...currentVoter,city:e.target.value})}}  placeholder="city" value={currentVoter.city}  required />
                    <InputGroup.Text id="aState-addon1" className='form-col' >State</InputGroup.Text>
                    <Form.Select aria-label="State" name="state" id="aState" required onChange={(e)=>{setCurrentVoter({...currentVoter,state:e.target.value})}}  value={currentVoter.state}>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="DC">District Of Columbia</option>
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
                </InputGroup>
                <InputGroup className='mb-3'>
                    <InputGroup.Text id="aPhone" >Phone</InputGroup.Text>
                    <Form.Control id="phone" name="phone" size="lg" type="tel" onChange={(e)=>{setCurrentVoter({...currentVoter,phone:e.target.value})}}  placeholder="phone" value={currentVoter.phone} required />
                    <InputGroup.Text id="aAge" className='form-col' >Age</InputGroup.Text>
                    <Form.Control id="age" name="age" size="lg" type="number"onChange={(e)=>{setCurrentVoter({...currentVoter,age:e.target.value})}}  placeholder="age"  value={currentVoter.age}  required />
                </InputGroup>
                <InputGroup className='mb-3'>
                    <Form.Check // prettier-ignore
                        type={'checkbox'}
                        id={'opt-in'}
                        label={'Voter agrees to receive text messages'} required
                    />
                </InputGroup>
                <InputGroup className='mb-3'>
                <InputGroup.Text className='form-col'>Gender</InputGroup.Text>
                    <Form.Select aria-label="Gender" name="gender" id="aGender" required onChange={(e)=>{setCurrentVoter({...currentVoter,gender:e.target.value})}} value={currentVoter.gender} >
                        <option value="F">Female</option>
                        <option value="M">Male</option>
                        <option value="U">Unknown</option>
                    </Form.Select>
                </InputGroup>
                <hr></hr>
                <InputGroup className='mb-3'>
                    <InputGroup.Text id="aidType" className='form-col'>ID Type</InputGroup.Text>
                    <Form.Select aria-label="id-type" name="idType" id="idType" required onChange={(e)=>{setCurrentVoter({...currentVoter,idtype:e.target.value})}}  value={currentVoter.idtype} >
                        <option value="D">drivers license</option>
                        <option value="P">US Passport</option>
                        <option value="U">university ID</option>
                    </Form.Select>
                    <InputGroup.Text id="aidSample" className='form-col'>ID Sample</InputGroup.Text>
                    <Form.Control id="idsample" name="idsample" size="lg" type="text" minLength={4} maxLength={4} onChange={(e)=>{setCurrentVoter({...currentVoter,idsample:e.target.value})}}  placeholder="last 4 characters of ID" value={currentVoter.idsample}  required />
                </InputGroup>
                <Toast onClose={() => setShow(false)} bg={toastType} show={show} delay={3000} autohide>
                <Toast.Header>
                    <strong className="me-auto">{resultsTitle}</strong>
                </Toast.Header>
                <Toast.Body>{resultsText}</Toast.Body>
                </Toast>
                <Row>
                <Col lg={3}>
                    <Button variant='warning' onClick={() => checkDuplicates()}>Check Duplicates</Button>
                </Col>
                <Col lg={3}>
                <Row>
                <Form.Check // prettier-ignore
                        type={'checkbox'}
                        id={'dupsChecked'}
                        label={'Did you check for duplicates?'} onChange={(e)=>{

                            if(e.currentTarget.checked){
                                console.log('checked')
                                setHasDups(false);
                            }else{
                                setHasDups(true);
                            }
                        }}
                    disabled={dupsChecked}/>
                </Row>
                </Col>
                <Col lg={3}>
                    <Button variant='primary' onClick={() => addVoter()} disabled={hasDups}>Add Voter</Button>
                </Col>
                <Col lg={3}>
                    <Button variant='danger' onClick={() => reset()} >Reset</Button>
                </Col>
                </Row>
                
            </Form>)
        }
        </>
    )
}

export default VoterForm;
