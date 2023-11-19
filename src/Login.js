import axios from "axios";
import {useState, useEffect} from "react";
import { NavLink } from 'react-router-dom';
import config from './config';

export default function Login({user}) {
    

    return (
        <div>
            <div>hello {user.email}</div>
        <div>{(user && user.email ) ? (<a href={`${config.apiBaseUrl}/logout`} rel="noreferer" >Logout</a>):(<NavLink to="/login">Login</NavLink>)}</div>
        </div>
        
    );
  }