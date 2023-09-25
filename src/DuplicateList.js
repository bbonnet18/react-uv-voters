import { Spinner, Table} from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";

function DuplicateList ({newVoter,setDuplicatesfound}){
   
    const [duplicates,setDuplicates] = useState(null);
    const [loading,setLoading] = useState(false);

    useEffect(()=>{ 
     
        async function getDuplicates(){
            const duplicatesList = await axios.post("http://localhost:3003/admin/check-duplicates",newVoter);
            if(duplicatesList && duplicatesList.data){
              if(duplicatesList.data.length === 0){
                console.log('-------->>>>> No Dups!');
                setDuplicatesfound(false);
              }else{
                console.log('-------->>>>>Definite Dups!');
                setDuplicatesfound(true);
              }
              setDuplicates(duplicatesList.data);
              setLoading(false);
            }else{
              console.error('noting back from call to server');
              setDuplicatesfound(false);
              setLoading(false);
            }
        }
        if(newVoter && newVoter.lastname){
          setLoading(true);
            getDuplicates();
        }
         
        
    },[newVoter])

    return (
      <>
      {loading ?
        (<div class="loading-holder">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>) : (<Table striped bordered hover>
          <thead>
            <tr>
              <th>Phone</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Age</th>
              <th>State</th>
              <th>City</th>
              <th>ID Type</th>
              <th>ID Sample</th>
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
              <td>{itm.idtype}</td>
              <td>{itm.idsample}</td>
            </tr>
            }) : <></>}
          </tbody>
        </Table>)
      }</>
      );
}



export default DuplicateList