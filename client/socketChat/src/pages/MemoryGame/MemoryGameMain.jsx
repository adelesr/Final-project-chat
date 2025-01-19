import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
// import { socket } from '../../utils/socket.js'
import { socket } from '../../utils/socket.js';
import ContainerCardsGame from './ContainerCardsGame.jsx';
import { shuffledCardsArray } from '../../assets/memoryCardsArray.js';
import '../../Components/MemoryGameComponents/MemoryCard/MemoryCard.css';
import './MemoryGameMain.css'
const MemoryGamePage = () => {
  const navigate=useNavigate();
  const {state} = useLocation();
  let {currentUserObject,currentChat} = state;
  const {chatId} = currentChat;
  const [messageShow, setMessageShow] = useState("");
  const [LeaveMsg, setLeaveMsg] = useState("");
  const [participantsArr, setParticipantsArr] = useState([]);
  const [memoryCardsArr, setMemoryCardsArr] = useState(shuffledCardsArray);
  const [isLoading, setIsLoading] = useState(true);
  // let countPlayersPressLeave=0;

  useEffect(() => {
    socket.on('playerJoined',(arr) => {
      const message=arr[0]
      const participents=arr[1];
      setMessageShow(message);
      setParticipantsArr(participents);
      setIsLoading(false);
    });
    // socket.emit("joinGame",{user,chatId});
    socket.emit("joinGame",{currentUserObject,chatId});

    socket.on("exitFromGame",()=> {
      navigate("/chat",{state: {detailUser:currentUserObject}});
      socket.off('exitFromGame');
    })
    socket.on("playerLeftMessage",()=> {
      setLeaveMsg("The other player left the game");
      setTimeout(()=>{
        setLeaveMsg("");
        navigate("/chat",{state: {detailUser:currentUserObject}});
      },4000);
  });
    return () => {
      socket.off('playerJoined');
    }
  }, []);
 
  const userLeave=()=>{
      // countPlayersPressLeave+=1;
      socket.emit("leaveGame");
  }
  return (
    <div>
       { isLoading ? 
        ( <div className='gamePage'>
            <Spinner animation="border" variant="info" className='spinner'/>
          </div> ) :

         ( messageShow==="Game started" &&
           (<div>
                <div className="msgGame hideMessage">
                  {messageShow}
                </div>
                  <div className='MemoryGamePage'>
                    <button className="btnLeaveGame" onClick={userLeave}>Leave the Game👋</button>
                    <ContainerCardsGame players={participantsArr} wantToLeave={""} cards={memoryCardsArr} currentUser={currentUserObject}/>
                    { LeaveMsg &&
                      ( <div className="leaveGameMsg hideMessage">{LeaveMsg}👋</div>)
                    }
                  </div>
            </div> )
          )
      }       
    </div>
)

}
export default MemoryGamePage


