import './App.css';
import Manage from './Manage';
import LoginComp from './LoginComp';
import {useState, useEffect} from "react";
import { BrowserRouter, Routes, Route, Link} from "react-router-dom";
import getCookie from './getCookie';
import NewVoterForm from './NewVoterForm';
import Login from './Login';


export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);// manage user at high level to keep for other views

  return (
    /**
     * the check for the user will then render the LoginComp with the login link if 
     * there is no user, like is the case if user hasn't logged in yet
     */
    <BrowserRouter>
    <div>
    <ul>
          <li>
            <Link to="/home">Home</Link>
          </li>
          <li>
            <Link to="/visual">Live</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      <Login user={user} />
    </div>
    <div>
    <Routes>
        <Route path={'/'} element={<LoginComp loggedIn={loggedIn} setLoggedIn={setLoggedIn} />}>
        
        </Route>
      <Route path={'/home'} element={<Manage loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} >
        
      </Route>
      <Route path={'/visual'} element={<NewVoterForm/>}>
        
      </Route>
     
    </Routes>
    </div>
    </BrowserRouter>

    

   
  );
}
