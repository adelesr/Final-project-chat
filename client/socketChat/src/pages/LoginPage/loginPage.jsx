import React,{useState} from 'react'
import {Link, useNavigate} from 'react-router'
import ConnectByEmail from '../../components/ConnectByEmail/ConnectByEmail.jsx';
import axios from 'axios';
import './LoginPage.css';
const LoginPage = () => {
    const [errMsg, setErrMsg] = useState('')
    const [user, setUser] = useState({userName: '', password: ''})
    const [connectByEmail, setConnectByEmail] = useState(false)
    const navigate = useNavigate();

    const login=async(e)=>{
        e.preventDefault();
        await axios.post('/api/v1/users/login',user,{withCredentials: false}).then(res=>{
            setUser(res.data);
            console.log(res.data);
            // const token = res.data.token; 
            navigate('/chat');  
            //  axios.post('/api/v1/users/chat',user,{withCredentials:true}).then(
            // navigate('/chat')).catch(err=>console.log(err));
        }).catch(err=>{setErrMsg(err.response.data)
            console.log(err.response.data|| "not be found");
        });  
    }

    const connectByEmailHandler = () => {
        setConnectByEmail(!connectByEmail)

    }
  return (
    <div className=' backgroundImg'>
    <div className='loginPlaceHolder'></div>
    <div className="mainScreen">
        <div  className='formContent'>
            <form onSubmit={login}>
                <input type="text" placeholder="Username" className="inputText" value={user.userName} onChange={(e)=>setUser({...user, userName: e.target.value})} />
                <br/>
                <br/>
                <input type="password" placeholder="Password" className="inputText" value={user.password} onChange={(e)=>setUser({...user, password:e.target.value})}/>
                <br />
                <br />
                <button className='btnLogin'>Login</button>
                {errMsg? <p style={{color:'red'}}>{errMsg}</p>:''}
            </form>
            <p>Don't have an account? <Link to="/signUp">Sign up here</Link></p>
            <button className='connectByEmailBtn' onClick={connectByEmailHandler} >Want to connect with Email?</button> 
        </div>
        <div className='margineCenter'>
             
                {connectByEmail? (
                    <ConnectByEmail/>
                ): null }
        </div>
    </div>
    </div>
   
  )
}

export default LoginPage