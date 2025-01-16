import React from 'react'
import './memoryGameOver.css'
const MemoryGameOver = ({msgResult,anotherGame,leaveGame}) => {

  return (
    <div className='victoryImg'>
      <img src="src/assets/Images/cardsImg/victoryImg.png" alt="victory" className='img' />
         <div className="winnerMsgBody">
          <div style={{fontStyle:'oblique', fontSize:'30px', fontWeight:'bolder', color:'green'}}>{msgResult}</div>
            <div className='btnsContainer'>
                <button onClick={()=>anotherGame()}>Another Game</button>
                <button onClick={()=>leaveGame()}>Leave the Game</button>
            </div>
        </div>
    </div>
  )
}

export default MemoryGameOver