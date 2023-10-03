
import { Container, Form, InputGroup, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function ValidationList ({setVoter, voter}){
    

    const [loading,setLoading] = useState(false);
    const [imgLoading, setImgLoading] = useState(false);
    const [img, setImg] = useState(null);
    const [modalsrc, setModalsrc] = useState(null);// holds the larger modal image if called
    const [selfy, setSelfy] = useState(null);
    const [show, setShow] = useState(false);
    const [imgrotate,setImgrotate] = useState(0);

    useEffect(()=>{ 
      // remove the loaded images
      if(voter && voter.lastname == ""){
        setImg("");
        setSelfy("");
      }
  },[voter])



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
        setVoter(myvalidations.data.validations[0]);
        setLoading(false);
        getIDImgs(myvalidations.data.validations[0]);
      }else{
        setLoading(false);
      }
    }

    async function getIDImgs(validation){
        setImgLoading(true);
        if(validation && validation.phone){
          let myImgUrls = await axios.get(`http://localhost:3003/admin/id-image?phone=${validation.phone}`);
          if(myImgUrls){
              setImg(myImgUrls.data.idlink);
              setSelfy(myImgUrls.data.selfylink);
          }
        }
        
        setImgLoading(false);
    }

    




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
        <Row>
          <Col lg={4}>
            <Button  onClick={getValidations} alt="get next validation">Get next validation</Button>
          </Col>
        </Row>
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