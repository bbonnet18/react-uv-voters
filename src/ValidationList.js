import Table from "react-bootstrap/Table";
import ValidationForm from "./ValidationForm";
import { Container, Form, InputGroup, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function ValidationList (){
    
    const starterValidation = {
        "lastname": "Jane",
        "firstname": "Doe",
        "city": "Springfield",
        "state": "ST",
        "age" : "55",
        "phone": "11231231234",
        "gender":"F",
        "valid":"false",
        "idsample":"1111",
        "idtype":"D"
      }
    const [loading,setLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [currentValidation,setCurrentValidation] = useState(starterValidation);
    const [validations,setValidations] = useState();
    const [img, setImg] = useState(null);
    const [modalsrc, setModalsrc] = useState(null);// holds the larger modal image if called
    const [selfy, setSelfy] = useState(null);
    const [show, setShow] = useState(false);
    const [imgrotate,setImgrotate] = useState(0);
    const handleClose = () => {
      setModalsrc(null);
      setShow(false);
    };
    const handleShow = () => {
      setModalsrc(img);// set the modal image to the ID image
      setShow(true)
    };

    async function getValidations(){
      setLoading(true);
      let myvalidations = await axios.get("http://localhost:3003/admin/validation-list");
      
      console.log('validations returned: ', myvalidations);
      if(myvalidations && myvalidations.data){
        setValidations(myvalidations.data.validations);
        setCurrentValidation(myvalidations.data.validations[0]);
        setLoading(false);
        getIDImgs();
      }else{
        console.error('noting back from call to server');
        setLoading(false);
      }
    }

    async function getIDImgs(){
        setImgLoading(true);
        let myImgUrls = await axios.get(`https://vote.u-vote.us/admin/id-image?phone=${currentValidation.phone}`);
        if(myImgUrls){
            setImg(myImgUrls.data.idlink);
            setSelfy(myImgUrls.data.selfylink);
        }
        setImgLoading(false);
    }

    useEffect(()=>{
        //console.log('updated - ', currentValidation)
        console.log('image',img)
    },[img,selfy])

    return (
        <Container>
        <h3>Update Validation</h3>
        <>
        {loading ?
            (<div className="loading-holder">
                <Spinner animation="border" className="img-load-spinner" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>) : (
        <Row className="img-preview-wrapper" >
                    <Col className={imgLoading ? "img-loading img-preview ID" : "img-preview ID"} lg={{span:4,offset:2}}>
                      <Row className="id-img-holder img"> 
                      {imgLoading ?
                        (<div className="loading-holder">
                            <Spinner animation="border" className="img-load-spinner" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>):(<img id="previewImg" alt="ID" src={img} />)  }</Row>
                    
                      <Row className="id-btn-holder">
                        <div>
                          <Button onClick={handleShow}>View Large</Button>
                          <Button onClick={()=>{
                              let currRotate = imgrotate;
                              setImgrotate(currRotate+90);
                              let myImg = document.getElementById('previewImg');
                              if(imgrotate > 360){
                                setImgrotate(0);
                              }
                              myImg.style.transform = "rotate("+imgrotate+"deg)";

                          }}>Rotate</Button>
                        </div>
                      </Row>
                    </Col>
                    <Col className={imgLoading ? "img-loading img-preview selfy" : "img-preview selfy"} lg={{span:4,offset:2}}>
                    {imgLoading ?
                        (<div className="loading-holder">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </Spinner>
                        </div>):(<img id="selfyImg" alt="selfy" src={selfy} />)}
                    </Col>
        </Row>)}
        </>
        <div><Button onClick={async ()=>{
            getIDImgs();

        }}>Get ID Images</Button></div>
        <ValidationForm validation={currentValidation} setValidation={setCurrentValidation}></ValidationForm>
        <Row>
          <Col lg={4}>
            <Button  onClick={getValidations} alt="get next validation">Get next validation</Button>
          </Col>
        </Row>
        {/* <Table striped bordered hover>
          <thead>
            <tr>
              <th>Phone</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>State</th>
              <th>City</th>
              <th>Gender</th>
              <th>valid</th>
              <th>idsample</th>
              <th>idtype</th>
              <th>action</th>
            </tr>
          </thead>
          <tbody>
            { validations && validations.length ? validations.map((itm,ind)=>{
              return <tr key={ind}> 
              <td>{itm.phone}</td>
              <td>{itm.firstname}</td>
              <td>{itm.lastname}</td>
              <td>{itm.age}</td>
              <td>{itm.state}</td>
              <td>{itm.city}</td>
              <td>{itm.gender}</td>
              <td>{itm.valid}</td>
              <td>{itm.idsample}</td>
              <td>{itm.idtype}</td>
              <td><Button onClick={()=>{
                setCurrentValidation(itm);
              }}>Load</Button></td>

            </tr>
            }) : <></>}
          
          </tbody>
        </Table> */}
        <hr></hr>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Enlarged ID Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>  <img id="previewImg" alt="ID" src={modalsrc} /></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

        </Container>
      );
}



export default ValidationList