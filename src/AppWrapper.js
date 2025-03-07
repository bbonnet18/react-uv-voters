import './App.css';
import { useState, useEffect, useContext } from "react";
import { UserContext } from './userContext';
import App from './App';

export default function AppWrapper(){

      const [user, setUser] = useState("");// manage user at high level to keep for other views
      const [completed, setCompleted] = useState(false);
    
    return ( 
        <UserContext.Provider value={{user,setUser,completed, setCompleted}}>
        <App />
        </UserContext.Provider>
    )

}