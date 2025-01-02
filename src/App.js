import './App.css';
import Manage from './Manage';
import LoginComp from './LoginComp';
import {useState, useEffect} from "react";
import axios from 'axios';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import config from './config';
import NewVoterForm from './NewVoterForm';

export default function App() {

  const [user, setUser] = useState(null);


  useEffect(()=>{
    
    async function checkUser(){

      try{
        const loggedInUser = await axios.get(`${config.apiBaseUrl}/user`,{
        withCredentials:true
      });

        if(loggedInUser && loggedInUser.data){
          setUser(loggedInUser.data);
        }

      }catch(err){
        
      }
      
      
    }


    if(!user || user === undefined){
      checkUser();
    }


  },[user]);


  return (
    

    <BrowserRouter>
      <Routes>
        <Route path={user && user.email ? '/' : '/manage'} element={<Manage user={user} setUser={setUser} />}>
          <Route index element={<Manage  user={user} setUser={setUser} />} />
        </Route>
        <Route path={'/visual'} element={<NewVoterForm />}></Route>
        <Route path={user && user.email ? '/logout' : '/'}  element={<LoginComp  user={user} setUser={setUser} />} />
      </Routes>
    </BrowserRouter>
   
  );
}
