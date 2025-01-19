import React, { useEffect, useState } from 'react'
import MemoryCard from '../../Components/MemoryGameComponents/MemoryCard/MemoryCard.jsx';
import MemoryGameOver from '../../Components/MemoryGameComponents/memoryGameOver.jsx';
import './ContainerCardsGame.css';
import { socket } from '../../utils/socket.js';
import { useNavigate } from 'react-router-dom';
const ContainerCardsGame = ({players,cards,currentUser}) => {

  const navigate=useNavigate();
  const [winningMessage, setWinningMessage] = useState("");
  //במסך הצאט- אם לוחץ על המשחק המשתנה הופך לTRUE
  const [player1, setPlayer1] = useState({id: players[0].id,userName:players[0].userName,score:0,inTheGame:true});
  const [player2, setPlayer2] = useState({id: players[1].id,userName:players[1].userName,score:0,inTheGame:true});
  const [turn, setTurn] = useState(player1);
  const [countOfSelectedCards, setCountSelectedCards] = useState(0);
  const [cardsArr, setCardsArr] = useState(cards); //כל הכרטיסים בלוח
  const [prevCard, setPrevCard] = useState(null); //כרטיס קודם שנבחר

  useEffect(() => {
    if(turn.id!==currentUser.id)
    {
      socket.on("enemyMove",({card1,card2,user})=>{ //שליחת שני כרטיסים שהמשתמש סימן עם הסטטוס המעודכן שלהם ומי עשה את המהלך 
        const card1Index = cardsArr.findIndex((c)=>c.id == card1.id);
        const card2Index = cardsArr.findIndex((c)=>c.id == card2.id);

        cardsArr[card1Index] = card1;
        cardsArr[card2Index] = card2;
        setCardsArr(cardsArr);
        if(card1.status.includes("wrong") && card2.status.includes("wrong"))
        {
          setTimeout(()=>{
            const resetCardsArr = [...cardsArr];
            resetCardsArr[card1Index].status = "";
            resetCardsArr[card2Index].status = "";
            setCardsArr(resetCardsArr);
          },2000)
        }
        else {
          setPrevCard(null);
          increaseScore();
          setCardsArr(cardsArr);
        }
        setTurn(turn===player1 ? player2:player1); 
      })
    }
  }, [turn])
  
  const increaseScore=() =>{
    if(turn==player1)
        setPlayer1({...player1, score:player1.score+2});
    else {
        setPlayer2({...player2, score:player2.score+2});
      }
  }
  const checkGuesses=(card1Index,card2Index )=>{
    if(cardsArr[card1Index].imgSrc == cardsArr[card2Index].imgSrc)
    {
      cardsArr[card1Index].status =  'active correct';
      cardsArr[card2Index].status = 'active correct';
      increaseScore();
      setTimeout(()=>checkWinner(),0);
      setCardsArr(cardsArr);
    }
    else {
      const newCardsArr = [...cardsArr];
      newCardsArr[card1Index].status = 'active wrong';
      newCardsArr[card2Index].status = 'active wrong';
      setCardsArr(newCardsArr);
      setTimeout(()=>{
        const resetCardsArr = [...newCardsArr];
        resetCardsArr[card1Index].status = "";
        resetCardsArr[card2Index].status = "";
        setCardsArr(resetCardsArr);
      },2000)      
    }
    setPrevCard(null);
    socket.emit("sendSelectedCards", {card1: cardsArr[card1Index] ,card2: cardsArr[card2Index], user: turn } ); //שחקן 1
    setTurn(turn===player1 ? player2:player1); 
  }

  const gameOver=()=>{
    socket.on("exitFromGame",()=>{
      player1.inTheGame=false;
      player2.inTheGame=false;
      navigate("/chat",{state:{detailUser:currentUser}});
    })
    if(player1.inTheGame && player2.inTheGame)
    {
      socket.emit("leaveGame");
    }
  }
  const checkWinner=()=>{
    socket.on("gameOverMessage",(msg)=>{
      setWinningMessage(msg);
      setTimeout(()=>console.log(msg+ "is the message after set"),0);
    })
    socket.emit("gameOver", {player1,player2});
}

  const handleClick =(indexCard) => {
    //אם נבחרו פחות משני קלפים והקלף שנבחר אינו זהה לקלף הקודם
    if( (countOfSelectedCards<2) && (cardsArr[indexCard].id!==prevCard))
    {
      //אם הקלף שנבחר פנוי ולא מכיל בסטטוס את המילה נכון
      if(!cardsArr[indexCard].status.includes("correct"))
      { 
        cardsArr[indexCard].status = "active";
        setCardsArr([...cardsArr]);
        setCountSelectedCards(countOfSelectedCards+1);

        if(!prevCard) //אם זה הקלף הראשון שנבחר
        {
          setPrevCard(cardsArr[indexCard].id);
        }
        else { 
          checkGuesses(indexCard,cardsArr.findIndex((c)=>c.id == prevCard) );
          setCountSelectedCards(0);
        }
      }
    }
  }
  const classScorsPlayer1= (turn===player1) ? 'greenBorder': 'redBorder';
  const classScorsPlayer2= (turn===player2) ? 'greenBorder': 'redBorder';
  
  return (
    <div className='containerPage'>
       <h1 className='titleMemoryGame'>Memory Game</h1>

       <div className='containerScores'>
          <div className={"detailsUser "+classScorsPlayer1}>
              <h6>Player 1:</h6>
              <h3>{player1.userName}</h3>
              <h3>Score: {player1.score}</h3>
          </div>
          <div className={"detailsUser "+ classScorsPlayer2}>
              <h6>Player 2:</h6>
              <h3> {player2.userName}</h3>
              <h3>Score: {player2.score}</h3>
          </div>
       </div>

        {winningMessage && (
          <MemoryGameOver msgResult={winningMessage} leaveGame={gameOver}/>
         )}
          
          {!player1.inTheGame || !player2.inTheGame && (
            <div className='leaveGameMsg'>The other player leave the game...👋🤝</div>
          )}

        <div className='gameBoard'>
          {cardsArr.map((card,index) =>(
            <MemoryCard key={index} currentCard={card} indexCard={index} onClickCard={ (turn.id==currentUser.id) ? handleClick :{}}/>
          ))}
        </div>
    </div>
  )
}

export default ContainerCardsGame