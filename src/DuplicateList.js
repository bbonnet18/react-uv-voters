import { Spinner, Table} from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import config from './config';

function DuplicateList ({newVoter,setDuplicatesfound}){
   
    const [duplicates,setDuplicates] = useState(null);
    const [loading,setLoading] = useState(false);

    useEffect(()=>{ 
    

        async function getDuplicates(){
            const duplicatesList = await axios.post(`${config.apiBaseUrl}/admin/check-duplicates`,newVoter,{
              withCredentials:true
            });
            
            const duplicatesArr = duplicatesList.data;
            
            if(duplicatesArr && duplicatesArr.length){
              if(duplicatesArr.length === 0){
                console.log('-------->>>>> No Dups!');
                setDuplicatesfound(false);
              }else{
                console.log('-------->>>>>Definite Dups!');
                setDuplicatesfound(true);
              }
              setDuplicates(duplicatesArr);
              setLoading(false);
            }else{
              setDuplicatesfound(false);
              setLoading(false);
            }
        }

        if(newVoter && newVoter.lastname){
          console.log("new voter found - ", newVoter);
          setLoading(true);
            getDuplicates();
        }else{
          setLoading(false);
          setDuplicates(null);
        }
         
        
    },[newVoter])

    return (
      <>
      {loading ?
        (<div className="loading-holder">
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>) : (<Table striped bordered hover>
          <thead>
            <tr>
              <th>Phone</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>State</th>
              <th>City</th>
              <th>Zipcode</th>
              <th>Age</th>
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
              <td>{itm.address}</td>
              <td>{itm.age}</td>
              <td>{itm.state}</td>
              <td>{itm.city}</td>
              <td>{itm.zipcode}</td>
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