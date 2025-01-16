import React,{useEffect, useState} from 'react'
import axios from 'axios';
import { Link } from 'react-router';
import './signUpPage.css';
import { useNavigate } from'react-router';
import signupIcon from '../../assets/Images/LoginSignUpImg/signupIcon.png';

const SignUpPage = () => {
    const [user, setUser] = useState({userName: '', password: '',email: '',isFemale: false});
    const [message, setMessage] = useState('');
    const [signedUpSucssesfully, setSignedUpSucssesfully] = useState(false);

    const signUp=async(e)=>{
      e.preventDefault();
      await axios.post('/api/v1/users/signup',user).then(res=>{
        console.log(res.data);
        setMessage(res.data);
        setUser(res.data);
        setSignedUpSucssesfully(true);
      }).catch(err=>
        setMessage(err.response.data));
    }
    
    useEffect(() => {
        console.log('Resetting params:',{signedUpSucssesfully});
        if(signedUpSucssesfully){
          setUser({userName: '', password: '',email: '',isFemale: false});
          setSignedUpSucssesfully(false);
        }
    }, [signedUpSucssesfully])
    
  return (
    <div className='backgroundImgSignUp'>
    <div className='mainScreenSignUp'>
       <div className='signUpPlaceHolder'></div>
      <div className='signUp'>
        <img src={signupIcon} alt="" className='signupIcon'/>
        <form onSubmit={signUp}>
          <div>
            <label htmlFor='userName'>Enter your Username:</label>
            <br />
            <input type="text" className="inputText" placeholder="Username" value={user.userName} onChange={(e)=>setUser({...user,userName: e.target.value})}/>
          </div>
          <br />
          <div>
            <label htmlFor="password">Enter your password:</label>
            <br/>
            <input type="password" className="inputText" placeholder="Password" value={user.password} onChange={(e)=>setUser({...user,password:e.target.value})}/>
          </div>
          <br />
          <div>
            <label htmlFor="email">Enter your Email:</label>
            <br/>
            <input type="text" className="inputText" placeholder="Your Email Address" value={user.email} onChange={(e)=>setUser({...user,email: e.target.value})}/>
          </div>
          <div>
            <label htmlFor="isFemale">Female</label>
            <input type="checkbox" name='isFemale' value={user.isFemale} onChange={(e)=>setUser({...user,isFemale:!user.isFemale})}/>
          </div>
          <br />
            <button className='btnSign'>Sign up</button>
        </form>
          {message ? (message==="error"? 
          (<p style={{color:'red'}}>somthing get wrong, please try again</p>) : message=="signed up successfully, go to login page"?
          (<p style={{color:'green'}} >signed up successfully, go to <Link to="/">login</Link> page  </p>) : 
           (<p style={{color:'red'}}>{message}</p>)) 
            :''}
        <p>Already have an account? <Link to="/">Login here</Link></p>
      </div>

    </div>
    </div>
  )
}

export default SignUpPage