import axios from "axios";
import {useState, useEffect} from "react";
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import config from './config';

export default function Login({ user, setUser}) {
    

    const logout = () => {
        
        document.cookie = "bToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        setUser(false);
        document.location = `${config.apiBaseUrl}/logout`;
        
    }

    return (
        <div>
            <div>hello {user?.email}</div>
        <div>{(user && user?.email ) ? (<a onClick={()=>{logout();}} >Logout</a>):(<NavLink to="/">Login</NavLink>)}</div>
        </div>
        
    );
  }