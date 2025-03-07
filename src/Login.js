import { NavLink, useNavigate } from 'react-router-dom';
import { UserContext } from './userContext';
import { useContext } from 'react';


export default function Login() {
    
    const {user,setUser} = useContext(UserContext);

    const nav = useNavigate();

    const logout = () => {
        
        document.cookie = "bToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;"
        setUser(false);
        nav('/')
        
    }

    return (
        <div>
            <div>{user?.email}</div>
        <div>{(user && user?.email ) ? (<a className="logout" onClick={()=>{logout();}} >Logout</a>):(<NavLink to="/">Login</NavLink>)}</div>
        </div>
        
    );
  }