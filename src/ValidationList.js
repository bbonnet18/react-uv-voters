import Table from "react-bootstrap/Table";
import ValidationForm from "./ValidationForm";
import { Button } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function ValidationList (){
    
    const starterValidation = {
        "lastname": "",
        "firstname": "",
        "city": "",
        "state": "",
        "phone": "",
        "gender":"",
        "valid":false,
        "idsample":""
      }

    const [currentValidation,setCurrentValidation] = useState(starterValidation);
    const [validations,setValidations] = useState();
    const [img, setImg] = useState(null);
    useEffect(()=>{ 
        async function getValidations(){
            let myvalidations = await axios.get("http://localhost:3003/admin/validation-list");
            if(myvalidations && myvalidations.data){
              setValidations(myvalidations.data.validations);
            }else{
              console.error('noting back from call to server');
            }
        }
        getValidations();
    },[])

    async function getIDImg(){

        let myImgUrl = await axios.get(`http://localhost:3003/admin/id-image?phone=${currentValidation.phone}`);
        if(myImgUrl){
            setImg(myImgUrl.data.link);
        }

    }

    useEffect(()=>{
        //console.log('updated - ', currentValidation)
        console.log('image',img)
    },[img])

    return (
        <>
        <h3>Update Validation</h3>
        <ValidationForm validation={currentValidation}></ValidationForm>
        <div className='img-preview-wrapper'>
                    <img id="previewImg" alt="preview image" src={img} className='img-preview'/>
        </div>
        <div><Button onClick={async ()=>{
            getIDImg();

        }}>Get Selfy</Button></div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Phone</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>State</th>
              <th>City</th>
              <th>valid</th>
              <th>idsample</th>
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
              <td>{itm.valid}</td>
              <td>{itm.idsample}</td>
              <td><Button onClick={()=>{
                setCurrentValidation(itm);
              }}>Load</Button></td>

            </tr>
            }) : <></>}
          
          </tbody>
        </Table>
        <hr></hr>
        

        </>
      );
}



export default ValidationList