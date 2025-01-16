import React, { useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router';
import Spinner from 'react-bootstrap/Spinner';
import CorrectProcess from '../CorrectProcess.jsx';
import './ConnectByEmail.css';
const ConnectByEmail = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [isVerifySent, setIsVerifySent] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [messageVerifyCode, setMessageVerifyCode] = useState('');

    // const [sendCodeTwice, setSendCodeTwice] = useState(false)

    const sendVerifyCode = async (e)=>{
        e.preventDefault();
        setIsLoading(true);
        await axios.post('/api/v1/users/loginByEmail',{email}).then(res=>{
            setIsVerifySent(true);
            setIsLoading(false);
            setMessage(res.data)
        })
        .catch((err)=>{
            setIsLoading(false);
            setMessage(err.response.data)});
    }
    const verifyCode = async (e)=>{
        e.preventDefault();
        setMessage('');
        if (!code) {
            setMessageVerifyCode("Please enter the verification code you received");
            return;
        }
        await axios.post('/api/v1/users/verifyEnteryCode', {email, code}).then((res)=>{
            setMessageVerifyCode(res.data);
            console.log(messageVerifyCode);
            navigate('/chat');
        }).catch(err=>{setMessageVerifyCode(err.response.data)
            console.log("err: "+messageVerifyCode,"the code: "+code);

        });
    }
    // const SendVerifyCodeAgain=()=>{
    //     setMessageVerifyCode('');
    //     setMessage('');
    //     setCode('');

    //     setIsVerifySent(false);
    //     if(sendCodeTwice){
    //         sendVerifyCode();
    //     }
    //     setSendCodeTwice(false);
    // }
  return (
    <div className='emailDealing'>
            <form onSubmit={sendVerifyCode} className='emailForm'>
                <label htmlFor="email">Your email address: </label>
                <input type="text" id='email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <br />
                <br />
                <button>Send a verify code</button>
                {isLoading? (<Spinner animation="border" variant="success" />) : (
                    <CorrectProcess param={message} equalTo={"Verification code sent to your email"} 
                        succsesMsg={message} errMsg={message}/>)}
            </form>
            {isVerifySent ? (
            <div>
                 <div className='emailForm'>
                   <form onSubmit={verifyCode} >
                        <label htmlFor="">Enter the verify code: </label>
                        <input type="text" value={code} onChange={(e)=>setCode(e.target.value)}/>
                        <button className='sendEmailBtn'>Submit</button>
                    </form>
                    <div>
                        <CorrectProcess param={messageVerifyCode} equalTo={"Verification code is correct"} 
                            succsesMsg={ "passing to chat room..."} errMsg={messageVerifyCode}/>
                    </div>
                </div>
                
                
                {/* {messageVerifyCode==="Verification code has expired, please try again"? (
                    <>
                      <button onClick={()=>{
                        setSendCodeTwice(!sendCodeTwice)
                        SendVerifyCodeAgain();
                        }}>
                        send another code
                      </button>
                      {sendCodeTwice&&(
                        <div>
                            <form onSubmit={verifyCode}>
                                <label htmlFor="">Enter the verify code: </label>
                                <input type="text" value={code} onChange={(e)=>setCode(e.target.value)}/>
                                <button>Submit</button>
                            </form>
                        </div>)}
                    </>
                )
                :('')} */}
            </div>

        ): ('')}
    </div>
   
  )
}
export default ConnectByEmail