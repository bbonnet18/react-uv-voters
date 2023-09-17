import Table from "react-bootstrap/Table";

import { useState, useEffect } from "react";
import axios from "axios";

function DuplicateList ({newVoter}){
   
    var [duplicates,setDuplicates] = useState(null);
    useEffect(()=>{ 
        console.log('trying to get duplicates')
        async function getDuplicates(){
            duplicates = await axios.post("http://localhost:3003/admin/check-duplicates",newVoter);
            if(duplicates && duplicates.data){
              setDuplicates(duplicates.data);
            }else{
              console.error('noting back from call to server');
            }
        }
        getDuplicates();
    },[newVoter])

    return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Phone</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>State</th>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            { duplicates && duplicates.length ? duplicates.map((itm,ind)=>{
              return <tr key={ind}> 
              <td>{itm.phone}</td>
              <td>{itm.firstname}</td>
              <td>{itm.lastname}</td>
              <td>{itm.age}</td>
              <td>{itm.state}</td>
              <td>{itm.city}</td>
            </tr>
            }) : <></>}
          
          </tbody>
        </Table>
      );
}



export default DuplicateList