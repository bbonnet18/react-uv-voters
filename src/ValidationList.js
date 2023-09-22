import Table from "react-bootstrap/Table";
import ValidationForm from "./ValidationForm";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
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



    useEffect(()=>{ 
        async function getValidations(){
            let myvalidations = await axios.get("https://vote.u-vote.us/admin/validation-list");
            if(myvalidations && myvalidations.data){
              setValidations(myvalidations.data.validations);
            }else{
              console.error('noting back from call to server');
            }
        }
        getValidations();
    },[])

    async function getIDImgs(){

        let myImgUrls = await axios.get(`https://vote.u-vote.us/admin/id-image?phone=${currentValidation.phone}`);
        if(myImgUrls){
            setImg(myImgUrls.data.idlink);
            setSelfy(myImgUrls.data.selfylink);
        }

        let imgPreviews = document.querySelectorAll('.img-preview img');
        imgPreviews.forEach((itm)=>{
          itm.classList.add('showing');
        })

    }

    useEffect(()=>{
        //console.log('updated - ', currentValidation)
        console.log('image',img)
    },[img,selfy])

    return (
        <Container>
        <h3>Update Validation</h3>
        <Row className="img-preview-wrapper" >
                    <Col className='img-preview ID' lg={{span:4,offset:2}}>
                      <Row className="id-img-holder"> <img id="previewImg" alt="ID" src={img} /></Row>
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
                    <Col className='img-preview selfy' lg={{span:4,offset:2}}>
                    <img id="selfyImg" alt="selfy" src={selfy} />
                    </Col>
        </Row>
        <div><Button onClick={async ()=>{
            getIDImgs();

        }}>Get ID Images</Button></div>
        <ValidationForm validation={currentValidation} setValidation={setCurrentValidation}></ValidationForm>
        <Table striped bordered hover>
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
        </Table>
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