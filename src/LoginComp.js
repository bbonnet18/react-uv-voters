
import { useEffect, useContext } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "./userContext";
import axios from 'axios';
import config from './config';
import getCookie from './getCookie';


export default function LoginComp() {

    const {user,setUser} = useContext(UserContext);
    const loc = useLocation();
    const nav = useNavigate();
    useEffect(()=>{
        let mounted = true;

        if(mounted){
            checkAuthCookie();
        }

        return () => mounted = false; 

      });

    async function checkAuthCookie (){
        const authCookie = getCookie('bToken');

        if(authCookie){
             await checkUser();
        }
    }


    async function checkUser() {
    
        try {
    
          const authCookie = getCookie("bToken") || "";
    
          const reqOpts = {
            headers: {
              "Authorization": `Bearer ${authCookie}`
            },
            withCredentials: true
          }
    
          const loggedInUser = await axios.get(`${config.apiBaseUrl}/user`, reqOpts);
    
          if (loggedInUser && loggedInUser.data.email) {
            setUser(loggedInUser.data);
            nav('/home')
          }
    
        } catch (err) {
          console.log('unable to retrieve user');
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