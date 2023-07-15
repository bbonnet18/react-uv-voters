import Table from "react-bootstrap/Table";

import { useState, useEffect } from "react";
import axios from "axios";

function VoterList (){
   
    var [voters,setVoters] = useState(null);
    useEffect(()=>{ 
        async function getVoters(){
            voters = await axios.get("http://localhost:3003/admin/voter-list");
            if(voters && voters.data){
              
              setVoters(voters.data);
            }else{
              console.error('noting back from call to server');
            }
        }
        getVoters();
    },[])

    return (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            { voters && voters.length ? voters.map((itm,ind)=>{
              return <tr key={ind}> 
              <td>1</td>
              <td>{itm.firstname}</td>
              <td>{itm.lastname}</td>
              <td>@mdo</td>
            </tr>
            }) : <></>}
          
          </tbody>
        </Table>
      );
}



export default VoterList