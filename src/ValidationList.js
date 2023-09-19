import Table from "react-bootstrap/Table";
import ValidationForm from "./ValidationForm";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function ValidationList (){
    
    const starterValidation = {
        "lastname": "clownface",
        "firstname": "bobo",
        "city": "circus",
        "state": "IL",
        "age" : "55",
        "phone": "11231231234",
        "gender":"U",
        "valid":"true",
        "idsample":"1111",
        "idtype":"D"
      }

    const [currentValidation,setCurrentValidation] = useState(starterValidation);
    const [validations,setValidations] = useState();
    const [img, setImg] = useState(null);
    const [selfy, setSelfy] = useState(null);
    useEffect(()=>{ 
        async function getValidations(){
            let myvalidations = await axios.get("http://vote.u-vote.us/admin/validation-list");
            if(myvalidations && myvalidations.data){
              setValidations(myvalidations.data.validations);
            }else{
              console.error('noting back from call to server');
            }
        }
        getValidations();
    },[])

    async function getIDImgs(){

        let myImgUrls = await axios.get(`http://vote.u-vote.us/admin/id-image?phone=${currentValidation.phone}`);
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
        <ValidationForm validation={currentValidation} setValidation={setCurrentValidation}></ValidationForm>
        {/* <div className='img-preview-wrapper'>
                    <img id="previewImg" alt="preview image" src={img} className='img-preview'/>
        </div> */}
        <Row className="img-preview-wrapper" >
                    <Col className='img-preview' lg={{span:4,offset:2}}>
                    <img id="previewImg" alt="ID" src={img} />
                    </Col>
                    <Col className='img-preview selfy' lg={{span:4,offset:2}}>
                    <img id="selfyImg" alt="selfy" src={selfy} />
                    </Col>
        </Row>
        <div><Button onClick={async ()=>{
            getIDImgs();

        }}>Get ID Images</Button></div>
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
        

        </Container>
      );
}



export default ValidationList