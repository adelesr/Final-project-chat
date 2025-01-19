import React, { useEffect, useState } from 'react'
import { socket } from '../utils/socket.js';
import Chatbox from './chat components/Chatbox/Chatbox.jsx';
import ChatList from './chat components/Chatlist/ChatList.jsx';
import chatDB from "../assets/Mockedchats.js"
import EmptyChatBox from './chat components/Chatbox/EmptyChatBox.jsx';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import './chat components/chatStyle.css'
export const Context = React.createContext();


const ChatHomePage = () => {
  const [userMsg, setUserMsg] = useState('');
  const [currentChat, setCurrentChat] = useState();
  const [chatList, setChatList] = useState(chatDB);
  const [isLoading, setIsLoading] = useState(true)
  const {state}=useLocation();
  const {detailUser} = state;
  const [currentUserObject, setCurrentUserObject] = useState(detailUser);

  useEffect(() => {
   
    const verifyToken=async()=>{
      await axios.get('/api/v1/users/chat',{withCredentials: true}).then((res) => {
        setIsLoading(false);
        setTimeout(()=>{
        },0)
  
      }).catch(() => {
        setIsLoading(true);
        navigate('/');
      })
    }
    verifyToken();
    if(!isLoading){
      const handleReceiveMessage = (msg)=>{
        setCurrentChat((prevChat) => ({
          ...prevChat,
          messagesList: [msg,...prevChat.messagesList]
        }));
      }
      if(currentChat)
      {
        socket.emit('join-room',currentChat.chatId);
      }
      // chatList.map((c)=>{socket.emit('join-room',c.chatId)})
      socket.on("receiveMessage",handleReceiveMessage)
      return () => {
        socket.off("receiveMessage", handleReceiveMessage);
      };
    }

  },[currentChat])

  const selectChatHandler = (chatId)=>{
    if(!chatId)
      setCurrentChat()
    if(currentChat){
      const tempIndex = chatList.findIndex((c)=> c.chatId===currentChat.chatId)
      chatList[tempIndex] = currentChat;
    }
    const chat = chatList.find((c)=> c.chatId===chatId)
    setCurrentChat(chat)
  }
    
    const sendMessage = () =>{
      if(userMsg){
            const message = {currentUserObject,userMsg}
            socket.emit("sendMessage",message,currentChat.chatRoomName)            
            setUserMsg("")
          }
    }
  return (
    isLoading? (<div>Loading...</div>) : (
      <Context.Provider value={currentUserObject}>
      <div className='mainChatPage'>
        <div>
          {currentChat? 
            <Chatbox currentChat={currentChat} 
                      sendMessage={sendMessage}
                      setUserMsg={setUserMsg}
                      userMsg={userMsg}>
            </Chatbox>
            : <EmptyChatBox></EmptyChatBox> 
          }
        </div>
        <>
          <ChatList enetrChat={selectChatHandler} currentChat={currentChat} chatList={chatList} ></ChatList>
        </>
      </div>
    </Context.Provider>

    )
  )
}
export default ChatHomePage
