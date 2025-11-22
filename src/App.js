import './App.css';
import { Container, Nav, Row, Col, Toast } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useState, useContext } from 'react';
import { UserContext } from './userContext';
import { Outlet } from 'react-router-dom';
import Login from './Login';



export default function App() {
  
  const {user,setUser,completed,setCompleted} = useContext(UserContext);
  return (

    <Container>
      <Row>
        <nav className='nav'>
            <ul>
              <li className='nav-itm'><NavLink to="/home">Home</NavLink></li>
              <li className='nav-itm'><NavLink to="/visual">Visual</NavLink></li>
              <li className='nav-itm'><NavLink to="/conduit">Conduit</NavLink></li>
              <li className='nav-itm'><NavLink to="/feeds">feeds</NavLink></li>
              <li className='nav-itm'><NavLink to="/receivers">Receivers</NavLink></li>
            </ul>
        </nav>
        <Col lg={4}>
          <Login user={user} setUser={setUser}></Login>
        </Col>
      </Row>
      <Row>
        <Outlet />
      </Row>
    </Container>

  );
}
