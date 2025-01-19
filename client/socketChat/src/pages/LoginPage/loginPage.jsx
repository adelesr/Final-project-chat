import React,{useEffect, useState} from 'react'
import {Link, useNavigate} from 'react-router'
import ConnectByEmail from '../../components/ConnectByEmail/ConnectByEmail.jsx';
import axios from 'axios';
import './LoginPage.css';
const LoginPage = () => {
    const [errMsg, setErrMsg] = useState('')
    const [user, setUser] = useState({userName:'', password:''});
    const [detailUser, setDetailUser] = useState();
    const [connectByEmail, setConnectByEmail] = useState(false)
    const navigate = useNavigate();

    const login=async(e)=>{
        e.preventDefault();
        await axios.post('/api/v1/users/login',user,{withCredentials: true}).then(async(res)=>{
            console.log("user before setting:",detailUser);
            setDetailUser(res.data);
            setTimeout(() => {
                console.log("user after setting:",detailUser);
            }, 0);
            // navigate('/chat',{ state: {detailUser}});

            // await axios.get('/api/v1/users/chat',{withCredentials: true}).then(() => {
            //     // console.log(res.data, "enter");
            //     navigate('/chat',{ state: {detailUser}});
            // }).catch(() => navigate('/'))

        }).catch(err=>{setErrMsg(err.response.data)
            console.log(err.response.data|| "not be found");
        });  
    }

    useEffect(() => {
        console.log("Updated user in use Effect: ", detailUser);
        if(detailUser)
            navigate('/chat',{ state: {detailUser}});
    }, [detailUser]);
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