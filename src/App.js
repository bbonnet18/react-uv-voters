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
        <Col lg={8}>
              <div className='nav'><div><NavLink to="/home">Home</NavLink></div>
              <div><NavLink to="/visual">Visual</NavLink></div></div>
              <div><NavLink to="/conduit">Conduit</NavLink></div>
              <div><NavLink to="/feeds">Feeds</NavLink></div>
        </Col>
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
