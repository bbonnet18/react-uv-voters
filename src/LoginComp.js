
import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import config from './config';
import getCookie from './getCookie';


export default function LoginComp({ setLoggedIn }) {

    const loc = useLocation();
    const nav = useNavigate();
    useEffect(()=>{
        let mounted = true;

        if(mounted){
            checkAuthCookie();
        }

        return () => mounted = false; 

      });

    function checkAuthCookie (){
    const authCookie = getCookie('bToken');
        if(authCookie){
            setLoggedIn(true);
            nav('/home');
        }
    }
   
    return (

        <Container>
            <Row>
                <p>Login to U-Vote Admin</p>

                <a href={`${config.apiBaseUrl}/login`} rel="noreferer" >Login</a>
            </Row>
        </Container>
    );
}