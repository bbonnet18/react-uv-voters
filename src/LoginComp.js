
import { useEffect, useState } from "react";
import { Container,  Row, Col, Button } from "react-bootstrap";
import config from './config';


export default function LoginComp({user,setUser}) {


    return (

        <Container>
            <Row>
                <p>Login to U-Vote Admin</p>
                
               { user && user.email ? ( <a href={`${config.apiBaseUrl}/logout`} rel="noreferer" >Logout</a>) : ( <a href={`${config.apiBaseUrl}/login`} rel="noreferer" >Login</a>)}
            </Row>
        </Container>
    );
  }